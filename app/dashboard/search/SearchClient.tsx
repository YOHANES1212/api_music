"use client";

import { useEffect, useMemo, useState } from "react";
import TrackRow from "@/components/TrackRow";
import TrackActions from "@/components/TrackActions";
import DeezerTrackRow from "@/components/DeezerTrackRow";
import type { Track } from "@/lib/jamendo";
import type { DeezerTrack } from "@/lib/deezer";

export default function SearchClient({
  likedTrackIds,
  playlists,
}: {
  likedTrackIds: string[];
  playlists: { id: string; name: string }[];
}) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deezerTracks, setDeezerTracks] = useState<DeezerTrack[]>([]);
  const [deezerLoading, setDeezerLoading] = useState(false);
  const [deezerError, setDeezerError] = useState<string | null>(null);
  const likedSet = useMemo(() => new Set(likedTrackIds), [likedTrackIds]);

  useEffect(() => {
    const trimmed = query.trim();
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      if (!trimmed) {
        setTracks([]);
        setError(null);
        setIsLoading(false);
        setDeezerTracks([]);
        setDeezerError(null);
        setDeezerLoading(false);
        return;
      }

      setIsLoading(true);
      setDeezerLoading(true);

      const jamendoRequest = fetch(
        `/api/search?q=${encodeURIComponent(trimmed)}`,
        { signal: controller.signal }
      )
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error ?? "Gagal mencari lagu");
          }
          setTracks(data.tracks);
          setError(null);
        })
        .catch((err) => {
          if ((err as Error).name !== "AbortError") {
            setError((err as Error).message);
          }
        })
        .finally(() => setIsLoading(false));

      const deezerRequest = fetch(
        `/api/deezer-search?q=${encodeURIComponent(trimmed)}`,
        { signal: controller.signal }
      )
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error ?? "Gagal mencari di Deezer");
          }
          setDeezerTracks(data.tracks);
          setDeezerError(null);
        })
        .catch((err) => {
          if ((err as Error).name !== "AbortError") {
            setDeezerError((err as Error).message);
          }
        })
        .finally(() => setDeezerLoading(false));

      await Promise.all([jamendoRequest, deezerRequest]);
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="flex flex-col gap-8">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari lagu atau artis..."
        className="w-full max-w-xl rounded-full bg-zinc-800 px-5 py-3 text-white outline-none focus:ring-2 focus:ring-green-500"
        autoFocus
      />

      <section>
        <h2 className="mb-3 text-lg font-bold text-white">
          Bisa Diputar di Sini
        </h2>
        {isLoading && <p className="text-sm text-zinc-400">Mencari...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!isLoading && !error && query.trim() && tracks.length === 0 && (
          <p className="text-sm text-zinc-400">
            Tidak ada hasil untuk &quot;{query}&quot;
          </p>
        )}
        <div className="flex flex-col gap-1">
          {tracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              tracks={tracks}
              trailing={
                <TrackActions
                  track={track}
                  liked={likedSet.has(track.id)}
                  playlists={playlists}
                />
              }
            />
          ))}
        </div>
      </section>

      {query.trim() && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-white">
            Ditemukan di Deezer
          </h2>
          <p className="mb-3 text-xs text-zinc-500">
            Metadata resmi dari Deezer — buka di Deezer untuk mendengarkan
            penuh.
          </p>
          {deezerLoading && (
            <p className="text-sm text-zinc-400">Mencari...</p>
          )}
          {deezerError && (
            <p className="text-sm text-red-500">{deezerError}</p>
          )}
          {!deezerLoading && !deezerError && deezerTracks.length === 0 && (
            <p className="text-sm text-zinc-400">Tidak ada hasil.</p>
          )}
          <div className="flex flex-col gap-1">
            {deezerTracks.map((track) => (
              <DeezerTrackRow key={track.id} track={track} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
