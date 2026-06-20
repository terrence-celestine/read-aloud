import { BookOpen } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-sm">
      <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center">
        <BookOpen size={28} className="text-indigo-400" />
      </div>
      <div>
        <p className="text-gray-200 font-semibold text-lg">
          No chapter selected
        </p>
        <p className="text-gray-500 text-sm mt-1 leading-relaxed">
          Choose a chapter from the sidebar to start listening and reading
          along.
        </p>
      </div>
      <div className="flex items-center gap-3 mt-2">
        {[
          { key: "Space", label: "Play / Pause" },
          { key: "←", label: "Prev" },
          { key: "→", label: "Next" },
        ].map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center gap-1.5 text-xs text-gray-500"
          >
            <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-400 font-mono text-xs">
              {key}
            </kbd>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
