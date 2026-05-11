import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

export function AiSummaryBox({ summary, keyPoints }: { summary: string; keyPoints: string[] }) {
  return (
    <Card className="p-5">
      <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
        <Sparkles className="h-4 w-4" />
        AI Summary
      </p>
      <p className="text-sm text-zinc-200">{summary}</p>
      <ul className="mt-4 space-y-2 text-sm text-zinc-300">
        {keyPoints.map((point) => (
          <li key={point} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            {point}
          </li>
        ))}
      </ul>
    </Card>
  );
}
