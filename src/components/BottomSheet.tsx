import { useEffect } from "react";
import { X } from "lucide-react";
import type { Chapter } from "../types";

interface Props {
  chapters: Chapter[];
  currentChapterId: string | null;
  isOpen: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function BottomSheet({
  chapters,
  currentChapterId,
  isOpen,
  onSelect,
  onClose,
}: Props) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-900 rounded-t-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "75vh" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
          <h2 className="font-semibold text-sm">Chapters</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Chapter list */}
        <ul
          className="overflow-y-auto"
          style={{ maxHeight: "calc(75vh - 80px)" }}
        >
          {chapters.map((chapter, i) => (
            <li key={chapter.id}>
              <button
                onClick={() => {
                  onSelect(chapter.id);
                  onClose();
                }}
                className={`w-full text-left px-5 py-3.5 text-sm transition-colors hover:bg-gray-800 flex items-center gap-3 ${
                  chapter.id === currentChapterId
                    ? "text-indigo-300 font-medium"
                    : "text-gray-300"
                }`}
              >
                <span className="text-gray-600 text-xs w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{chapter.title}</span>
                {chapter.id === currentChapterId && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
