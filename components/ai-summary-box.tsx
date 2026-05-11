"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

import { useI18n } from "@/components/language-provider";
import { Card } from "@/components/ui/card";

export function AiSummaryCollapsible({ summary, keyPoints }: { summary: string; keyPoints: string[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-left text-sm font-medium text-violet-100 transition hover:bg-violet-500/20"
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-cyan-300" />
          {open ? t("aiHide") : t("aiShow")}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <Card className="mt-3 border-violet-400/20 p-5">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">{t("aiBadge")}</p>
          <p className="text-sm leading-relaxed text-zinc-200">{summary}</p>
          {keyPoints.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {keyPoints.map((point) => (
                <li key={point} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
