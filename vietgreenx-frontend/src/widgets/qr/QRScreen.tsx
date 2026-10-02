"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useBatches } from "@/features/batches";
import { useProducts } from "@/features/products";
import {
  QRDashboardShell,
  useQrApiAvailable,
  useQrQuota,
  useQrTokens,
  type QrLinkLabels,
} from "@/features/traceability";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { QrQuotaRail } from "./QrRails";

interface QRScreenProps {
  locale?: AppLocale;
}

export function QRScreen({ locale = getClientLocale() }: QRScreenProps) {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") || undefined;
  const [page, setPage] = useState(1);
  const { isUnavailable: apiUnavailable, isLoading: apiChecking } = useQrApiAvailable();
  const { data: quota, isLoading: quotaLoading, isError: quotaError } = useQrQuota();
  const {
    data: tokens,
    isLoading: tokensLoading,
    isError: tokensError,
  } = useQrTokens(page, 20, productId);
  const { data: batchesData } = useBatches(1, 100);
  const { data: productsData } = useProducts(1, 100);
  const linkLabels = useMemo<QrLinkLabels>(
    () => ({
      batches: Object.fromEntries(
        (batchesData?.items ?? []).map((batch) => [batch.id, batch.batchCode]),
      ),
      products: Object.fromEntries(
        (productsData?.items ?? []).map((product) => [product.id, product.name]),
      ),
    }),
    [batchesData?.items, productsData?.items],
  );

  return (
    <ModulePageShell
      width="work"
      rightRail={<QrQuotaRail locale={locale} quota={quota} quotaLoading={quotaLoading} />}
    >
      <QRDashboardShell
        locale={locale}
        quota={quota}
        quotaLoading={quotaLoading || apiChecking}
        quotaUnavailable={quotaError || apiUnavailable}
        tokens={tokens}
        tokensLoading={tokensLoading}
        tokensError={tokensError}
        apiUnavailable={apiUnavailable}
        linkLabels={linkLabels}
        page={page}
        onPageChange={setPage}
      />
    </ModulePageShell>
  );
}
