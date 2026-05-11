import { cache } from "react";

import { mockNews } from "@/lib/mock-data";
import { categories, NewsArticle } from "@/lib/types";
import { slugify } from "@/lib/utils";

type ExternalArticle = {
  title?: string;
  description?: string;
  source?: { name?: string };
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
  /** Пряме посилання на матеріал (NewsAPI, RSS тощо). */
  url?: string;
};

/** Кожен провайдер: env-змінна + URL без секрету + ім’я query-параметра для ключа (у кожного API своє). */
const apiProviders: { envKey: string; queryName: "apiKey" | "token" | "access_key"; url: string }[] = [
  { envKey: "NEWS_API_KEY", queryName: "apiKey", url: "https://newsapi.org/v2/top-headlines?language=en&pageSize=100" },
  {
    envKey: "NEWS_API_KEY",
    queryName: "apiKey",
    url: "https://newsapi.org/v2/top-headlines?language=en&category=technology&pageSize=100",
  },
  {
    envKey: "NEWS_API_KEY",
    queryName: "apiKey",
    url: "https://newsapi.org/v2/top-headlines?language=en&category=business&pageSize=100",
  },
  { envKey: "GNEWS_API_KEY", queryName: "token", url: "https://gnews.io/api/v4/top-headlines?lang=en&max=50" },
  { envKey: "MEDIASTACK_API_KEY", queryName: "access_key", url: "http://api.mediastack.com/v1/news?languages=en&limit=100" },
];

/** Публічні RSS без API-ключа — додають десятки заголовків до фіду. */
const rssFeeds: { url: string; sourceLabel: string }[] = [
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", sourceLabel: "BBC World" },
  { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", sourceLabel: "BBC Technology" },
  { url: "https://feeds.bbci.co.uk/news/business/rss.xml", sourceLabel: "BBC Business" },
  { url: "https://www.theguardian.com/world/rss", sourceLabel: "The Guardian" },
  { url: "https://www.theguardian.com/technology/rss", sourceLabel: "The Guardian Tech" },
  { url: "https://techcrunch.com/feed/", sourceLabel: "TechCrunch" },
  { url: "https://hnrss.org/frontpage", sourceLabel: "Hacker News" },
];

function rankArticle(article: NewsArticle) {
  const ageMinutes = Math.max(1, (Date.now() - new Date(article.publishedAt).getTime()) / 60000);
  const freshnessScore = 240 / ageMinutes;
  const breakingBoost = article.isBreaking ? 40 : 0;
  return article.views * 0.01 + freshnessScore + breakingBoost + article.tags.length * 2;
}

const MAX_BODY_CHARS = 120_000;
const EXCERPT_CHARS = 520;

function pickLongest(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).sort((a, b) => (b?.length ?? 0) - (a?.length ?? 0))[0]?.trim() ?? "";
}

/** Повний текст для сторінки статті + короткий лід для карток. */
function normalizeBody(content?: string, description?: string, title?: string) {
  const c = (content ?? "").trim();
  const d = (description ?? "").trim();
  let full = pickLongest(c, d, title ?? "");
  if (c && d && c !== d) {
    const shorter = c.length <= d.length ? c : d;
    const longer = c.length > d.length ? c : d;
    if (!longer.includes(shorter.slice(0, Math.min(100, shorter.length)))) {
      full = `${shorter}\n\n${longer}`;
    } else {
      full = longer;
    }
  }
  full = full.slice(0, MAX_BODY_CHARS);
  const excerpt =
    full.length > EXCERPT_CHARS ? `${full.slice(0, EXCERPT_CHARS).trimEnd()}…` : full;
  return { full, excerpt };
}

function bulletsFromDescription(text: string, max = 4): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const sentences = cleaned.split(/(?<=[.!?])\s+/).map((s) => s.trim());
  const out = sentences.filter((s) => s.length > 24).slice(0, max);
  if (out.length) return out;
  return [cleaned.slice(0, 220) + (cleaned.length > 220 ? "…" : "")];
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
  if (!article.title?.trim()) return null;
  const { full, excerpt } = normalizeBody(article.content, article.description, article.title);
  if (!full) return null;
  const category = categories[idx % categories.length];
  const baseSlug = slugify(article.title);
  const aiBlurbSource = full.slice(0, 3500);
  return {
    id: `ext-${idx}-${baseSlug.slice(0, 48)}`,
    slug: baseSlug || `item-${idx}`,
    title: article.title.trim(),
    summary: excerpt,
    aiSummary: `In simple terms: ${aiBlurbSource.slice(0, 1200)}${aiBlurbSource.length > 1200 ? "…" : ""}`,
    aiKeyPoints: bulletsFromDescription(full.slice(0, 6000)),
    timeline: [],
    content: full,
    source: article.source?.name ?? "Global Wire",
    category,
    image:
      article.urlToImage ??
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=80",
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    views: 5000 + idx * 177,
    tags: ["wire", "global", category.toLowerCase()],
    canonicalUrl: article.url?.trim() || undefined,
  };
}

