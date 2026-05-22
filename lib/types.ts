export const categories = [
  "World",
  "Politics",
  "Technology",
  "AI",
  "Crypto",
  "Business",
  "War",
  "Science",
  "Gaming",
  "Culture",
] as const;

export type NewsCategory = (typeof categories)[number];
export type ArticleLanguage = "en" | "uk";
export type ContentStatus = "full" | "excerpt";

export type TimelinePoint = {
  title: string;
  detail: string;
  timestamp: string;
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  aiSummary: string;
  aiKeyPoints: string[];
  timeline: TimelinePoint[];
  content: string;
  source: string;
  sourceUrl?: string;
  attribution?: string;
  language?: ArticleLanguage;
  contentStatus?: ContentStatus;
  category: NewsCategory;
  image: string;
  publishedAt: string;
  views: number;
  isBreaking?: boolean;
  tags: string[];
  canonicalUrl?: string;
};
