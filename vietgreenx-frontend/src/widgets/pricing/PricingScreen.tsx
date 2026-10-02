"use client";

import { PricingTableShell } from "@/features/pricing";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { PricingOrgRail } from "./PricingRails";

interface PricingScreenProps {
  locale?: AppLocale;
}

export function PricingScreen({ locale = getClientLocale() }: PricingScreenProps) {
  return (
    <ModulePageShell width="feed">
      <PricingTableShell locale={locale} />
    </ModulePageShell>
  );
}
