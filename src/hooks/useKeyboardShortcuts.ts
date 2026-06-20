import { useEffect } from "react";

interface Shortcuts {
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function useKeyboardShortcuts({
  onTogglePlay,
  onPrev,
  onNext,
}: Shortcuts) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire if user is typing in an input or select
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          onTogglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrev();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTogglePlay, onPrev, onNext]);
}
