"use client";

import { ProfileCompletionBanner } from "./ProfileCompletionBanner";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { VGX_ELEVATED_SURFACE } from "@/shared/ui/page-layout";

interface FeedProfileBannerProps {
  locale?: AppLocale;
  className?: string;
}

/** Feed rail card chrome — widget owns social canvas styling per FSD. */
export function FeedProfileBanner({ locale = getClientLocale(), className }: FeedProfileBannerProps) {
  return (
    <ProfileCompletionBanner
      locale={locale}
      variant="card"
      className={cn(VGX_ELEVATED_SURFACE, "relative p-4 pr-10", className)}
    />
  );
}
