"use client";

import Image from "next/image";
import Link from "next/link";

import { AiSummaryCollapsible } from "@/components/ai-summary-box";
import { useI18n } from "@/components/language-provider";
import { Timeline } from "@/components/timeline";
import type { NewsArticle } from "@/lib/types";
import { categoryLabelsUk } from "@/lib/strings";
import { readTime, timeAgo } from "@/lib/utils";

function sameLeadAsBody(summary: string, content: string) {
  const s = summary.trim();
  const c = content.trim();
  if (!s || !c) return true;
  if (s === c) return true;
  return c.startsWith(s.slice(0, Math.min(120, s.length)));
}

export function ArticleView({ story, related }: { story: NewsArticle; related: NewsArticle[] }) {
  const { t, locale } = useI18n();
  const showLead = story.summary.trim().length > 0 && !sameLeadAsBody(story.summary, story.content);

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-7 md:px-6">
      <div className="mb-5 space-y-3">
        <p className="text-xs uppercase tracking-wider text-cyan-300">
          {locale === "uk" ? categoryLabelsUk[story.category] ?? story.category : story.category}
        </p>
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">{story.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
          <span>{story.source}</span>
          <span aria-hidden>•</span>
          <span>{timeAgo(story.publishedAt)}</span>
          <span aria-hidden>•</span>
          <span>{readTime(story.content)}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Image src={story.image} alt={story.title} width={1600} height={900} className="h-[360px] w-full object-cover" priority />
      </div>

      {story.canonicalUrl ? (
        <p className="mt-4">
          <a
            href={story.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-cyan-400 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-300"
          >
            {t("articleReadOriginal")} ↗
          </a>
        </p>
      ) : null}

      <div className="mt-6 space-y-6">
        {showLead ? (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{t("articleLead")}</p>
            <p className="text-lg leading-relaxed text-zinc-300">{story.summary}</p>
          </div>
        ) : null}

        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-lg leading-8 text-zinc-100">{story.content}</div>
        </div>

        <AiSummaryCollapsible summary={story.aiSummary} keyPoints={story.aiKeyPoints} />
        <Timeline points={story.timeline} title={t("articleTimeline")} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
        <span>{t("articleShare")}:</span>
        <button type="button" className="rounded-lg border border-white/15 px-3 py-1 hover:bg-white/10">
          X
        </button>
        <button type="button" className="rounded-lg border border-white/15 px-3 py-1 hover:bg-white/10">
          LinkedIn
        </button>
        <button type="button" className="rounded-lg border border-white/15 px-3 py-1 hover:bg-white/10">
          {locale === "uk" ? "Посилання" : "Copy link"}
        </button>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">{t("articleRelated")}</h2>
        <div className="grid gap-3">
          {related.map((item) => (
            <Link key={item.id} href={`/article/${item.slug}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.07]">
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
