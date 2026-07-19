import { NextRequest, NextResponse } from "next/server";
import { searchDeezerTracks } from "@/lib/deezer";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const tracks = await searchDeezerTracks(query);
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { tracks: [], error: "Gagal mencari di Deezer" },
      { status: 502 }
    );
  }
}
