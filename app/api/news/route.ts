import { NextRequest, NextResponse } from "next/server";

import { getNewsFeed, searchStories } from "@/lib/news-service";

function readLimit(raw: string | null) {
  if (!raw) return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const feed = await getNewsFeed();
  const items = searchStories(feed, {
    query: params.get("q") ?? undefined,
    category: params.get("category") ?? undefined,
    breakingOnly: params.get("breaking") === "true",
    language: params.get("language") ?? undefined,
    limit: readLimit(params.get("limit")),
  });

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    total: items.length,
    available: feed.length,
    items,
  });
}

