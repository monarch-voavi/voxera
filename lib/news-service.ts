import { cache } from "react";

import { mockNews } from "@/lib/mock-data";
import { ArticleLanguage, categories, ContentStatus, NewsArticle, NewsCategory } from "@/lib/types";
import { slugify } from "@/lib/utils";

type ApiQueryName = "apiKey" | "token" | "access_key";

type ApiProvider = {
  envKey: string;
  queryName: ApiQueryName;
  url: string;
  language: ArticleLanguage;
};

type RssFeed = {
  url: string;
  sourceLabel: string;
  categoryHint?: NewsCategory;
  language: ArticleLanguage;
};

type ExternalArticle = {
  title: string;
  description?: string;
  content?: string;
  sourceName?: string;
  sourceUrl?: string;
  image?: string;
  publishedAt?: string;
  url?: string;
  categoryHint?: string;
  language?: string;
};

type SearchOptions = {
  query?: string;
  category?: string;
  breakingOnly?: boolean;
  limit?: number;
  language?: string;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=80";

const FALLBACK_IMAGES: Record<NewsCategory, string> = {
  World: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  Politics: "https://images.unsplash.com/photo-1529107387015-1f2aae888b1e?auto=format&fit=crop&w=1600&q=80",
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
  AI: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
  Crypto: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1600&q=80",
  Business: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80",
  War: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
  Science: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1600&q=80",
  Gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
  Culture: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
};

const API_PROVIDERS: ApiProvider[] = [
  { envKey: "NEWS_API_KEY", queryName: "apiKey", url: "https://newsapi.org/v2/top-headlines?language=en&pageSize=100", language: "en" },
  {
    envKey: "NEWS_API_KEY",
    queryName: "apiKey",
    url: "https://newsapi.org/v2/top-headlines?language=en&category=technology&pageSize=100",
    language: "en",
  },
  {
    envKey: "NEWS_API_KEY",
    queryName: "apiKey",
    url: "https://newsapi.org/v2/top-headlines?language=en&category=business&pageSize=100",
    language: "en",
  },
  { envKey: "GNEWS_API_KEY", queryName: "token", url: "https://gnews.io/api/v4/top-headlines?lang=en&max=50", language: "en" },
  { envKey: "MEDIASTACK_API_KEY", queryName: "access_key", url: "https://api.mediastack.com/v1/news?languages=en&limit=100", language: "en" },
];

const RSS_FEEDS: RssFeed[] = [
  { url: "https://feeds.bbci.co.uk/news/rss.xml", sourceLabel: "BBC News", categoryHint: "World", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", sourceLabel: "BBC World", categoryHint: "World", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/politics/rss.xml", sourceLabel: "BBC Politics", categoryHint: "Politics", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", sourceLabel: "BBC Technology", categoryHint: "Technology", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/business/rss.xml", sourceLabel: "BBC Business", categoryHint: "Business", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", sourceLabel: "BBC Science", categoryHint: "Science", language: "en" },
  { url: "https://feeds.bbci.co.uk/ukrainian/rss.xml", sourceLabel: "BBC Ukrainian", categoryHint: "World", language: "uk" },
  { url: "https://www.pravda.com.ua/rss/", sourceLabel: "Ukrainska Pravda", categoryHint: "World", language: "uk" },
  { url: "https://www.pravda.com.ua/rss/view_news/", sourceLabel: "Ukrainska Pravda News", categoryHint: "World", language: "uk" },
  { url: "https://www.pravda.com.ua/rss/view_mainnews/", sourceLabel: "Ukrainska Pravda Main", categoryHint: "World", language: "uk" },
  { url: "https://www.pravda.com.ua/eng/rss/", sourceLabel: "Ukrainska Pravda EN", categoryHint: "World", language: "en" },
  { url: "https://www.theguardian.com/world/rss", sourceLabel: "The Guardian", categoryHint: "World", language: "en" },
  { url: "https://www.theguardian.com/technology/rss", sourceLabel: "The Guardian Tech", categoryHint: "Technology", language: "en" },
  { url: "https://techcrunch.com/feed/", sourceLabel: "TechCrunch", categoryHint: "Technology", language: "en" },
  { url: "https://www.theverge.com/rss/index.xml", sourceLabel: "The Verge", categoryHint: "Technology", language: "en" },
  { url: "https://www.wired.com/feed/rss", sourceLabel: "Wired", categoryHint: "Technology", language: "en" },
  { url: "https://hnrss.org/frontpage", sourceLabel: "Hacker News", categoryHint: "Technology", language: "en" },
];
const CATEGORY_RULES: Record<NewsCategory, string[]> = {
  War: ["attack", "border", "defense", "defence", "drone", "gaza", "israel", "military", "missile", "nato", "russia", "strike", "troops", "ukraine", "war"],
  Crypto: ["bitcoin", "blockchain", "crypto", "cryptocurrency", "ethereum", "stablecoin", "token"],
  AI: ["ai", "artificial intelligence", "chatbot", "foundation model", "generative", "llm", "model", "openai"],
  Technology: ["apple", "chip", "cyber", "data", "google", "hardware", "microsoft", "semiconductor", "software", "tech"],
  Business: ["bank", "business", "company", "economy", "finance", "inflation", "market", "rate", "stock", "trade"],
  Politics: ["congress", "court", "election", "government", "minister", "parliament", "policy", "president", "regulation", "senate"],
  Science: ["climate", "health", "mars", "nasa", "quantum", "research", "science", "scientist", "space", "study"],
  Gaming: ["esports", "game", "gaming", "nintendo", "playstation", "steam", "xbox"],
  Culture: ["artist", "culture", "film", "hollywood", "movie", "music", "streaming", "tv"],
  World: ["global", "international", "world"],
};

const SOURCE_WEIGHTS: Record<string, number> = {
  Reuters: 34,
  "BBC News": 32,
  "BBC World": 32,
  "BBC Politics": 31,
  "BBC Technology": 31,
  "BBC Business": 31,
  "BBC Science": 31,
  "BBC Ukrainian": 31,
  "Ukrainska Pravda": 29,
  "Ukrainska Pravda News": 29,
  "Ukrainska Pravda Main": 30,
  "Ukrainska Pravda EN": 28,
  "The Guardian": 28,
  "The Guardian Tech": 27,
  "The Verge": 25,
  Wired: 25,
  TechCrunch: 24,
  "Hacker News": 18,
};

const BREAKING_TERMS = [
  "breaking",
  "urgent",
  "live",
  "developing",
  "emergency",
  "attack",
  "explosion",
  "earthquake",
  "outage",
  "crash",
  "killed",
  "resigns",
  "strike",
  "missile",
  "evacu",
];

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "against",
  "from",
  "have",
  "into",
  "over",
  "that",
  "their",
  "this",
  "with",
  "will",
  "your",
  "news",
  "says",
  "said",
  "were",
  "they",
  "але",
  "для",
  "про",
  "при",
  "та",
  "що",
  "цей",
  "ця",
  "це",
  "україна",
]);

