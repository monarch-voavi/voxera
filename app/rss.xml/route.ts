import { getNewsFeed } from "@/lib/news-service";

export async function GET() {
  const stories = await getNewsFeed();
  const items = stories
    .slice(0, 30)
    .map(
      (story) => `
      <item>
        <title><![CDATA[${story.title}]]></title>
        <link>https://voxera.live/article/${story.slug}</link>
        <guid>https://voxera.live/article/${story.slug}</guid>
        <pubDate>${new Date(story.publishedAt).toUTCString()}</pubDate>
        <description><![CDATA[${story.summary}]]></description>
      </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Voxera.live</title>
    <description>Live global intelligence</description>
    <link>https://voxera.live</link>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
