"use client";

import Image from "next/image";
import type { Track } from "@/lib/jamendo";
import { usePlayer } from "@/lib/player-context";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function TrackRow({
  track,
  index,
  tracks,
  trailing,
}: {
  track: Track;
  index: number;
  tracks: Track[];
  trailing?: React.ReactNode;
}) {
  const { playQueue, currentTrack, isPlaying } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;

  return (
    <div
      className={`group flex items-center gap-3 rounded-md px-3 py-2 hover:bg-zinc-800 ${
        isCurrent ? "bg-zinc-800/60" : ""
      }`}
    >
      <button
        onClick={() => playQueue(tracks, index)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="w-5 shrink-0 text-center text-sm text-zinc-400">
          {isCurrent && isPlaying ? "♫" : index + 1}
        </div>
        {track.albumImage ? (
          <Image
            src={track.albumImage}
            alt={track.title}
            width={40}
            height={40}
            className="rounded"
          />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded bg-zinc-700" />
        )}
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm font-medium ${
              isCurrent ? "text-green-400" : "text-white"
            }`}
          >
            {track.title}
          </p>
          <p className="truncate text-xs text-zinc-400">
            {track.artistName}
          </p>
        </div>
      </button>
      {trailing}
      <div className="shrink-0 text-xs text-zinc-400">
        {formatDuration(track.duration)}
      </div>
    </div>
  );
}
