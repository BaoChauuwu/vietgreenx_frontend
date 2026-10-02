"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MessageCircle, Plus } from "lucide-react";

import { getMarketplaceCopy } from "@/features/marketplace";
import { getPostsCopy } from "@/features/posts";
import { MARKETPLACE_BUY_ROLES, MARKETPLACE_SELL_ROLES, useUser } from "@/shared/auth";
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

export function MarketplaceConnectRail({ locale = getClientLocale() }: LocaleProps) {
  const { hasRole } = useUser();
  const { hub, detail } = getMarketplaceCopy(locale);
  const aside = getPostsCopy(locale).aside;
  const canPostSell = hasRole(MARKETPLACE_SELL_ROLES);
  const canPostBuy = hasRole(MARKETPLACE_BUY_ROLES);

  return (
    <>
      <WorkspaceRailCard title={detail.connectTitle} description={detail.connectNote}>
        <RailButtonStack>
          {canPostSell && (
            <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
              <Link href={ROUTES.marketplaceSellCreate}>
                <Plus className="size-4" />
                {hub.postSell}
              </Link>
            </Button>
          )}
          {canPostBuy && (
            <Button asChild size="sm" className="w-full justify-start gap-1.5">
              <Link href={ROUTES.marketplaceBuyCreate}>
                <Plus className="size-4" />
                {hub.postBuy}
              </Link>
            </Button>
          )}
          <Button asChild variant="ghost" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.chat}>
              <MessageCircle className="size-4" />
              {detail.chat}
            </Link>
          </Button>
        </RailButtonStack>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}
