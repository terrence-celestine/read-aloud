export interface Chapter {
  id: string;
  title: string;
  content: string;
  duration?: number; // seconds, estimated later
}

export interface PlayerState {
  currentChapterId: string | null;
  isPlaying: boolean;
  progress: number; // 0–1
}
