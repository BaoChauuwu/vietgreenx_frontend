"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Building2, ShoppingBag } from "lucide-react";

import { getMarketplaceCopy } from "@/features/marketplace";
import { getPostsCopy } from "@/features/posts";
import { getPricingCopy } from "@/features/pricing";
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

export function PricingOrgRail({ locale = getClientLocale() }: LocaleProps) {
  const copy = getPricingCopy(locale);
  const marketplaceHub = getMarketplaceCopy(locale).hub;
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={copy.rail.title} description={copy.subtitle}>
        <RailButtonStack>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.org}>
              <Building2 className="size-4" />
              {copy.rail.org}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.marketplace}>
              <ShoppingBag className="size-4" />
              {marketplaceHub.title}
            </Link>
          </Button>
        </RailButtonStack>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}
