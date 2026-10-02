import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

interface WorkspaceRailCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/** Contextual mini card for workspace right rail (280px column). */
export function WorkspaceRailCard({
  title,
  description,
  children,
  className,
}: WorkspaceRailCardProps) {
  return (
    <ElevatedCard className={className}>
      <CardContent className="space-y-4 p-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children ? <div className="min-w-0">{children}</div> : null}
      </CardContent>
    </ElevatedCard>
  );
}

interface FarmTipsRailProps {
  tipsTitle: string;
  tips: readonly string[];
  className?: string;
}

/** Enhanced tips card — second card in right rail stack. */
export function FarmTipsRail({ tipsTitle, tips, className }: FarmTipsRailProps) {
  return (
    <ElevatedCard
      className={cn(
        "shadow-xs overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-b from-amber-50/40 via-card to-card",
        className,
      )}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
          </div>
          <h2 className="text-sm font-bold tracking-tight text-foreground">{tipsTitle}</h2>
        </div>
        <ul className="space-y-2.5">
          {tips.map((tip, index) => (
            <li
              key={tip}
              className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground"
            >
              <span className="mt-1 flex size-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span className={cn(index === 0 && "font-semibold text-foreground/90")}>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </ElevatedCard>
  );
}
