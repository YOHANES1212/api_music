"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/dashboard", label: "Beranda", icon: "🏠" },
  { href: "/dashboard/search", label: "Cari", icon: "🔍" },
  { href: "/dashboard/library", label: "Koleksimu", icon: "📚" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col justify-between bg-black p-4 sm:flex">
      <div>
        <Link
          href="/dashboard"
          className="mb-8 block text-xl font-bold text-white"
        >
          🎵 Melodia
        </Link>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-md px-3 py-2 text-left text-sm font-medium text-zinc-400 hover:text-white"
      >
        Keluar
      </button>
    </aside>
  );
}
