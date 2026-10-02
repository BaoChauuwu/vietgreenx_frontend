"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutList, Loader2, Package, Plus, Table as TableIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  ProductCard,
  ProductTableRow,
  ProductFilterBar,
  getProductsCopy,
  useProducts,
  type ProductStatusFilter,
} from "@/features/products";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { Pagination } from "@/shared/ui/pagination";
import { ProductsWorkflowRail } from "./ProductRails";

interface ProductListScreenProps {
  locale?: AppLocale;
}

const VIEW_MODE_STORAGE_KEY = "vietgreenx_product_view_mode";

export function ProductListScreen({ locale = getClientLocale() }: ProductListScreenProps) {
  const copy = getProductsCopy(locale).hub;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("all");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useProducts(page, 10);

  // Initialize viewMode from searchParams or localStorage so back navigation retains state
  const initialViewMode = useMemo<"list" | "table">(() => {
    const urlView = searchParams.get("view");
    if (urlView === "table" || urlView === "list") return urlView;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      if (saved === "table" || saved === "list") return saved;
    }
    return "list";
  }, [searchParams]);

  const [viewMode, setViewModeState] = useState<"list" | "table">(initialViewMode);

  // Sync state if searchParams change
  useEffect(() => {
    const urlView = searchParams.get("view");
    if (urlView === "table" || urlView === "list") {
      setViewModeState(urlView);
    }
  }, [searchParams]);

  const handleViewModeChange = (mode: "list" | "table") => {
    setViewModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", mode);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    const items = data?.items ?? [];
    if (statusFilter === "all") return items;
    return items.filter((product) => product.status === statusFilter);
  }, [data?.items, statusFilter]);

  return (
    <ModulePageShell width="work" rightRail={<ProductsWorkflowRail locale={locale} />}>
      <ModulePageHeader
        title={copy.title}
        icon={Package}
        iconTileClassName="bg-secondary-50 text-secondary-700"
        actions={
          isLoading ? undefined : (
            <Button asChild className="shadow-xs gap-1.5">
              <Link href={ROUTES.productCreate}>
                <Plus className="size-4" />
                {copy.createCta}
              </Link>
            </Button>
          )
        }
        toolbar={
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <ProductFilterBar locale={locale} value={statusFilter} onChange={setStatusFilter} />

            {/* Layout Switcher Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/60 p-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all",
                  viewMode === "list"
                    ? "shadow-2xs bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => handleViewModeChange("list")}
                title={copy.viewListTitle}
              >
                <LayoutList className="size-3.5" />
                <span className="hidden sm:inline">{copy.viewList}</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all",
                  viewMode === "table"
                    ? "shadow-2xs bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => handleViewModeChange("table")}
                title={copy.viewTableTitle}
              >
                <TableIcon className="size-3.5" />
                <span className="hidden sm:inline">{copy.viewTable}</span>
              </Button>
            </div>
          </div>
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
      ) : filteredProducts.length ? (
        <div className="space-y-4">
          {viewMode === "list" ? (
            /* Layout 1: List View inside Single Card Container */
            <ElevatedCard className="shadow-xs overflow-hidden border border-border/60">
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>{copy.title}</span>
                <span className="font-medium lowercase text-muted-foreground/80">
                  {filteredProducts.length} {copy.itemsCount}
                </span>
              </div>
              <div className="divide-y divide-border/60">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} />
                ))}
              </div>
            </ElevatedCard>
          ) : (
            /* Layout 2: Modern Data Table View */
            <ElevatedCard className="shadow-xs overflow-hidden border border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead>
                    <tr className="whitespace-nowrap border-b border-border/60 bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="whitespace-nowrap px-4 py-3">{copy.tableHeaders.product}</th>
                      <th className="whitespace-nowrap px-4 py-3">{copy.tableHeaders.status}</th>
                      <th className="whitespace-nowrap px-4 py-3">{copy.tableHeaders.price}</th>
                      <th className="whitespace-nowrap px-4 py-3">{copy.tableHeaders.location}</th>
                      <th className="whitespace-nowrap px-4 py-3 text-center">
                        {copy.tableHeaders.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <ProductTableRow key={product.id} product={product} locale={locale} />
                    ))}
                  </tbody>
                </table>
              </div>
            </ElevatedCard>
          )}

          <Pagination
            currentPage={page}
            totalPages={data?.totalPage ?? 1}
            onPageChange={setPage}
            showSinglePage
          />
        </div>
      ) : (
        <ElevatedCard>
          <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <Package className="size-12 text-muted-foreground/40" />
            <div className="max-w-md space-y-2">
              <p className="text-lg font-semibold tracking-tight">{copy.emptyTitle}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {copy.emptyDescription}
              </p>
            </div>
            <Button asChild className="gap-1.5">
              <Link href={ROUTES.productCreate}>
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
