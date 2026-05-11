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
  /** Повний текст матеріалу з джерела (без обрізання під «AI»). */
  content: string;
  source: string;
  category: NewsCategory;
  image: string;
  publishedAt: string;
  views: number;
  isBreaking?: boolean;
  tags: string[];
  /** Посилання на оригінальну публікацію (RSS / NewsAPI тощо). */
  canonicalUrl?: string;
};
