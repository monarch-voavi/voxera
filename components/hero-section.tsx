import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NewsArticle } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function HeroSection({ article }: { article: NewsArticle }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10">
      <Image
        src={article.image}
        alt={article.title}
        width={1800}
        height={900}
        className="h-[430px] w-full object-cover opacity-80"
        priority
        sizes="100vw"
        quality={75}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.32),transparent_46%)]" />
      <div className="voxera-hero-content absolute bottom-0 left-0 max-w-3xl p-7 md:p-10">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-200">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" />
          LIVE BREAKING
        </span>
        <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">{article.title}</h1>
        <p className="mt-4 max-w-2xl text-sm text-zinc-200 md:text-base">{article.summary}</p>
        <div className="mt-6 flex items-center gap-3">
          <Button asChild>
            <Link href={`/article/${article.slug}`}>Read Full Coverage</Link>
          </Button>
          <Button variant="ghost">{timeAgo(article.publishedAt)}</Button>
        </div>
      </div>
    </section>
  );
}
