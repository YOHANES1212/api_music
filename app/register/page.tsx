"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "./actions";

const initialState: RegisterState = undefined;

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <div className="flex flex-1 items-center justify-center bg-black px-4 py-16">
      <div className="w-full max-w-sm rounded-xl bg-zinc-900 p-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Buat akun</h1>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm text-zinc-400">
              Nama
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="rounded-md bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
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
              minLength={8}
              className="rounded-md bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-full bg-green-500 py-2 font-semibold text-black transition-colors hover:bg-green-400 disabled:opacity-50"
          >
            {isPending ? "Memproses..." : "Daftar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-white underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
