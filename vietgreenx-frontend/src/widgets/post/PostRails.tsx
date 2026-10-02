"use client";

import Link from "next/link";
import { Home } from "lucide-react";

import { getPostsCopy } from "@/features/posts";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { FarmTipsRail, WorkspaceRailCard } from "@/shared/ui/workspace-rail-card";

interface LocaleProps {
  locale?: AppLocale;
}

export function PostDetailRail({ locale = getClientLocale() }: LocaleProps) {
  const detail = getPostsCopy(locale).detail;
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={detail.railTitle} description={detail.railDescription}>
        <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
          <Link href={ROUTES.feed}>
            <Home className="size-4" />
            {detail.backToFeed}
          </Link>
        </Button>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}
