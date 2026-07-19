import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TrackRow from "@/components/TrackRow";
import RemoveFromPlaylistButton from "@/components/RemoveFromPlaylistButton";
import type { Track } from "@/lib/jamendo";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const playlist = await prisma.playlist.findFirst({
    where: { id, userId },
    include: { tracks: { orderBy: { addedAt: "asc" } } },
  });

  if (!playlist) {
    notFound();
  }

  const tracks: Track[] = playlist.tracks.map((t) => ({
    id: t.trackId,
    title: t.title,
    artistName: t.artistName,
    albumName: "",
    albumImage: t.albumImage ?? "",
    audioUrl: t.audioUrl,
    duration: t.duration,
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
      {tracks.length === 0 ? (
        <p className="text-sm text-zinc-400">
          Playlist ini masih kosong. Tambahkan lagu lewat menu &quot;+
          Playlist&quot; di halaman Beranda atau Cari.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {tracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              tracks={tracks}
              trailing={
                <RemoveFromPlaylistButton
                  playlistId={playlist.id}
                  trackId={track.id}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
