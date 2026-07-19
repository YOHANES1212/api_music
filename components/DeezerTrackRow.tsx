import Image from "next/image";
import type { DeezerTrack } from "@/lib/deezer";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function DeezerTrackRow({ track }: { track: DeezerTrack }) {
  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-zinc-800">
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
        <p className="truncate text-sm font-medium text-white">
          {track.title}
        </p>
        <p className="truncate text-xs text-zinc-400">
          {track.artistName} · {track.albumName}
        </p>
      </div>
      <a
        href={track.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-full bg-[#A238FF] px-3 py-1 text-xs font-semibold text-white hover:bg-[#b565ff]"
      >
        Buka di Deezer
      </a>
      <div className="w-10 shrink-0 text-right text-xs text-zinc-400">
        {formatDuration(track.duration)}
      </div>
    </div>
  );
}
