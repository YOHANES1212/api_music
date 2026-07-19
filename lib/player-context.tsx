"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Track } from "@/lib/jamendo";

type PlayerContextValue = {
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  playQueue: (tracks: Track[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const currentTrack = currentIndex >= 0 ? (queue[currentIndex] ?? null) : null;

  const playQueue = useCallback((tracks: Track[], startIndex: number) => {
    setQueue(tracks);
    setCurrentIndex(startIndex);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => (currentTrack ? !prev : prev));
  }, [currentTrack]);

  const next = useCallback(() => {
    setCurrentIndex((idx) => {
      if (idx < 0 || idx + 1 >= queue.length) return idx;
      return idx + 1;
    });
  }, [queue.length]);

  const prev = useCallback(() => {
    setCurrentIndex((idx) => (idx > 0 ? idx - 1 : idx));
  }, []);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
    setProgress(seconds);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.audioUrl;
    audio.volume = volume;
    setProgress(0);
    setDuration(0);
    audio.play().catch(() => setIsPlaying(false));
    // Only reload the <audio> element when the track itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      currentTrack,
      queue,
      currentIndex,
      isPlaying,
      progress,
      duration,
      volume,
      playQueue,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
    }),
    [
      currentTrack,
      queue,
      currentIndex,
      isPlaying,
      progress,
      duration,
      volume,
      playQueue,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={next}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return ctx;
}
