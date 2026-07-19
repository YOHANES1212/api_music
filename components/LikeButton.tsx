"use client";

import { useState, useTransition } from "react";
import { likeTrack, unlikeTrack } from "@/app/dashboard/actions";
import type { Track } from "@/lib/jamendo";

export default function LikeButton({
  track,
  initiallyLiked,
}: {
  track: Track;
  initiallyLiked: boolean;
}) {
  const [liked, setLiked] = useState(initiallyLiked);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !liked;
    setLiked(next);
    startTransition(async () => {
      try {
        if (next) {
          await likeTrack(track);
        } else {
          await unlikeTrack(track.id);
        }
      } catch {
        setLiked(!next);
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={liked ? "Batalkan suka" : "Suka"}
      className={`shrink-0 px-1 text-lg ${
        liked ? "text-green-500" : "text-zinc-400 hover:text-white"
      }`}
    >
      {liked ? "♥" : "♡"}
    </button>
  );
}
