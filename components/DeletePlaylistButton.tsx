"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePlaylist } from "@/app/dashboard/actions";

export default function DeletePlaylistButton({
  playlistId,
}: {
  playlistId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (!confirm("Hapus playlist ini?")) return;
        startTransition(async () => {
          await deletePlaylist(playlistId);
          router.refresh();
        });
      }}
      disabled={isPending}
      className="shrink-0 text-xs text-zinc-400 hover:text-red-400"
    >
      Hapus
    </button>
  );
}
