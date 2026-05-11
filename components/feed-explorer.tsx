"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { NewsCard } from "@/components/news-card";
import { useI18n } from "@/components/language-provider";
import { categories, NewsArticle } from "@/lib/types";
import { categoryLabelsUk } from "@/lib/strings";

const PAGE_SIZE = 6;

export function FeedExplorer({ feed }: { feed: NewsArticle[] }) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const catLabel = (c: string) => (locale === "uk" ? categoryLabelsUk[c] ?? c : c);

  const filtered = useMemo(() => {
    return feed.filter((item) => {
      const categoryMatch = category === "All" || item.category === category;
      const queryText = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
      const queryMatch = query.trim().length === 0 || queryText.includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [category, feed, query]);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{t("navTrending")}</h2>
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-9 py-2.5 text-sm text-white outline-none focus:border-cyan-300/50"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[t("filterAll"), ...categories].map((label, i) => {
            const value = i === 0 ? "All" : categories[i - 1];
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setCategory(value);
                  setVisible(PAGE_SIZE);
                }}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  category === value ? "bg-cyan-400/20 text-cyan-200" : "border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08]"
                }`}
              >
                {i === 0 ? label : catLabel(value)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.slice(0, visible).map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
      {visible < filtered.length ? (
        <button
          type="button"
          onClick={() => setVisible((current) => current + PAGE_SIZE)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-sm hover:bg-white/[0.1]"
        >
          {t("loadMore")}
        </button>
      ) : null}
    </section>
  );
}
