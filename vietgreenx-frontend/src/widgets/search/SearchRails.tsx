"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Leaf, ShoppingBag } from "lucide-react";

import { getPostsCopy } from "@/features/posts";
import { getSearchCopy } from "@/features/search";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { FarmTipsRail, WorkspaceRailCard } from "@/shared/ui/workspace-rail-card";

interface LocaleProps {
  locale?: AppLocale;
}

function RailButtonStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function SearchExploreRail({ locale = getClientLocale() }: LocaleProps) {
  const { rail: copy, emptyResultsHint } = getSearchCopy(locale);
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={copy.title} description={emptyResultsHint}>
        <RailButtonStack>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.marketplace}>
              <ShoppingBag className="size-4" />
              {copy.marketplace}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.greenProfile}>
              <Leaf className="size-4" />
              {copy.greenProfile}
            </Link>
          </Button>
        </RailButtonStack>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}
