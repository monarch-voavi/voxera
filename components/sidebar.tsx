import Link from "next/link";

import { Card } from "@/components/ui/card";
import { NewsArticle } from "@/lib/types";

export function Sidebar({ mostViewed, trends }: { mostViewed: NewsArticle[]; trends: { tag: string; weight: number }[] }) {
  return (
    <aside className="space-y-4">
      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">AI Insights</h3>
        <p className="text-sm text-zinc-400">Voxera AI detects acceleration in policy, semiconductor supply, and geopolitical signal clusters.</p>
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">Trending Hashtags</h3>
        <div className="flex flex-wrap gap-2">
          {trends.map((trend) => (
            <span key={trend.tag} className="rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-xs text-violet-200">
              #{trend.tag}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">Most Viewed</h3>
        <ul className="space-y-3 text-sm">
          {mostViewed.map((story) => (
            <li key={story.id}>
              <Link href={`/article/${story.slug}`} className="text-zinc-200 hover:text-white">
                {story.title}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
}
