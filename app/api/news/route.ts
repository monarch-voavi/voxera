import { NextResponse } from "next/server";

import { getNewsFeed } from "@/lib/news-service";

export async function GET() {
  const feed = await getNewsFeed();
  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    total: feed.length,
    items: feed,
  });
}
