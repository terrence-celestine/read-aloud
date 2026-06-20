import { useRef } from "react";
import { FileUp } from "lucide-react";
import { extractFromPdf } from "../utils/parsedPdf";
import { mapToChapters } from "../utils/parseChapters";
import type { Chapter } from "../types";

interface Props {
  onUpload: (chapters: Chapter[]) => void;
  onParsing: () => void;
}

export default function UploadZone({ onUpload, onParsing }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file || file.type !== "application/pdf") return;
    onParsing();
    const items = await extractFromPdf(file);
    const chapters = mapToChapters(items);
    onUpload(chapters);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
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
  );
}
