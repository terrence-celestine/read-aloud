import { useMemo, useEffect, useRef } from "react";

interface Props {
  title: string;
  content: string;
  charIndex: number;
  progress: number;
}

export default function ChapterReader({
  title,
  content,
  charIndex,
  progress,
}: Props) {
  const activeRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => {
    const result: { word: string; start: number }[] = [];
    const regex = /\S+/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      result.push({ word: match[0], start: match.index });
    }
    return result;
  }, [content]);

  const activeIndex = useMemo(() => {
    if (charIndex === 0) return -1;
    for (let i = words.length - 1; i >= 0; i--) {
      if (words[i].start <= charIndex) return i;
    }
    return -1;
  }, [charIndex, words]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      {/* Progress bar pinned to top */}
      <div className="sticky top-0 z-10 bg-gray-950">
        <div className="h-0.5 bg-gray-800 w-full">
          <div
            className="h-0.5 bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12">
        {/* Chapter title */}
        <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
          {title}
        </h2>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-10">
          <p className="text-xs text-gray-600 uppercase tracking-widest font-medium">
            {words.length.toLocaleString()} words
          </p>
          {progress > 0 && (
            <>
              <span className="text-gray-700">·</span>
              <p className="text-xs text-gray-600 uppercase tracking-widest font-medium">
                {Math.round(progress * 100)}% complete
              </p>
            </>
          )}
        </div>

        {/* Body text */}
        <p className="text-gray-300 text-lg leading-9 font-light tracking-wide">
          {words.map((w, i) => (
            <span
              key={i}
              ref={i === activeIndex ? activeRef : null}
              className={`transition-colors duration-75 ${
                i === activeIndex
                  ? "bg-indigo-500 text-white rounded px-0.5 -mx-0.5"
                  : i < activeIndex
                    ? "text-gray-600"
                    : "text-gray-300"
              }`}
            >
              {w.word}{" "}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
