"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Track } from "@/lib/jamendo";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Anda harus masuk terlebih dahulu");
  }
  return session.user.id;
}

export async function likeTrack(track: Track) {
  const userId = await requireUserId();
  await prisma.likedTrack.upsert({
    where: { userId_trackId: { userId, trackId: track.id } },
    update: {},
    create: {
      userId,
      trackId: track.id,
      title: track.title,
      artistName: track.artistName,
      albumImage: track.albumImage,
      audioUrl: track.audioUrl,
      duration: track.duration,
    },
  });
  revalidatePath("/dashboard/library");
}

export async function unlikeTrack(trackId: string) {
  const userId = await requireUserId();
  await prisma.likedTrack.deleteMany({ where: { userId, trackId } });
  revalidatePath("/dashboard/library");
}

export async function createPlaylist(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await prisma.playlist.create({ data: { name, userId } });
  revalidatePath("/dashboard/library");
}

export async function deletePlaylist(playlistId: string) {
  const userId = await requireUserId();
  await prisma.playlist.deleteMany({ where: { id: playlistId, userId } });
  revalidatePath("/dashboard/library");
}

export async function addTrackToPlaylist(playlistId: string, track: Track) {
  const userId = await requireUserId();
  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId },
  });
  if (!playlist) {
    throw new Error("Playlist tidak ditemukan");
  }

  await prisma.playlistTrack.upsert({
    where: { playlistId_trackId: { playlistId, trackId: track.id } },
    update: {},
    create: {
      playlistId,
      trackId: track.id,
      title: track.title,
      artistName: track.artistName,
      albumImage: track.albumImage,
      audioUrl: track.audioUrl,
      duration: track.duration,
    },
  });
  revalidatePath(`/dashboard/playlists/${playlistId}`);
}

export async function removeTrackFromPlaylist(
  playlistId: string,
  trackId: string
) {
  const userId = await requireUserId();
  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId },
  });
  if (!playlist) {
    throw new Error("Playlist tidak ditemukan");
  }
  await prisma.playlistTrack.deleteMany({ where: { playlistId, trackId } });
  revalidatePath(`/dashboard/playlists/${playlistId}`);
}
