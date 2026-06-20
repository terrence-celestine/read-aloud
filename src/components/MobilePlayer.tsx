import { Play, Pause, SkipBack, SkipForward, Settings2 } from "lucide-react";
import type { Chapter } from "../types";
import { useState } from "react";

interface Props {
  chapter: Chapter | null;
  isPlaying: boolean;
  progress: number;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  rate: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  onRateChange: (rate: number) => void;
}

export default function MobilePlayer({
  chapter,
  isPlaying,
  progress,
  voices,
  selectedVoice,
  rate,
  onTogglePlay,
  onPrev,
  onNext,
  onVoiceChange,
  onRateChange,
}: Props) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="bg-gray-900 border-t border-gray-800">
      {/* Progress bar */}
      <div className="h-0.5 bg-gray-800">
        <div
          className="h-0.5 bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-3">
          <select
            value={selectedVoice?.name ?? ""}
            onChange={(e) => {
              const v = voices.find((v) => v.name === e.target.value);
              if (v) onVoiceChange(v);
            }}
            className="flex-1 bg-gray-800 text-gray-300 text-xs rounded-lg px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
          <select
            value={rate}
            onChange={(e) => onRateChange(Number(e.target.value))}
            className="bg-gray-800 text-gray-300 text-xs rounded-lg px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            {[0.75, 1, 1.25, 1.5, 1.75, 2].map((r) => (
              <option key={r} value={r}>
                {r}x
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center px-5 py-3 gap-4">
        {/* Track info */}
        <div className="flex-1 min-w-0">
          {chapter ? (
            <p className="text-sm font-medium truncate">{chapter.title}</p>
          ) : (
            <p className="text-sm text-gray-600">No chapter selected</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            onClick={onPrev}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={onNext}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward size={20} />
          </button>
          <button
            onClick={() => setShowSettings((s) => !s)}
            className={`transition-colors ${showSettings ? "text-indigo-400" : "text-gray-400 hover:text-white"}`}
          >
            <Settings2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
