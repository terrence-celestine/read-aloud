import { useState } from "react";
import type { Chapter, PlayerState } from "./types";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import MobileNav from "./components/MobileNav";
import MobilePlayer from "./components/MobilePlayer";
import BottomSheet from "./components/BottomSheet";
import UploadZone from "./components/UploadZone";
import ChapterReader from "./components/ChapterReader";
import EmptyState from "./components/EmptyState";
import { useTTS } from "./hooks/useTTS";
import { useVoices } from "./hooks/useVoices";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

// Outside component — not a hook, just a utility
function isMobile() {
  return window.innerWidth < 768;
}

export default function App() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [player, setPlayer] = useState<PlayerState>({
    currentChapterId: null,
    isPlaying: false,
    progress: 0,
  });
  const [rate, setRate] = useState(1);
  const [charIndex, setCharIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState<string | null>(null);

  const voices = useVoices();
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const mobile = isMobile();

  const currentChapter =
    chapters.find((c) => c.id === player.currentChapterId) ?? null;

  function handleUpload(parsed: Chapter[], title: string | null) {
    setChapters(parsed);
    setBookTitle(title);
    setIsParsing(false);
    setPlayer({
      currentChapterId: parsed[0]?.id ?? null,
      isPlaying: false,
      progress: 0,
    });
  }

  function handleNewFile() {
    window.speechSynthesis.cancel();
    setChapters([]);
    setBookTitle(null);
    setPlayer({ currentChapterId: null, isPlaying: false, progress: 0 });
    setCharIndex(0);
  }

  function selectChapter(id: string) {
    window.speechSynthesis.cancel();
    setCharIndex(0);
    setPlayer({ currentChapterId: id, isPlaying: false, progress: 0 });
  }

  function skipChapter(direction: "prev" | "next") {
    window.speechSynthesis.cancel();
    const ids = chapters.map((c) => c.id);
    const idx = ids.indexOf(player.currentChapterId ?? "");
    const next = direction === "next" ? idx + 1 : idx - 1;
    if (next >= 0 && next < ids.length) {
      setCharIndex(0);
      setPlayer({ currentChapterId: ids[next], isPlaying: false, progress: 0 });
    }
  }

  function togglePlay() {
    if (!player.isPlaying) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.cancel();
    }
    setPlayer((p) => ({ ...p, isPlaying: !p.isPlaying }));
  }

  // Keyboard shortcuts — after all handlers are defined
  useKeyboardShortcuts({
    onTogglePlay: togglePlay,
    onPrev: () => skipChapter("prev"),
    onNext: () => skipChapter("next"),
  });

  useTTS(
    currentChapter?.content ?? null,
    player.isPlaying,
    selectedVoice,
    rate,
    () => skipChapter("next"),
    setCharIndex,
    (progress) => setPlayer((p) => ({ ...p, progress })),
  );

  const playerProps = {
    chapter: currentChapter,
    isPlaying: player.isPlaying,
    progress: player.progress,
    voices,
    selectedVoice,
    rate,
    onTogglePlay: togglePlay,
    onPrev: () => skipChapter("prev"),
    onNext: () => skipChapter("next"),
    onVoiceChange: setSelectedVoice,
    onRateChange: setRate,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {mobile && (
        <MobileNav
          title={
            currentChapter?.title ?? (chapters.length > 0 ? "ReadAloud" : null)
          }
          onOpenChapters={() => setSheetOpen(true)}
          onNewFile={handleNewFile}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {!mobile && (
          <Sidebar
            chapters={chapters}
            currentChapterId={player.currentChapterId}
            onSelect={selectChapter}
            onNewFile={handleNewFile}
            bookTitle={bookTitle}
          />
        )}

        <main className={`flex-1 overflow-hidden ${mobile ? "pb-24" : ""}`}>
          {!isParsing && chapters.length === 0 && (
            <div className="h-full flex items-center justify-center px-6">
              <UploadZone
                onUpload={handleUpload}
                onParsing={() => setIsParsing(true)}
              />
            </div>
          )}
          {isParsing && (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                <div>
                  <p className="text-gray-300 font-medium">Parsing PDF</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Extracting chapters and text…
                  </p>
                </div>
              </div>
            </div>
          )}
          {currentChapter && (
            <ChapterReader
              title={currentChapter.title}
              content={currentChapter.content}
              charIndex={charIndex}
              progress={player.progress}
            />
          )}
          {!isParsing && chapters.length > 0 && !currentChapter && (
            <div className="h-full flex items-center justify-center">
              <EmptyState />
            </div>
          )}
        </main>
      </div>

      {!mobile && <Player {...playerProps} />}

      {mobile && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <MobilePlayer {...playerProps} />
        </div>
      )}

      <BottomSheet
        chapters={chapters}
        currentChapterId={player.currentChapterId}
        isOpen={sheetOpen}
        onSelect={selectChapter}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
