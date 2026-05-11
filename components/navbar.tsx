import Link from "next/link";

import { categories } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Voxera<span className="text-cyan-400">.live</span>
        </Link>
        <div className="hidden items-center gap-4 text-sm text-zinc-300 lg:flex">
          {categories.slice(0, 6).map((category) => (
            <button key={category} className="transition-colors hover:text-white">
              {category}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
