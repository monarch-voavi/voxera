import { TimelinePoint } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function Timeline({ points }: { points: TimelinePoint[] }) {
  if (!points.length) return null;
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="mb-4 text-xl font-semibold text-white">Timeline</h2>
      <ol className="space-y-4 border-l border-cyan-300/20 pl-4">
        {points.map((item) => (
          <li key={`${item.title}-${item.timestamp}`} className="relative">
            <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <p className="text-sm text-cyan-300">{timeAgo(item.timestamp)}</p>
            <p className="font-medium text-white">{item.title}</p>
            <p className="text-sm text-zinc-300">{item.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
