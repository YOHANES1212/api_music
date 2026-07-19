import "server-only";

const JAMENDO_API_BASE = "https://api.jamendo.com/v3.0";

export type Track = {
  id: string;
  title: string;
  artistName: string;
  albumName: string;
  albumImage: string;
  audioUrl: string;
  duration: number;
};

type JamendoTrack = {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  album_name: string;
  image: string;
  audio: string;
};

type JamendoResponse = {
  headers: { status: string; code: number; error_message: string };
  results: JamendoTrack[];
};

function getClientId(): string {
  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "JAMENDO_CLIENT_ID is not set. Get a free key at https://devportal.jamendo.com/ and add it to .env"
    );
  }
  return clientId;
}

function mapTrack(track: JamendoTrack): Track {
  return {
    id: track.id,
    title: track.name,
    artistName: track.artist_name,
    albumName: track.album_name,
    albumImage: track.image,
    audioUrl: track.audio,
    duration: track.duration,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchTracksOnce(params: Record<string, string>): Promise<Track[]> {
  const url = new URL(`${JAMENDO_API_BASE}/tracks/`);
  url.searchParams.set("client_id", getClientId());
  url.searchParams.set("format", "json");
  url.searchParams.set("audioformat", "mp32");
  url.searchParams.set("include", "musicinfo");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Jamendo request failed: ${response.status}`);
  }

  const data = (await response.json()) as JamendoResponse;
  if (data.headers.status !== "success") {
    throw new Error(data.headers.error_message || "Jamendo request failed");
  }

  return data.results.map(mapTrack);
}

// Jamendo's API is flaky: identical requests intermittently come back with
// zero results even though matching tracks exist. Retry a couple of times
// before giving up, since a near-immediate retry usually succeeds.
async function fetchTracks(
  params: Record<string, string>,
  retries = 2
): Promise<Track[]> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const tracks = await fetchTracksOnce(params);
    if (tracks.length > 0 || attempt === retries) {
      return tracks;
    }
    await sleep(250);
  }
  return [];
}

export function getFeaturedTracks(limit = 12): Promise<Track[]> {
  return fetchTracks({ limit: String(limit), order: "releasedate_desc" });
}

export function getPopularTracks(limit = 12): Promise<Track[]> {
  return fetchTracks({ limit: String(limit), order: "popularity_month" });
}

export function searchTracks(query: string, limit = 24): Promise<Track[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return Promise.resolve([]);
  }
  return fetchTracks({ limit: String(limit), namesearch: trimmed });
}
