import "server-only";

const DEEZER_API_BASE = "https://api.deezer.com";

export type DeezerTrack = {
  id: string;
  title: string;
  artistName: string;
  albumName: string;
  albumImage: string;
  externalUrl: string;
  duration: number;
};

type DeezerApiTrack = {
  id: number;
  title: string;
  duration: number;
  link: string;
  artist: { name: string };
  album: { title: string; cover_medium: string };
};

type DeezerSearchResponse = {
  data: DeezerApiTrack[];
};

function mapTrack(track: DeezerApiTrack): DeezerTrack {
  return {
    id: String(track.id),
    title: track.title,
    artistName: track.artist.name,
    albumName: track.album.title,
    albumImage: track.album.cover_medium,
    externalUrl: track.link,
    duration: track.duration,
  };
}

export async function searchDeezerTracks(
  query: string,
  limit = 10
): Promise<DeezerTrack[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const url = new URL(`${DEEZER_API_BASE}/search`);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Deezer search failed: ${response.status}`);
  }

  const data = (await response.json()) as DeezerSearchResponse;
  return (data.data ?? []).map(mapTrack);
}
