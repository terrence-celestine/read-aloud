import type { Chapter } from "../types";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

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

export default function Player({
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
  return (
    <div className="bg-gray-900 border-t border-gray-800 px-6 py-3 flex flex-col gap-2">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-700 rounded-full">
        <div
          className="h-1 bg-indigo-500 rounded-full transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Track info */}
        <div className="w-56 truncate">
          {chapter ? (
            <>
              <p className="text-sm font-medium truncate">{chapter.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">ReadAloud</p>
            </>
          ) : (
            <p className="text-sm text-gray-600">No chapter selected</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 flex-1 justify-center">
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
        </div>

        {/* Voice + Speed */}
        <div className="flex items-center gap-3 w-56 justify-end">
          <select
            value={selectedVoice?.name ?? ""}
            onChange={(e) => {
              const v = voices.find((v) => v.name === e.target.value);
              if (v) onVoiceChange(v);
            }}
            className="bg-gray-800 text-gray-300 text-xs rounded-lg px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-indigo-500 max-w-36 truncate"
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
      </div>
    </div>
  );
}
    