"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const registered = searchParams.get("registered") === "1";
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (!result || result.error) {
        setError("Email atau password salah");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-sm rounded-xl bg-zinc-900 p-8">
      <h1 className="mb-6 text-2xl font-bold text-white">Masuk</h1>
      {registered && (
        <p className="mb-4 rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-400">
          Akun berhasil dibuat, silakan masuk.
        </p>
      )}
      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-zinc-400">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-md bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-zinc-400">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-md bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 rounded-full bg-green-500 py-2 font-semibold text-black transition-colors hover:bg-green-400 disabled:opacity-50"
        >
          {isPending ? "Memproses..." : "Masuk"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">
        Belum punya akun?{" "}
        <Link href="/register" className="text-white underline">
          Daftar
        </Link>
      </p>
    </div>
  );
}
