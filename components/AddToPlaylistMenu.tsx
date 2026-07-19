"use client";

import { useState, useTransition } from "react";
import { addTrackToPlaylist } from "@/app/dashboard/actions";
import type { Track } from "@/lib/jamendo";

export default function AddToPlaylistMenu({
  track,
  playlists,
}: {
  track: Track;
  playlists: { id: string; name: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  if (playlists.length === 0) {
    return null;
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const playlistId = e.target.value;
    e.target.value = "";
    if (!playlistId) return;
    startTransition(async () => {
      await addTrackToPlaylist(playlistId, track);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    });
  }

  return (
    <select
      onChange={handleChange}
      disabled={isPending}
      defaultValue=""
      className="shrink-0 rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300 outline-none"
      aria-label="Tambahkan ke playlist"
    >
      <option value="" disabled>
        {added ? "Ditambahkan!" : "+ Playlist"}
      </option>
      {playlists.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
