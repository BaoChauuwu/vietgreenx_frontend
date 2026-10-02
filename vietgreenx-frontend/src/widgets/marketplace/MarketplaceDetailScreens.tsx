"use client";

import {
  BuyRequestFormShell,
  MarketplaceDetailShell,
  SellOfferFormShell,
} from "./MarketplaceScreens";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { MarketplaceConnectRail } from "./MarketplaceRails";

interface SellOfferCreateScreenProps {
  locale?: AppLocale;
}

export function SellOfferCreateScreen({ locale = getClientLocale() }: SellOfferCreateScreenProps) {
  return (
    <ModulePageShell width="form">
      <SellOfferFormShell locale={locale} />
    </ModulePageShell>
  );
}

interface BuyRequestCreateScreenProps {
  locale?: AppLocale;
}

export function BuyRequestCreateScreen({
  locale = getClientLocale(),
}: BuyRequestCreateScreenProps) {
  return (
    <ModulePageShell width="form">
      <BuyRequestFormShell locale={locale} />
    </ModulePageShell>
  );
}

interface MarketplaceDetailScreenProps {
  listingId: string;
  locale?: AppLocale;
}

export function MarketplaceDetailScreen({
  listingId,
  locale = getClientLocale(),
}: MarketplaceDetailScreenProps) {
  return (
    <ModulePageShell width="work" rightRail={<MarketplaceConnectRail locale={locale} />}>
      <MarketplaceDetailShell listingId={listingId} locale={locale} />
    </ModulePageShell>
  );
}
