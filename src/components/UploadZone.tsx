import { useRef, useState } from "react";
import { FileUp, BookOpen } from "lucide-react";
import { extractFromPdf } from "../utils/parsedPdf";
import { mapToChapters } from "../utils/parseChapters";
import type { Chapter } from "../types";

interface Props {
  onUpload: (chapters: Chapter[], title: string | null) => void;
  onParsing: () => void;
}

export default function UploadZone({ onUpload, onParsing }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingDemo, setLoadingDemo] = useState(false);

  async function handleFile(file: File) {
    if (!file || file.type !== "application/pdf") return;
    onParsing();
    const { chapters: items } = await extractFromPdf(file);
    const chapters = mapToChapters(items);
    // Strip the .pdf extension and use as title
    const title = file.name.replace(/\.pdf$/i, "");
    onUpload(chapters, title);
  }

  async function handleDemo() {
    setLoadingDemo(true);
    onParsing();
    try {
      const res = await fetch("/demo.pdf");
      const blob = await res.blob();
      const file = new File([blob], "demo.pdf", { type: "application/pdf" });
      const { chapters: items } = await extractFromPdf(file);
      const chapters = mapToChapters(items);
      onUpload(chapters, "The Jungle Book");
    } catch (e) {
      console.error("Failed to load demo PDF", e);
    } finally {
      setLoadingDemo(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          handleFile(file);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 rounded-2xl p-16 text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-900 transition-all"
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <FileUp size={48} className="mx-auto mb-4 text-gray-500" />
        <p className="text-lg font-semibold text-gray-300">Drop a PDF here</p>
        <p className="text-sm text-gray-500 mt-1">or click to upload</p>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <div className="h-px w-16 bg-gray-800" />
        or
        <div className="h-px w-16 bg-gray-800" />
      </div>

      <button
        onClick={handleDemo}
        disabled={loadingDemo}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <BookOpen size={16} />
        {loadingDemo ? "Loading demo…" : "Try with a sample book"}
      </button>
    </div>
  );
}
