import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/article-view";
import { Navbar } from "@/components/navbar";
import { ReadingProgress } from "@/components/reading-progress";
import { getNewsFeed, getRelatedStories } from "@/lib/news-service";

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
  const related = getRelatedStories(story, stories, 3);

  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      <ReadingProgress />
      <Navbar />
      <ArticleView story={story} related={related} />
    </div>
  );
}

