"use client";

import Link from "next/link";
import { Layers, Loader2, Plus } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { BatchRow, getBatchesCopy, useBatches } from "@/features/batches";
import { useProducts } from "@/features/products";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { Pagination } from "@/shared/ui/pagination";
import { BatchesWorkflowRail } from "./BatchRails";

interface BatchListScreenProps {
  locale?: AppLocale;
}

export function BatchListScreen({ locale = getClientLocale() }: BatchListScreenProps) {
  const copy = getBatchesCopy(locale).hub;
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") || undefined;
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useBatches(page, 10, productId);
  const { data: productsData } = useProducts(1, 100);

  const productMap = useMemo(() => {
    const map = new Map<string, string>();
    (productsData?.items ?? []).forEach((item) => {
      map.set(item.id, item.name);
    });
    return map;
  }, [productsData]);

  return (
    <ModulePageShell width="work" rightRail={<BatchesWorkflowRail locale={locale} />}>
      <ModulePageHeader
        title={copy.title}
        icon={Layers}
        actions={
          isLoading ? undefined : (
            <Button asChild className="gap-1.5">
              <Link href={ROUTES.batchCreate}>
                <Plus className="size-4" />
                {copy.createCta}
              </Link>
            </Button>
          )
        }
      />

      {isLoading ? (
        <ElevatedCard>
          <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {copy.loading}
          </CardContent>
        </ElevatedCard>
      ) : isError ? (
        <ElevatedCard className="border border-dashed border-border">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {copy.loadError}
          </CardContent>
        </ElevatedCard>
      ) : data?.items.length ? (
        <div className="space-y-4">
          <ElevatedCard className="shadow-xs divide-y divide-border/60 overflow-hidden border border-border/80">
            {data.items.map((batch) => (
              <BatchRow
                key={batch.id}
                batch={batch}
                productName={productMap.get(batch.productId)}
                locale={locale}
              />
            ))}
          </ElevatedCard>
          <Pagination currentPage={page} totalPages={data?.totalPage ?? 1} onPageChange={setPage} />
        </div>
      ) : (
        <ElevatedCard>
          <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <Layers className="size-12 text-muted-foreground/40" />
            <div className="max-w-md space-y-2">
              <p className="text-lg font-semibold tracking-tight">{copy.emptyTitle}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {copy.emptyDescription}
              </p>
            </div>
            <Button asChild className="gap-1.5">
              <Link href={ROUTES.batchCreate}>
                <Plus className="size-4" />
                {copy.createCta}
              </Link>
            </Button>
          </CardContent>
        </ElevatedCard>
      )}
    </ModulePageShell>
  );
}
