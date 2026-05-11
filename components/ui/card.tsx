import type React from "react";

import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