const MAX_BODY_CHARS = 36_000;
const SUMMARY_CHARS = 360;

function valueAt(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function sourceFrom(row: Record<string, unknown>) {
  const source = row.source;
  if (typeof source === "string") return { name: source, url: "" };
  if (source && typeof source === "object") {
    const obj = source as Record<string, unknown>;
    return {
      name: typeof obj.name === "string" ? obj.name.trim() : "",
      url: typeof obj.url === "string" ? obj.url.trim() : "",
    };
  }
  return { name: "", url: "" };
}

function decodeCodePoint(value: number) {
  try {
    return Number.isFinite(value) ? String.fromCodePoint(value) : "";
  } catch {
    return "";
  }
}

function decodeEntities(input: string) {
  return input
    .replace(/&#(\d+);/g, (_, n: string) => decodeCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => decodeCodePoint(Number.parseInt(n, 16)))
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function stripHtml(input: string) {
  const decoded = decodeEntities(input);
  return decodeEntities(
    decoded
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
}


function repairMojibake(input: string) {
  if (!/[ÐÑÂâ]/.test(input)) return input;
  const chars = Array.from(input);
  if (chars.some((char) => char.charCodeAt(0) > 255)) return input;

  try {
    const bytes = Uint8Array.from(chars.map((char) => char.charCodeAt(0)));
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch {
    return input;
  }
}
function cleanText(input?: string) {
  return repairMojibake(stripHtml(input ?? ""))
    .replace(/\s*\[\+?\d+\s+chars?\]\s*$/i, "")
    .replace(/\s*read more\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateAtSentence(input: string, max = SUMMARY_CHARS) {
  const text = cleanText(input);
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const punctuation = Math.max(slice.lastIndexOf("."), slice.lastIndexOf("!"), slice.lastIndexOf("?"));
  if (punctuation > max * 0.55) return slice.slice(0, punctuation + 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 80 ? lastSpace : max).trimEnd()}...`;
}

function normalizeTitle(title: string, source = "") {
  const cleaned = cleanText(title);
  const base = cleaned
    .replace(/\s+\|\s+(Reuters|BBC News|CNN|The Guardian|The Verge|Wired|TechCrunch)$/i, "")
    .replace(/\s+-\s+(BBC News|CNN|Reuters)$/i, "")
    .trim();

  if (!source) return base;
  const suffix = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return base.replace(new RegExp(`\\s+-\\s+${suffix}$`, "i"), "").trim();
}

function normalizeBody(article: ExternalArticle) {
  const title = normalizeTitle(article.title, article.sourceName);
  const description = cleanText(article.description);
  const content = cleanText(article.content);
  const bodySource = content.length >= description.length ? content : description;
  let full = bodySource || description || title;

  if (description && content && content !== description && !content.startsWith(description.slice(0, 120))) {
    full = `${description}\n\n${content}`;
  }

  full = full.slice(0, MAX_BODY_CHARS).trim();
  const summary = truncateAtSentence(description.length >= 80 ? description : full || title);
  return { title, full, summary };
}

function canonicalizeUrl(input?: string) {
  if (!input) return undefined;
  try {
    const url = new URL(decodeEntities(input.trim()));
    if (!["http:", "https:"].includes(url.protocol)) return undefined;
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_cid|mc_eid|cmpid|ocid)/i.test(key)) url.searchParams.delete(key);
    }
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

function urlDedupeKey(input?: string) {
  const canonical = canonicalizeUrl(input);
  if (!canonical) return "";
  try {
    const url = new URL(canonical);
    return `${url.hostname.replace(/^www\./, "")}${url.pathname.replace(/\/$/, "")}`.toLowerCase();
  } catch {
    return canonical.toLowerCase();
  }
}

function titleDedupeKey(title: string) {
  return normalizeTitle(title)
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\b(the|a|an|and|or|but|to|of|in|on|for|with|as|by|from)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashString(input: string) {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) hash = (hash * 33) ^ input.charCodeAt(i);
  return (hash >>> 0).toString(36);
}

function sanitizeImageUrl(input?: string, category?: NewsCategory) {
  const fallback = category ? FALLBACK_IMAGES[category] : DEFAULT_IMAGE;
  const canonical = canonicalizeUrl(input);
  if (!canonical) return fallback;
  return canonical;
}

function sourceWeight(source: string) {
  return SOURCE_WEIGHTS[source] ?? (source ? 20 : 14);
}

function ageMinutes(publishedAt: string) {
  const timestamp = new Date(publishedAt).getTime();
  if (!Number.isFinite(timestamp)) return 365 * 24 * 60;
  return Math.max(1, (Date.now() - timestamp) / 60000);
}

function normalizeDate(input?: string) {
  const parsed = input ? new Date(input) : new Date();
  const now = Date.now();
  if (Number.isNaN(parsed.getTime()) || parsed.getTime() > now + 10 * 60000) return new Date(now).toISOString();
  return parsed.toISOString();
}


function inferLanguage(article: ExternalArticle): ArticleLanguage {
  const raw = article.language?.toLowerCase().trim() ?? "";
  if (raw === "uk" || raw === "ua" || raw.startsWith("uk-")) return "uk";
  if (raw === "en" || raw.startsWith("en-")) return "en";

  const sample = `${article.title} ${article.description ?? ""} ${article.content ?? ""}`;
  return /[іїєґІЇЄҐ]/.test(sample) || /\b(україн|зеленськ|київ|рада)\b/i.test(sample) ? "uk" : "en";
}

function contentStatus(full: string, summary: string): ContentStatus {
  const words = full.split(/\s+/).filter(Boolean).length;
  return words >= 140 && full.length > summary.length + 280 ? "full" : "excerpt";
}

function sourceOrigin(input?: string) {
  const canonical = canonicalizeUrl(input);
  if (!canonical) return undefined;
  try {
    return new URL(canonical).origin;
  } catch {
    return canonical;
  }
}

function buildAttribution(source: string, canonicalUrl: string | undefined, sourceUrl: string | undefined, status: ContentStatus) {
  const origin = sourceOrigin(canonicalUrl) ?? sourceOrigin(sourceUrl);
  const scope = status === "full" ? "source-provided full text" : "source-provided excerpt";
  return origin ? `Source: ${source} (${origin}). Content: ${scope}.` : `Source: ${source}. Content: ${scope}.`;
}
function inferCategory(article: ExternalArticle): NewsCategory {
  const hint = article.categoryHint?.trim();
  if (hint && categories.includes(hint as NewsCategory)) return hint as NewsCategory;

  const haystack = `${article.title} ${article.description ?? ""} ${article.content ?? ""} ${article.sourceName ?? ""}`.toLowerCase();
  const scored = categories.map((category) => {
    const score = CATEGORY_RULES[category].reduce((sum, term) => {
      const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      return sum + (haystack.match(re)?.length ?? 0);
    }, 0);
    return { category, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score ? scored[0].category : "World";
}

function inferTags(article: ExternalArticle, category: NewsCategory) {
  const sourceTag = article.sourceName?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const words = `${article.title} ${article.description ?? ""}`.toLowerCase().match(/[\p{L}][\p{L}\p{N}-]{2,}/gu);
  const ranked = new Map<string, number>();

  for (const word of words ?? []) {
    if (STOP_WORDS.has(word)) continue;
    ranked.set(word, (ranked.get(word) ?? 0) + 1);
  }

  const tags = [
    category.toLowerCase(),
    ...(sourceTag ? [sourceTag] : []),
    ...[...ranked.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word)
      .slice(0, 6),
  ];

  return [...new Set(tags)].slice(0, 9);
}

function detectBreaking(article: ExternalArticle, publishedAt: string, source: string) {
  const text = `${article.title} ${article.description ?? ""}`.toLowerCase();
  const hasBreakingTerm = BREAKING_TERMS.some((term) => text.includes(term));
  const veryFreshTrusted = ageMinutes(publishedAt) <= 45 && sourceWeight(source) >= 24;
  return hasBreakingTerm || veryFreshTrusted;
}
function buildKeyPoints(text: string, category: NewsCategory, source: string, language: ArticleLanguage) {
  const sentences = cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 35);
  const points = sentences.slice(0, 4).map((s) => truncateAtSentence(s, 180));
  if (points.length >= 2) return points;
  return language === "uk"
    ? [`Джерело: ${source}`, `Категорія: ${category}`, "Повний контекст відкривайте за посиланням на оригінал."]
    : [`Source: ${source}`, `Category: ${category}`, "Open the original link for continuing updates."];
}

function buildAiSummary(title: string, summary: string, source: string, language: ArticleLanguage) {
  const plain = truncateAtSentence(summary || title, 420);
  return language === "uk" ? `Коротко: ${plain} Джерело: ${source}.` : `In simple terms: ${plain} Source signal: ${source}.`;
}

function buildTimeline(article: ExternalArticle, publishedAt: string, language: ArticleLanguage) {
  return [
    {
      title: language === "uk" ? "Опубліковано" : "Published",
      detail:
        language === "uk"
          ? `${article.sourceName ?? "Джерело"} опублікувало матеріал.`
          : `${article.sourceName ?? "Source"} published the story.`,
      timestamp: publishedAt,
    },
  ];
}

function estimateViews(article: ExternalArticle, source: string, publishedAt: string, breaking: boolean) {
  const freshness = Math.max(0, 1 - ageMinutes(publishedAt) / (24 * 60));
  const seed = Number.parseInt(hashString(article.title).slice(0, 4), 36) % 5000;
  return Math.round(900 + sourceWeight(source) * 180 + freshness * 11_000 + seed + (breaking ? 8_000 : 0));
}

function mapExternalToNews(article: ExternalArticle, index: number): NewsArticle | null {
  const category = inferCategory(article);
  const source = article.sourceName?.trim() || "Global Wire";
  const publishedAt = normalizeDate(article.publishedAt);
  const { title, full, summary } = normalizeBody(article);
  if (!title || !full) return null;

  const canonicalUrl = canonicalizeUrl(article.url);
  const language = inferLanguage(article);
  const status = contentStatus(full, summary);
  const sourceUrl = canonicalizeUrl(article.sourceUrl) ?? sourceOrigin(canonicalUrl);
  const breaking = detectBreaking(article, publishedAt, source);
  const identity = canonicalUrl || `${title}-${source}-${publishedAt}-${index}`;
  const slug = `${slugify(title)}-${hashString(identity).slice(0, 6)}`;

  return {
    id: `ext-${hashString(identity)}`,
    slug,
    title,
    summary,
    aiSummary: buildAiSummary(title, summary, source, language),
    aiKeyPoints: buildKeyPoints(full, category, source, language),
    timeline: buildTimeline({ ...article, sourceName: source }, publishedAt, language),
    content: full,
    source,
    sourceUrl,
    attribution: buildAttribution(source, canonicalUrl, sourceUrl, status),
    language,
    contentStatus: status,
    category,
    image: sanitizeImageUrl(article.image, category),
    publishedAt,
    views: estimateViews(article, source, publishedAt, breaking),
    isBreaking: breaking,
    tags: inferTags(article, category),
    canonicalUrl,
  };
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 8500) {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "User-Agent": "Voxera.live/1.0 (+https://voxera.live)",
      Accept: "application/rss+xml, application/xml, application/json, text/xml, */*",
      ...init.headers,
    },
  });
}


async function readResponseText(response: Response) {
  const bytes = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") ?? "";
  const headerEncoding = contentType.match(/charset=([^;]+)/i)?.[1]?.trim().replace(/["']/g, "");
  const utf8Preview = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, 300));
  const xmlEncoding = utf8Preview.match(/encoding=["']([^"']+)["']/i)?.[1]?.trim();
  const encoding = headerEncoding || xmlEncoding || "utf-8";

  try {
    return new TextDecoder(encoding, { fatal: false }).decode(bytes);
  } catch {
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  }
}
function normalizeProviderRow(row: unknown): ExternalArticle | null {
  if (!row || typeof row !== "object") return null;
  const obj = row as Record<string, unknown>;
  const source = sourceFrom(obj);
  const title = valueAt(obj, ["title", "headline", "name"]);
  if (!title) return null;

  return {
    title,
    description: valueAt(obj, ["description", "summary", "excerpt"]),
    content: valueAt(obj, ["content", "body", "description", "summary"]),
    sourceName: source.name || valueAt(obj, ["source", "author"]) || "Global Wire",
    sourceUrl: source.url,
    image: valueAt(obj, ["urlToImage", "image", "image_url", "thumbnail", "thumbnailUrl"]),
    publishedAt: valueAt(obj, ["publishedAt", "published_at", "published", "pubDate", "date"]),
    url: valueAt(obj, ["url", "link", "canonicalUrl"]),
    categoryHint: valueAt(obj, ["category"]),
    language: valueAt(obj, ["language", "lang"]),
  };
}

async function fetchProviderArticles() {
  const results = await Promise.allSettled(
    API_PROVIDERS.map(async (provider) => {
      const token = process.env[provider.envKey];
      if (!token) return [] as ExternalArticle[];
      const separator = provider.url.includes("?") ? "&" : "?";
      const response = await fetchWithTimeout(
        `${provider.url}${separator}${encodeURIComponent(provider.queryName)}=${encodeURIComponent(token)}`,
        { next: { revalidate: 120 } },
      );
      if (!response.ok) return [] as ExternalArticle[];
      const data = (await response.json()) as { articles?: unknown; data?: unknown };
      const rawList: unknown[] = Array.isArray(data.articles) ? data.articles : Array.isArray(data.data) ? data.data : [];
      return rawList
        .map(normalizeProviderRow)
        .filter((item): item is ExternalArticle => Boolean(item))
        .map((item) => ({ ...item, language: item.language || provider.language }));
    }),
  );

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

function xmlField(block: string, tag: string) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i");
  const match = block.match(re);
  if (!match) return "";
  const cdata = match[1].trim().match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i);
  return cleanText(cdata ? cdata[1] : match[1]);
}

function extractRssItemBlocks(xml: string) {
  const blocks: string[] = [];
  const itemRe = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  const entryRe = /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRe.exec(xml)) !== null) blocks.push(match[1]);
  while (blocks.length === 0 && (match = entryRe.exec(xml)) !== null) blocks.push(match[1]);
  return blocks;
}

function extractRssLink(block: string) {
  const href = block.match(/<link[^>]*\bhref=["']([^"'>\s]+)["']/i)?.[1];
  if (href) return decodeEntities(href);
  const plain = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1];
  return plain ? cleanText(plain) : undefined;
}

function extractRssImage(block: string) {
  const media =
    block.match(/<media:content[^>]*\burl=["']([^"']+)["'][^>]*>/i)?.[1] ??
    block.match(/<media:thumbnail[^>]*\burl=["']([^"']+)["'][^>]*>/i)?.[1] ??
    block.match(/<enclosure[^>]*\burl=["']([^"']+)["'][^>]*\btype=["']image\/[^"']+["'][^>]*>/i)?.[1] ??
    block.match(/<img[^>]*\bsrc=["']([^"']+)["'][^>]*>/i)?.[1];
  return media ? decodeEntities(media) : undefined;
}

function extractRssDate(block: string) {
  return xmlField(block, "pubDate") || xmlField(block, "published") || xmlField(block, "updated") || xmlField(block, "dc:date") || undefined;
}

function rssBlockToArticle(block: string, feed: RssFeed): ExternalArticle | null {
  const title = xmlField(block, "title");
  if (!title) return null;
  const description = xmlField(block, "description") || xmlField(block, "summary");
  const content = xmlField(block, "content:encoded") || xmlField(block, "content") || description || title;
  return {
    title,
    description,
    content,
    sourceName: feed.sourceLabel,
    image: extractRssImage(block),
    publishedAt: extractRssDate(block),
    url: extractRssLink(block),
    categoryHint: feed.categoryHint,
    sourceUrl: feed.url,
    language: feed.language,
  };
}

async function fetchRssArticles() {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const response = await fetchWithTimeout(feed.url, { next: { revalidate: 300 } });
      if (!response.ok) return [] as ExternalArticle[];
      const xml = await readResponseText(response);
      return extractRssItemBlocks(xml)
        .slice(0, 35)
        .map((block) => rssBlockToArticle(block, feed))
        .filter((item): item is ExternalArticle => Boolean(item));
    }),
  );
  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

function dataQuality(article: NewsArticle) {
  return (
    Math.min(article.content.length / 250, 40) +
    (article.canonicalUrl ? 20 : 0) +
    (article.image !== FALLBACK_IMAGES[article.category] && article.image !== DEFAULT_IMAGE ? 15 : 0) +
    sourceWeight(article.source)
  );
}

function mergeDuplicate(a: NewsArticle, b: NewsArticle): NewsArticle {
  const primary = dataQuality(b) > dataQuality(a) ? b : a;
  const secondary = primary === a ? b : a;
  return {
    ...primary,
    summary: primary.summary.length >= secondary.summary.length ? primary.summary : secondary.summary,
    content: primary.content.length >= secondary.content.length ? primary.content : secondary.content,
    aiKeyPoints: [...new Set([...primary.aiKeyPoints, ...secondary.aiKeyPoints])].slice(0, 5),
    timeline: [...primary.timeline, ...secondary.timeline]
      .sort((x, y) => new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime())
      .slice(0, 5),
    views: Math.max(primary.views, secondary.views),
    isBreaking: Boolean(primary.isBreaking || secondary.isBreaking),
    tags: [...new Set([...primary.tags, ...secondary.tags])].slice(0, 10),
    canonicalUrl: primary.canonicalUrl ?? secondary.canonicalUrl,
  };
}

function dedupeArticles(articles: NewsArticle[]) {
  const byKey = new Map<string, NewsArticle>();
  const out: NewsArticle[] = [];

  for (const article of articles) {
    const urlKey = urlDedupeKey(article.canonicalUrl);
    const titleKey = titleDedupeKey(article.title);
    const keys = [urlKey ? `url:${urlKey}` : "", titleKey ? `title:${titleKey}` : ""].filter(Boolean);
    const existing = keys.map((key) => byKey.get(key)).find(Boolean);

    if (!existing) {
      out.push(article);
      keys.forEach((key) => byKey.set(key, article));
      continue;
    }

    const merged = mergeDuplicate(existing, article);
    const index = out.indexOf(existing);
    if (index >= 0) out[index] = merged;
    keys.forEach((key) => byKey.set(key, merged));
    const existingTitleKey = titleDedupeKey(existing.title);
    if (existingTitleKey) byKey.set(`title:${existingTitleKey}`, merged);
    const existingUrlKey = urlDedupeKey(existing.canonicalUrl);
    if (existingUrlKey) byKey.set(`url:${existingUrlKey}`, merged);
  }

  return out;
}

function rankArticle(article: NewsArticle) {
  const freshness = 100 / (1 + ageMinutes(article.publishedAt) / 80);
  const authority = sourceWeight(article.source);
  const engagement = Math.log10(Math.max(article.views, 10)) * 7;
  const contentDepth = Math.min(article.content.length / 450, 18);
  const breakingBoost = article.isBreaking ? 42 : 0;
  return freshness + authority + engagement + contentDepth + breakingBoost + article.tags.length;
}

function ensureUniqueSlugs(articles: NewsArticle[]) {
  const seen = new Map<string, number>();
  return articles.map((article) => {
    const count = seen.get(article.slug) ?? 0;
    seen.set(article.slug, count + 1);
    if (count === 0) return article;
    return { ...article, slug: `${article.slug}-${count + 1}`, id: `${article.id}-${count + 1}` };
  });
}


function fallbackArticles() {
  return mockNews.map((story) => ({
    ...story,
    language: story.language ?? "en",
    contentStatus: story.contentStatus ?? "full",
    attribution: story.attribution ?? `Fallback demo item. Configure live feeds/API for source-backed coverage. Displayed source label: ${story.source}.`,
  }));
}
async function loadNewsFeed() {
  const [fromApis, fromRss] = await Promise.all([fetchProviderArticles(), fetchRssArticles()]);
  let index = 0;
  const externalMapped = [...fromApis, ...fromRss]
    .map((article) => mapExternalToNews(article, index++))
    .filter((item): item is NewsArticle => Boolean(item));
  const sourceBacked = externalMapped.length > 0 ? externalMapped : fallbackArticles();
  const merged = ensureUniqueSlugs(dedupeArticles(sourceBacked));
  return merged.sort((a, b) => rankArticle(b) - rankArticle(a));
}

export const getNewsFeed = cache(loadNewsFeed);

export function searchStories(stories: NewsArticle[], options: SearchOptions = {}) {
  const query = options.query?.trim().toLowerCase() ?? "";
  const category = options.category?.trim().toLowerCase() ?? "";
  const limit = Math.min(Math.max(options.limit ?? stories.length, 1), 100);
  const language = options.language?.trim().toLowerCase();

  const filtered = stories.filter((story) => {
    if (options.breakingOnly && !story.isBreaking) return false;
    if (category && story.category.toLowerCase() !== category) return false;
    if (language && story.language !== language) return false;
    if (!query) return true;
    const haystack = `${story.title} ${story.summary} ${story.content} ${story.source} ${story.category} ${story.tags.join(" ")}`.toLowerCase();
    return query.split(/\s+/).every((term) => haystack.includes(term));
  });

  return filtered.slice(0, limit);
}

export function getRelatedStories(story: NewsArticle, stories: NewsArticle[], limit = 3) {
  return stories
    .filter((candidate) => candidate.slug !== story.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => story.tags.includes(tag)).length;
      const categoryMatch = candidate.category === story.category ? 12 : 0;
      const sourceDiversity = candidate.source !== story.source ? 3 : 0;
      return {
        story: candidate,
        score: sharedTags * 6 + categoryMatch + sourceDiversity + rankArticle(candidate) / 20,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.story);
}

export function computeTrendingTopics(stories: NewsArticle[]) {
  const score = new Map<string, number>();
  stories.forEach((story) => {
    const articleWeight = Math.max(1, Math.round(rankArticle(story) / 20));
    story.tags.forEach((tag) => {
      score.set(tag, (score.get(tag) ?? 0) + articleWeight);
    });
  });
  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, weight]) => ({ tag, weight }));
}















