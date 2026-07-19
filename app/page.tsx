import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black px-6 text-center">
      <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
        🎵 Melodia
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-400">
        Dengarkan musik indie dan Creative Commons sepuasnya. Buat playlist,
        simpan lagu favorit, dan temukan artis baru.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/register"
          className="rounded-full bg-green-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-green-400"
        >
          Daftar Gratis
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-zinc-700 px-6 py-3 font-semibold text-white transition-colors hover:border-zinc-500"
        >
          Masuk
        </Link>
      </div>
    </div>
  );
}
