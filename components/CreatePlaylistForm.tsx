"use client";

import { useRef } from "react";
import { createPlaylist } from "@/app/dashboard/actions";

export default function CreatePlaylistForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createPlaylist(formData);
        formRef.current?.reset();
      }}
      className="flex gap-2"
    >
      <input
        name="name"
        placeholder="Nama playlist baru"
        required
        className="w-full max-w-xs rounded-md bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        type="submit"
        className="rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400"
      >
        Buat
      </button>
    </form>
  );
}
