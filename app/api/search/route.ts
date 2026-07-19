import { NextRequest, NextResponse } from "next/server";
import { searchTracks } from "@/lib/jamendo";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const tracks = await searchTracks(query);
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { tracks: [], error: "Gagal mencari lagu" },
      { status: 502 }
    );
  }
}
