"use client";

import Image from "next/image";
import { usePlayer } from "@/lib/player-context";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
  } = usePlayer();

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="flex h-20 items-center gap-4 border-t border-zinc-800 bg-zinc-900 px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:w-64 sm:flex-none">
        {currentTrack.albumImage ? (
          <Image
            src={currentTrack.albumImage}
            alt={currentTrack.title}
            width={48}
            height={48}
            className="rounded"
          />
        ) : (
          <div className="h-12 w-12 rounded bg-zinc-700" />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {currentTrack.title}
          </p>
          <p className="truncate text-xs text-zinc-400">
            {currentTrack.artistName}
          </p>
        </div>
      </div>

      <div className="hidden flex-1 flex-col items-center gap-1 sm:flex">
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            className="text-zinc-400 hover:text-white"
            aria-label="Sebelumnya"
          >
            ⏮
          </button>
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black"
            aria-label={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            onClick={next}
            className="text-zinc-400 hover:text-white"
            aria-label="Berikutnya"
          >
            ⏭
          </button>
        </div>
        <div className="flex w-full max-w-md items-center gap-2 text-xs text-zinc-400">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={Math.min(progress, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1 flex-1 accent-green-500"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="hidden items-center gap-2 sm:flex sm:w-40">
        <span className="text-xs text-zinc-400">🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="h-1 flex-1 accent-green-500"
        />
      </div>

      <button
        onClick={togglePlay}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black sm:hidden"
        aria-label={isPlaying ? "Jeda" : "Putar"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
    </div>
  );
}
