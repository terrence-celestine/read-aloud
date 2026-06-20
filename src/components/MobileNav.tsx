import { List, FileUp } from "lucide-react";

interface Props {
  title: string | null;
  onOpenChapters: () => void;
  onNewFile: () => void;
}

export default function MobileNav({ title, onOpenChapters, onNewFile }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
      <button
        onClick={onNewFile}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <FileUp size={20} />
      </button>
      <p className="text-sm font-semibold truncate max-w-[60%] text-center">
        {title ?? "ReadAloud"}
      </p>
      <button
        onClick={onOpenChapters}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <List size={20} />
      </button>
    </div>
  );
}
