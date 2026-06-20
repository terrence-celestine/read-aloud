import { useEffect, useRef } from "react";

export function useTTS(
  text: string | null,
  isPlaying: boolean,
  voice: SpeechSynthesisVoice | null,
  rate: number,
  onEnd: () => void,
  onWord?: (charIndex: number) => void,
  onProgress?: (progress: number) => void,
) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    window.speechSynthesis.cancel();

    if (!text || !isPlaying) return;

    function speak() {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text!);
      utterance.rate = rate;
      utterance.pitch = 1;
      if (voice) utterance.voice = voice;
      utterance.onend = onEnd;
      utterance.onboundary = (e) => {
        if (e.name === "word") {
          onWord?.(e.charIndex);
          onProgress?.(e.charIndex / text!.length);
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    const timeout = setTimeout(speak, 200);

    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel();
    };
  }, [text, isPlaying, voice, rate]);
}
