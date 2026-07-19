import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getFeaturedTracks, getPopularTracks, type Track } from "@/lib/jamendo";
import TrackRow from "@/components/TrackRow";
import TrackActions from "@/components/TrackActions";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  let featured: Track[] = [];
  let popular: Track[] = [];
  let error: string | null = null;

  try {
    [featured, popular] = await Promise.all([
      getFeaturedTracks(),
      getPopularTracks(),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Gagal memuat lagu";
  }

  if (error) {
    return (
      <div className="rounded-lg border border-yellow-600/40 bg-yellow-500/10 p-6 text-sm text-yellow-200">
        <p className="font-semibold">Tidak bisa memuat musik</p>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  const [likedRows, playlists] = await Promise.all([
    prisma.likedTrack.findMany({
      where: { userId },
      select: { trackId: true },
    }),
    prisma.playlist.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const likedIds = new Set(likedRows.map((r) => r.trackId));

  function renderSection(title: string, tracks: Track[]) {
    return (
      <section key={title}>
        <h2 className="mb-3 text-xl font-bold text-white">{title}</h2>
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
                  liked={likedIds.has(track.id)}
                  playlists={playlists}
                />
              }
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {renderSection("Rilisan Terbaru", featured)}
      {renderSection("Populer Bulan Ini", popular)}
    </div>
  );
}
