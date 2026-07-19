import LikeButton from "@/components/LikeButton";
import AddToPlaylistMenu from "@/components/AddToPlaylistMenu";
import type { Track } from "@/lib/jamendo";

export default function TrackActions({
  track,
  liked,
  playlists,
}: {
  track: Track;
  liked: boolean;
  playlists: { id: string; name: string }[];
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <LikeButton track={track} initiallyLiked={liked} />
      <AddToPlaylistMenu track={track} playlists={playlists} />
    </div>
  );
}
