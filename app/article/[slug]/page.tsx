import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AiSummaryBox } from "@/components/ai-summary-box";
import { Navbar } from "@/components/navbar";
import { ReadingProgress } from "@/components/reading-progress";
import { Timeline } from "@/components/timeline";
import { getNewsFeed } from "@/lib/news-service";
import { readTime, timeAgo } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stories = await getNewsFeed();
  const story = stories.find((item) => item.slug === slug);
  if (!story) return { title: "Story not found" };
  return {
    title: story.title,
    description: story.summary,
    openGraph: { title: story.title, description: story.summary, images: [story.image] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const stories = await getNewsFeed();
  const story = stories.find((item) => item.slug === slug);
  if (!story) notFound();
  const related = stories.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      <ReadingProgress />
      <Navbar />
      <article className="mx-auto w-full max-w-4xl px-4 py-7 md:px-6">
        <div className="mb-5 space-y-3">
          <p className="text-xs uppercase tracking-wider text-cyan-300">{story.category}</p>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">{story.title}</h1>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <span>{story.source}</span>
            <span>•</span>
            <span>{timeAgo(story.publishedAt)}</span>
            <span>•</span>
            <span>{readTime(story.content)}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <Image src={story.image} alt={story.title} width={1600} height={900} className="h-[360px] w-full object-cover" priority />
        </div>

        <div className="mt-6 space-y-6">
          <AiSummaryBox summary={story.aiSummary} keyPoints={story.aiKeyPoints} />
          <p className="text-lg leading-8 text-zinc-200">{story.content}</p>
          <Timeline points={story.timeline} />
        </div>

        <div className="mt-8 flex items-center gap-3 text-sm text-zinc-300">
          <span>Share:</span>
          <button className="rounded-lg border border-white/15 px-3 py-1 hover:bg-white/10">X</button>
          <button className="rounded-lg border border-white/15 px-3 py-1 hover:bg-white/10">LinkedIn</button>
          <button className="rounded-lg border border-white/15 px-3 py-1 hover:bg-white/10">Copy Link</button>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Related Stories</h2>
          <div className="grid gap-3">
            {related.map((item) => (
              <Link key={item.id} href={`/article/${item.slug}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.07]">
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
