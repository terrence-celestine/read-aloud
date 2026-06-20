import type { Chapter } from "../types";
import { FolderOpen } from "lucide-react";

interface Props {
  chapters: Chapter[];
  currentChapterId: string | null;
  onSelect: (id: string) => void;
  onNewFile: () => void;
}

export default function Sidebar({
  chapters,
  currentChapterId,
  onSelect,
  onNewFile,
}: Props) {
  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">ReadAloud</h1>
          <p className="text-xs text-gray-500 mt-0.5">Chapters</p>
        </div>
        {chapters.length > 0 && (
          <button
            onClick={onNewFile}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <FolderOpen size={13} />
            Open
          </button>
        )}
      </div>
      <ul className="flex-1 overflow-y-auto py-2">
        {chapters.map((chapter, i) => (
          <li key={chapter.id}>
            <button
              onClick={() => onSelect(chapter.id)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-800 ${
                chapter.id === currentChapterId
                  ? "bg-indigo-900 text-indigo-300 font-medium"
                  : "text-gray-300"
              }`}
            >
              <span className="text-gray-500 mr-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              {chapter.title}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
