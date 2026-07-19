"use client";

import { useTransition } from "react";
import { removeTrackFromPlaylist } from "@/app/dashboard/actions";

export default function RemoveFromPlaylistButton({
  playlistId,
  trackId,
}: {
  playlistId: string;
  trackId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(() => removeTrackFromPlaylist(playlistId, trackId))
      }
      disabled={isPending}
      className="shrink-0 text-xs text-zinc-400 hover:text-red-400"
    >
      Hapus
    </button>
  );
}
