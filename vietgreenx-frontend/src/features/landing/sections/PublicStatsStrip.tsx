"use client";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";

import { getLandingCopy } from "../landing.constants";

export interface PublicStatsStripData {
  userCount: number;
  qrScanCount: number;
}

interface PublicStatsStripProps {
  stats: PublicStatsStripData | null | undefined;
  locale?: AppLocale;
  className?: string;
}

export function PublicStatsStrip({
  stats,
  locale = getClientLocale(),
  className,
}: PublicStatsStripProps) {
  if (!stats) return null;

  const labels = getLandingCopy(locale).hero.publicStats;

  return (
    <div className={cn("flex flex-wrap gap-3 text-sm text-muted-foreground", className)}>
      <span>
        <strong className="font-semibold text-foreground tabular-nums">{stats.userCount.toLocaleString()}</strong>{" "}
        {labels.users}
      </span>
      <span aria-hidden>·</span>
      <span>
        <strong className="font-semibold text-foreground tabular-nums">{stats.qrScanCount.toLocaleString()}</strong>{" "}
        {labels.scans}
      </span>
    </div>
  );
}
