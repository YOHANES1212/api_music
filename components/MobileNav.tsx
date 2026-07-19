"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Beranda", icon: "🏠" },
  { href: "/dashboard/search", label: "Cari", icon: "🔍" },
  { href: "/dashboard/library", label: "Koleksi", icon: "📚" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex border-t border-zinc-800 bg-black sm:hidden">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
              active ? "text-white" : "text-zinc-400"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
