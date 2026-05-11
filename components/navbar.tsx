"use client";

import Link from "next/link";

import { LanguageToggle } from "@/components/language-toggle";
import { useI18n } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { categories } from "@/lib/types";
import { categoryLabelsUk } from "@/lib/strings";

export function Navbar() {
  const { locale } = useI18n();
  const catLabel = (c: string) => (locale === "uk" ? categoryLabelsUk[c] ?? c : c);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 md:px-6">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-white">
          Voxera<span className="text-cyan-400">.live</span>
        </Link>
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 text-sm text-zinc-300 lg:flex">
          {categories.slice(0, 6).map((category) => (
            <button key={category} type="button" className="shrink-0 transition-colors hover:text-white">
              {catLabel(category)}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
