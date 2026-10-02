"use client";

import { DollarSign } from "lucide-react";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { QUOTATION_COPY } from "@/features/quotation";
import { QuotationList } from "./QuotationList";

interface QuotationScreenProps {
  locale?: AppLocale;
}

export function QuotationScreen({ locale = getClientLocale() }: QuotationScreenProps) {
  const t = QUOTATION_COPY[locale];

  return (
    <ModulePageShell width="feed">
      <div className="space-y-4">
        <ModulePageHeader title={t.title} description={t.subtitle} icon={DollarSign} />
        <QuotationList locale={locale} />
      </div>
    </ModulePageShell>
  );
}
