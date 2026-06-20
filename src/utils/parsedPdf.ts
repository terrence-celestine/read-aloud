import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const LIGATURES: Record<string, string> = {
  "\uFB00": "ff",
  "\uFB01": "fi",
  "\uFB02": "fl",
  "\uFB03": "ffi",
  "\uFB04": "ffl",
  "\uFB05": "st",
  "\uFB06": "st",
};

const NULL_BYTE_MAP: Record<string, string> = {
  nd: "fi",
  ection: "fl",
  res: "fl",
  ghting: "fi",
  ash: "fl",
  "": "ff",
  cult: "fi",
  cation: "fi",
  eet: "fl",
  ght: "fi",
};

function fixLigatures(text: string): string {
  return text
    .replace(/[\uFB00-\uFB06]/g, (char) => LIGATURES[char] ?? char)
    .replace(/\u0000(\w*)/g, (_, after) => {
      const replacement = NULL_BYTE_MAP[after];
      if (replacement) return replacement + after;
      // Log anything we haven't mapped yet
      console.warn(`Unmapped null byte: \\u0000 + "${after}"`);
      return "fi" + after; // safe fallback
    });
}

async function getPageText(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNum: number,
): Promise<string> {
  const page = await pdf.getPage(pageNum);
  const content = await page.getTextContent();
  const raw = content.items
    .map((item: any) => ("str" in item ? item.str : ""))
    .join(" ");
  return raw; // Return raw — fixing happens after logging
}

interface OutlineItem {
  title: string;
  dest: any;
  items: OutlineItem[];
}

export async function extractFromPdf(
  file: File,
): Promise<{ title: string; content: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const outline: OutlineItem[] = await pdf.getOutline();

  if (outline && outline.length > 0) {
    const resolved: { title: string; page: number }[] = [];

    for (const item of outline) {
      try {
        let pageIndex: number | null = null;

        if (typeof item.dest === "string") {
          const dest = await pdf.getDestination(item.dest);
          if (dest) {
            const ref = dest[0];
            pageIndex = await pdf.getPageIndex(ref);
          }
        } else if (Array.isArray(item.dest) && item.dest[0]) {
          pageIndex = await pdf.getPageIndex(item.dest[0]);
        }

        if (pageIndex !== null) {
          resolved.push({ title: item.title, page: pageIndex + 1 });
        }
      } catch {
        // Skip unresolvable outline items
      }
    }

    const chapters: { title: string; content: string }[] = [];

    for (let i = 0; i < resolved.length; i++) {
      const start = resolved[i].page;
      const end = resolved[i + 1]?.page ?? pdf.numPages;

      const pages: string[] = [];
      for (let p = start; p <= end; p++) {
        pages.push(await getPageText(pdf, p));
      }

      const raw = pages.join(" ").trim();

      // Log null bytes against raw text before fixing
      const nullMatches = [...raw.matchAll(/\u0000\w*/g)];
      if (nullMatches.length > 0) {
        const grouped: Record<string, { count: number; example: string }> = {};
        nullMatches.forEach((match) => {
          const after = match[0].slice(1);
          const idx = match.index ?? 0;
          const context = raw.slice(Math.max(0, idx - 10), idx + 15);
          if (!grouped[after]) {
            grouped[after] = { count: 0, example: context };
          }
          grouped[after].count++;
        });
      }

      // Fix ligatures after logging and push
      const content = fixLigatures(raw);
      chapters.push({ title: resolved[i].title, content });
    }

    return chapters;
  }

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const raw = await getPageText(pdf, i);
    pages.push(fixLigatures(raw));
  }

  return [{ title: "Full Document", content: pages.join(" ").trim() }];
}
