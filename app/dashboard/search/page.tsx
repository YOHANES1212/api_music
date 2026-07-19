import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SearchClient from "./SearchClient";

export default async function SearchPage() {
  const session = await auth();
  const userId = session!.user.id;

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

  return (
    <SearchClient
      likedTrackIds={likedRows.map((r) => r.trackId)}
      playlists={playlists}
    />
  );
}
