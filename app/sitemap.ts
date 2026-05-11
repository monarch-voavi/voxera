import type { MetadataRoute } from "next";

import { getNewsFeed } from "@/lib/news-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stories = await getNewsFeed();
  const urls = stories.map((story) => ({
    url: `https://voxera.live/article/${story.slug}`,
    lastModified: new Date(story.publishedAt),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));
  return [{ url: "https://voxera.live", lastModified: new Date(), changeFrequency: "hourly", priority: 1 }, ...urls];
}
