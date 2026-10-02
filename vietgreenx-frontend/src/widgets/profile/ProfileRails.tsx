"use client";

import { FeedProfileBanner } from "@/features/profile";
import { getPostsCopy } from "@/features/posts";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { FarmTipsRail } from "@/shared/ui/workspace-rail-card";

interface LocaleProps {
  locale?: AppLocale;
}

export function ProfileWorkspaceRail({ locale = getClientLocale() }: LocaleProps) {
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <FeedProfileBanner locale={locale} />
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}
