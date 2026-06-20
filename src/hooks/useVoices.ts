import { useEffect, useState } from "react";

export function useVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    function loadVoices() {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) setVoices(available);
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return voices;
}
