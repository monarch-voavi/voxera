"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { NewsArticle } from "@/lib/types";
import { readTime, timeAgo } from "@/lib/utils";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="group overflow-hidden">
        <div className="relative">
          <Image src={article.image} alt={article.title} width={800} height={420} className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-200">
            {article.category}
          </span>
        </div>
        <div className="space-y-3 p-4">
          <Link href={`/article/${article.slug}`} className="line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-cyan-300">
            {article.title}
          </Link>
          <p className="line-clamp-2 text-sm text-zinc-300">{article.summary}</p>
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>{timeAgo(article.publishedAt)}</span>
            <span>{readTime(article.content)}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
