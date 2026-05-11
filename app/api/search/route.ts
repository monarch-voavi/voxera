import { NextRequest, NextResponse } from "next/server";

import { getNewsFeed } from "@/lib/news-service";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";
  const category = request.nextUrl.searchParams.get("category")?.toLowerCase().trim() ?? "";
  const feed = await getNewsFeed();

  const items = feed.filter((story) => {
    const queryMatch =
      query.length === 0 ||
      story.title.toLowerCase().includes(query) ||
      story.summary.toLowerCase().includes(query) ||
      story.tags.some((tag) => tag.toLowerCase().includes(query));
    const categoryMatch = category.length === 0 || story.category.toLowerCase() === category;
    return queryMatch && categoryMatch;
  });

  return NextResponse.json({ total: items.length, items });
}
