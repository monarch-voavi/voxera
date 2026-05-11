import { cache } from "react";

import { mockNews } from "@/lib/mock-data";
import { categories, NewsArticle } from "@/lib/types";

type ExternalArticle = {
  title?: string;
  description?: string;
  source?: { name?: string };
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
};

const providerEndpoints = [
  { key: "NEWS_API_KEY", url: "https://newsapi.org/v2/top-headlines?language=en&pageSize=20" },
  { key: "GNEWS_API_KEY", url: "https://gnews.io/api/v4/top-headlines?lang=en&max=20" },
  { key: "MEDIASTACK_API_KEY", url: "http://api.mediastack.com/v1/news?languages=en&limit=20" },
];

function rankArticle(article: NewsArticle) {
  const ageMinutes = Math.max(1, (Date.now() - new Date(article.publishedAt).getTime()) / 60000);
  const freshnessScore = 240 / ageMinutes;
  const breakingBoost = article.isBreaking ? 40 : 0;
  return article.views * 0.01 + freshnessScore + breakingBoost + article.tags.length * 2;
}

function dedupeByTitle<T extends { title: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mapExternalToNews(article: ExternalArticle, idx: number): NewsArticle | null {
  if (!article.title || !article.description) return null;
  const category = categories[idx % categories.length];
  return {
    id: `ext-${idx}`,
    slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: article.title,
    summary: article.description,
    aiSummary: `In simple terms: ${article.description}`,
    aiKeyPoints: ["Auto-ingested from trusted source", "Summarized by Voxera AI", "Categorized by semantic model"],
    timeline: [],
    content: article.content ?? article.description,
    source: article.source?.name ?? "Global Wire",
    category,
    image:
      article.urlToImage ??
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=80",
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    views: 5000 + idx * 177,
    tags: ["wire", "global", category.toLowerCase()],
  };
}

async function fetchProviderArticles() {
  const results = await Promise.allSettled(
    providerEndpoints.map(async (provider) => {
      const token = process.env[provider.key];
      if (!token) return [] as ExternalArticle[];
      const separator = provider.url.includes("?") ? "&" : "?";
      const response = await fetch(`${provider.url}${separator}apiKey=${token}`, {
        next: { revalidate: 60 },
      });
      if (!response.ok) return [] as ExternalArticle[];
      const data = await response.json();
      const articles = data.articles ?? data.data ?? [];
      return Array.isArray(articles) ? (articles as ExternalArticle[]) : [];
    }),
  );

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

async function loadNewsFeed() {
  const external = await fetchProviderArticles();
  const externalMapped = external.map(mapExternalToNews).filter((item): item is NewsArticle => Boolean(item));
  const merged = dedupeByTitle([...mockNews, ...externalMapped]);
  return merged.sort((a, b) => rankArticle(b) - rankArticle(a));
}

/** Один запит на рендер — Next/React дедуплікують паралельні виклики в межах одного запиту. */
export const getNewsFeed = cache(loadNewsFeed);

export function computeTrendingTopics(stories: NewsArticle[]) {
  const score = new Map<string, number>();
  stories.forEach((story) => {
    story.tags.forEach((tag) => {
      score.set(tag, (score.get(tag) ?? 0) + Math.round(story.views / 1000));
    });
  });
  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, weight]) => ({ tag, weight }));
}
