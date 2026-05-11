import Link from "next/link";

import { NewsArticle } from "@/lib/types";

export function BreakingTicker({ headlines }: { headlines: NewsArticle[] }) {
  const text = headlines.map((h) => h.title).join("  •  ");
  if (!text) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50 py-3">
      <div className="flex items-center">
        <span className="ml-4 mr-3 inline-flex shrink-0 items-center gap-2 rounded-md border border-rose-500/40 bg-rose-500/20 px-2 py-1 text-xs font-bold text-rose-200">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          LIVE
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="voxera-ticker-track inline-flex whitespace-nowrap text-sm text-zinc-200">
            <span className="pr-16">
              {text}
              <span className="text-zinc-500"> • </span>
            </span>
            <span className="pr-16" aria-hidden>
              {text}
              <span className="text-zinc-500"> • </span>
            </span>
          </div>
        </div>
      </div>
      <div className="sr-only">
        {headlines.map((headline) => (
          <Link key={headline.id} href={`/article/${headline.slug}`}>
            {headline.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
