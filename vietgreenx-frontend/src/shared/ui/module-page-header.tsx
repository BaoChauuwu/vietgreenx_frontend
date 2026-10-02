import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

interface ModulePageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconTileClassName?: string;
  actions?: ReactNode;
  /** Filter bar, tabs, or inline controls — rendered inside the elevated chrome card. */
  toolbar?: ReactNode;
  /** Small helper text below toolbar (layout notes, hints). */
  meta?: ReactNode;
  /** Wrap header (+ toolbar/meta) in ElevatedCard — default true for card-stack rhythm. */
  elevated?: boolean;
  className?: string;
}

export function ModulePageHeader({
  title,
  description,
  icon: Icon,
  iconTileClassName = "bg-primary/10 text-primary dark:bg-primary/20",
  actions,
  toolbar,
  meta,
  elevated = true,
  className,
}: ModulePageHeaderProps) {
  const headerBody = (
    <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3.5">
        {Icon && (
          <span
            className={cn(
              "shadow-2xs flex size-11 shrink-0 items-center justify-center rounded-2xl",
              iconTileClassName,
            )}
          >
            <Icon className="size-5.5" aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">{description}</p>
          )}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );

  const inner = (
    <div className="space-y-4">
      {headerBody}
      {toolbar ? <div className="min-w-0 pt-0.5">{toolbar}</div> : null}
      {meta ? <div className="min-w-0">{meta}</div> : null}
    </div>
  );

  if (!elevated) {
    return (
      <div
        className={cn(
          "p-4.5 shadow-xs backdrop-blur-xs mb-3 rounded-2xl border border-border/80 bg-card/80 md:p-5",
          className,
        )}
      >
        {inner}
      </div>
    );
  }

  return (
    <ElevatedCard className={cn("mb-3", className)}>
      <CardContent className="p-4.5 md:p-5">{inner}</CardContent>
    </ElevatedCard>
  );
}