async function fetchProviderArticles() {
  const results = await Promise.allSettled(
    apiProviders.map(async (provider) => {
      const token = process.env[provider.envKey];
      if (!token) return [] as ExternalArticle[];
      const separator = provider.url.includes("?") ? "&" : "?";
      const key = encodeURIComponent(provider.queryName);
      const val = encodeURIComponent(token);
      const response = await fetch(`${provider.url}${separator}${key}=${val}`, {
        next: { revalidate: 120 },
        headers: { "User-Agent": "Voxera.live/1.0 (+https://voxera.live)" },
      });
      if (!response.ok) return [] as ExternalArticle[];
      const data = await response.json();
      const rawList = data.articles ?? data.data ?? [];
      if (!Array.isArray(rawList)) return [] as ExternalArticle[];
      return rawList.map((row: Record<string, unknown>) => {
        const obj = row as ExternalArticle & { url?: string };
        return {
          ...obj,
          url: typeof obj.url === "string" ? obj.url : undefined,
        };
      });
    }),
  );

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeXmlEntities(s: string) {
  return s
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function xmlField(block: string, tag: string) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(re);
  if (!m) return "";
  let inner = m[1].trim();
  const cdata = inner.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i);
  if (cdata) inner = cdata[1].trim();
  return decodeXmlEntities(stripHtml(inner));
}

function extractRssItemBlocks(xml: string) {
  const blocks: string[] = [];
  const itemRe = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    blocks.push(m[1]);
  }
  if (blocks.length === 0) {
    const entryRe = /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi;
    while ((m = entryRe.exec(xml)) !== null) {
      blocks.push(m[1]);
    }
  }
  return blocks;
}

function extractRssLink(block: string): string | undefined {
  const href = block.match(/<link[^>]*\bhref=["']([^"'>\s]+)["']/i)?.[1]?.trim();
  if (href) return href;
  const plain = block.match(/<link>([^<]+)<\/link>/i)?.[1]?.trim();
  return plain || undefined;
}

function extractRssDate(block: string) {
  const raw =
    block.match(/<pubDate>([^<]+)<\/pubDate>/i)?.[1]?.trim() ??
    block.match(/<published>([^<]+)<\/published>/i)?.[1]?.trim() ??
    block.match(/<updated>([^<]+)<\/updated>/i)?.[1]?.trim();
  if (!raw) return new Date().toISOString();
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/** Повний текст з RSS; зображення з стрічки не тягнемо — стабільніший `next/image`. */
function rssBlockToArticle(block: string, sourceLabel: string): ExternalArticle | null {
  const title = xmlField(block, "title");
  if (!title) return null;
  const body =
    xmlField(block, "content:encoded") ||
    xmlField(block, "description") ||
    xmlField(block, "summary") ||
    title;
  const link = extractRssLink(block);
  return {
    title,
    description: body,
    source: { name: sourceLabel },
    publishedAt: extractRssDate(block),
    content: body,
    url: link,
  };
}

async function fetchRssArticles() {
  const results = await Promise.allSettled(
    rssFeeds.map(async ({ url, sourceLabel }) => {
      const response = await fetch(url, {
        next: { revalidate: 300 },
        headers: { "User-Agent": "Voxera.live/1.0 (+https://voxera.live)" },
      });
      if (!response.ok) return [] as ExternalArticle[];
      const xml = await response.text();
      return extractRssItemBlocks(xml)
        .slice(0, 35)
        .map((block) => rssBlockToArticle(block, sourceLabel))
        .filter((item): item is ExternalArticle => Boolean(item));
    }),
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

async function loadNewsFeed() {
  const [fromApis, fromRss] = await Promise.all([fetchProviderArticles(), fetchRssArticles()]);
  const external = [...fromApis, ...fromRss];
  let idx = 0;
  const externalMapped = external
    .map((article) => mapExternalToNews(article, idx++))
    .filter((item): item is NewsArticle => Boolean(item));
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
