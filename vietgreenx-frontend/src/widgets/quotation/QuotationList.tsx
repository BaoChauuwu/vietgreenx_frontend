"use client";

import { useState } from "react";
import { Loader2, DollarSign } from "lucide-react";

import { ElevatedCard } from "@/shared/ui/elevated-card";
import { Pagination } from "@/shared/ui/pagination";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useQuotations, QUOTATION_COPY } from "@/features/quotation";

import { QuotationCard } from "./QuotationCard";

interface QuotationListProps {
  locale?: AppLocale;
}

export function QuotationList({ locale = getClientLocale() }: QuotationListProps) {
  const t = QUOTATION_COPY[locale];
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuotations(page, limit, tab);
  const items = data?.items ?? [];
  const totalPages = data?.totalPage ?? 1;

  const handleTabChange = (newTab: "received" | "sent") => {
    setTab(newTab);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => handleTabChange("received")}
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === "received"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.tabs.received}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("sent")}
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === "sent"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.tabs.sent}
        </button>
      </div>

      {/* List Content */}
      {isLoading ? (
        <ElevatedCard className="py-16 text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-2 text-xs text-muted-foreground">{t.loading}</p>
        </ElevatedCard>
      ) : items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <QuotationCard key={item.id} quotation={item} locale={locale} />
          ))}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            showSinglePage
          />
        </div>
      ) : (
        <ElevatedCard className="py-14 text-center text-muted-foreground">
          <DollarSign className="mx-auto mb-2 size-10 opacity-30" />
          <p className="text-sm font-semibold">
            {tab === "received" ? t.empty.received : t.empty.sent}
          </p>
        </ElevatedCard>
      )}
    </div>
  );
}
