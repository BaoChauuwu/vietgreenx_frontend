"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Loader2, Plus, ShoppingBag } from "lucide-react";

import {
  MarketplaceFilterBar,
  MarketplaceListingCard,
  filterListingsByTab,
  getMarketplaceCopy,
} from "@/features/marketplace";
import type { MarketplaceListing, MarketplaceTab } from "@/features/marketplace";
import { useTradePosts } from "@/features/trade-post";
import type { TradePostItem } from "@/entities/trade-post";
import { MARKETPLACE_BUY_ROLES, MARKETPLACE_SELL_ROLES, useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { Pagination } from "@/shared/ui/pagination";
import { MarketplaceConnectRail } from "./MarketplaceRails";

function tradePostToListing(
  post: TradePostItem,
  locale: AppLocale = getClientLocale(),
): MarketplaceListing {
  const detailCopy = getMarketplaceCopy(locale).detail;
  const rawType = String(
    post.tradeType ??
      (post as Record<string, unknown>).trade_type ??
      (post as Record<string, unknown>).kind ??
      (post as Record<string, unknown>).type ??
      "",
  ).toLowerCase();
  const kind = rawType === "buy" ? "buy" : "sell";
  const orgName = post.poster?.displayName || post.poster?.username || detailCopy.memberDefault;
  const priceNum = post.priceReference ? Number(post.priceReference) : 0;
  const currencyUnit = locale === "en" ? "VND" : "VNĐ";
  const numberLocale = locale === "en" ? "en-US" : "vi-VN";
  const priceLabel =
    priceNum > 0
      ? `${priceNum.toLocaleString(numberLocale)} ${currencyUnit}/${post.quantityUnit || "kg"}`
      : detailCopy.negotiable;

  const categoryName =
    locale === "en"
      ? post.category?.nameEn || post.category?.nameVi || detailCopy.defaultProduct
      : post.category?.nameVi || post.category?.nameEn || detailCopy.defaultProduct;

  return {
    id: post.id,
    kind,
    title: post.title,
    productName: categoryName,
    quantity: post.quantity,
    unit: post.quantityUnit || "kg",
    provinceCode: post.provinceCode ? String(post.provinceCode) : "",
    priceLabel,
    certifications: post.certRequirements || [],
    orgName,
    orgVerified: true,
    postedAt: post.createdAt ? String(post.createdAt) : new Date().toISOString(),
    description: post.description || undefined,
  };
}

interface MarketplaceScreenProps {
  locale?: AppLocale;
}

export function MarketplaceScreen({ locale = getClientLocale() }: MarketplaceScreenProps) {
  const copy = getMarketplaceCopy(locale).hub;
  const { hasRole } = useUser();
  const [tab, setTab] = useState<MarketplaceTab>("all");
  const [page, setPage] = useState(1);

  const canPostSell = hasRole(MARKETPLACE_SELL_ROLES);
  const canPostBuy = hasRole(MARKETPLACE_BUY_ROLES);

  const handleTabChange = (newTab: MarketplaceTab) => {
    setTab(newTab);
    setPage(1);
  };

  const { data: tradePostsData, isLoading } = useTradePosts({
    page,
    limit: 10,
    kind: tab === "all" ? undefined : tab,
    tradeType: tab === "all" ? undefined : tab,
  });

  const apiListings = useMemo(() => {
    if (!tradePostsData?.items) return [];
    const seenIds = new Set<string>();
    const uniqueItems: TradePostItem[] = [];
    for (const item of tradePostsData.items) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueItems.push(item);
      }
    }
    const listings = uniqueItems.map((item) => tradePostToListing(item, locale));
    return filterListingsByTab(listings, tab);
  }, [tradePostsData, tab, locale]);

  const totalPages =
    tradePostsData?.totalPage ??
    (tradePostsData?.total && tradePostsData?.limit
      ? Math.ceil(tradePostsData.total / tradePostsData.limit)
      : 1);

  return (
    <ModulePageShell width="work" rightRail={<MarketplaceConnectRail locale={locale} />}>
      <ModulePageHeader
        title={copy.title}
        description={copy.subtitle}
        icon={ShoppingBag}
        iconTileClassName="bg-secondary-50 text-secondary-700"
        actions={
          <>
            {canPostSell && (
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href={ROUTES.marketplaceSellCreate}>
                  <Plus className="size-4" />
                  {copy.postSell}
                </Link>
              </Button>
            )}
            {canPostBuy && (
              <Button asChild size="sm" className="gap-1.5">
                <Link href={ROUTES.marketplaceBuyCreate}>
                  <Plus className="size-4" />
                  {copy.postBuy}
                </Link>
              </Button>
            )}
          </>
        }
        toolbar={<MarketplaceFilterBar locale={locale} value={tab} onChange={handleTabChange} />}
      />

      {isLoading ? (
        <ElevatedCard>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm">Đang tải dữ liệu chợ nông sản...</p>
          </CardContent>
        </ElevatedCard>
      ) : apiListings.length === 0 ? (
        <ElevatedCard>
          <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <ShoppingBag className="size-12 text-muted-foreground/40" />
            <div className="max-w-md space-y-2">
              <p className="text-lg font-semibold tracking-tight">{copy.emptyTitle}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {copy.emptyDescription}
              </p>
            </div>
          </CardContent>
        </ElevatedCard>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-3">
            {apiListings.map((listing) => (
              <li key={listing.id}>
                <MarketplaceListingCard listing={listing} locale={locale} />
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="pt-2"
          />
        </div>
      )}
    </ModulePageShell>
  );
}
