import { Footer } from "@/components/footer";
import { BreakingTicker } from "@/components/breaking-ticker";
import { FeedExplorer } from "@/components/feed-explorer";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { computeTrendingTopics, getNewsFeed } from "@/lib/news-service";

export default function Home() {
  const feedPromise = getNewsFeed();
  return <HomeContent feedPromise={feedPromise} />;
}

async function HomeContent({ feedPromise }: { feedPromise: ReturnType<typeof getNewsFeed> }) {
  const feed = await feedPromise;
  const trends = computeTrendingTopics(feed);
  const [hero, ...rest] = feed;
  const breaking = feed.filter((article) => article.isBreaking).slice(0, 5);
  const mostViewed = [...feed].sort((a, b) => b.views - a.views).slice(0, 5);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Voxera.live",
    url: "https://voxera.live",
    slogan: "The world, as it happens.",
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_15%,rgba(124,58,237,0.2),transparent_35%),radial-gradient(circle_at_88%_0%,rgba(34,211,238,0.15),transparent_28%),#050507] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8">
        {hero ? <HeroSection article={hero} /> : null}
        <BreakingTicker headlines={breaking} />
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold">Trending Global Stories</h2>
            <FeedExplorer feed={rest} />
          </div>
          <Sidebar mostViewed={mostViewed} trends={trends} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
