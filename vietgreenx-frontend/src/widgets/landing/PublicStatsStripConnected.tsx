"use client";

import { PublicStatsStrip } from "@/features/landing";
import { usePublicStats } from "@/features/stats";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

interface PublicStatsStripConnectedProps {
  locale?: AppLocale;
  className?: string;
}

export function PublicStatsStripConnected({
  locale = getClientLocale(),
  className,
}: PublicStatsStripConnectedProps) {
  const { data } = usePublicStats();

  return <PublicStatsStrip stats={data} locale={locale} className={className} />;
}
