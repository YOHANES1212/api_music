import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TrackRow from "@/components/TrackRow";
import TrackActions from "@/components/TrackActions";
import CreatePlaylistForm from "@/components/CreatePlaylistForm";
import DeletePlaylistButton from "@/components/DeletePlaylistButton";
import type { Track } from "@/lib/jamendo";

export default async function LibraryPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [likedTracks, playlists] = await Promise.all([
    prisma.likedTrack.findMany({
      where: { userId },
      orderBy: { likedAt: "desc" },
    }),
    prisma.playlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { tracks: true } } },
    }),
  ]);

  const tracks: Track[] = likedTracks.map((t) => ({
    id: t.trackId,
    title: t.title,
    artistName: t.artistName,
    albumName: "",
    albumImage: t.albumImage ?? "",
    audioUrl: t.audioUrl,
    duration: t.duration,
  }));

  const playlistOptions = playlists.map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="mb-3 text-xl font-bold text-white">
          Lagu yang Disukai
        </h2>
        {tracks.length === 0 ? (
          <p className="text-sm text-zinc-400">
            Belum ada lagu yang disukai. Klik ikon hati pada lagu untuk
            menyimpannya di sini.
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
                  <TrackActions
                    track={track}
                    liked
                    playlists={playlistOptions}
                  />
                }
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">Playlist Kamu</h2>
        <CreatePlaylistForm />
        <div className="mt-4 flex flex-col gap-2">
          {playlists.length === 0 && (
            <p className="text-sm text-zinc-400">
              Belum ada playlist. Buat satu di atas.
            </p>
          )}
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center justify-between rounded-md bg-zinc-900 px-4 py-3"
            >
              <Link
                href={`/dashboard/playlists/${playlist.id}`}
                className="text-white hover:underline"
              >
                {playlist.name}
                <span className="ml-2 text-xs text-zinc-400">
                  {playlist._count.tracks} lagu
                </span>
              </Link>
              <DeletePlaylistButton playlistId={playlist.id} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
