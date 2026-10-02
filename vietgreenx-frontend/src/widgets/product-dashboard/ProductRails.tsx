"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  QrCode,
  ShoppingBag,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { getPostsCopy } from "@/features/posts";
import { getProductsCopy, useProduct, useProducts, useUpdateProduct } from "@/features/products";
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

interface ProductDetailActionsRailProps extends LocaleProps {
  productId?: string;
}

export function ProductDetailActionsRail({
  locale = getClientLocale(),
  productId,
}: ProductDetailActionsRailProps) {
  const detail = getProductsCopy(locale).detail;
  const aside = getPostsCopy(locale).aside;
  const { data: product } = useProduct(productId ?? "");
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct(productId ?? "");

  const isDraft = product?.status === "draft";
  const canPublish = isDraft || product?.status === "active";

  return (
    <>
      <WorkspaceRailCard title={detail.actionsTitle} description={detail.actionsDescription}>
        <RailButtonStack>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.batchCreate}>
              <Layers className="size-4" />
              {detail.createBatch}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.marketplaceSellCreate}>
              <ShoppingBag className="size-4" />
              {detail.marketplace}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full justify-start gap-1.5 text-tertiary"
          >
            <Link href={ROUTES.qr}>
              <QrCode className="size-4" />
              {detail.generateQr}
            </Link>
          </Button>
          {productId && canPublish && (
            <Button
              variant={isDraft ? "default" : "outline"}
              size="sm"
              className="w-full justify-start gap-1.5"
              disabled={isUpdating}
              onClick={() => updateProduct({ status: isDraft ? "active" : "draft" })}
            >
              {isUpdating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isDraft ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
              {isDraft ? detail.publish : detail.unpublish}
            </Button>
          )}
        </RailButtonStack>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}

export function ProductsWorkflowRail({ locale = getClientLocale() }: LocaleProps) {
  const { hub, detail } = getProductsCopy(locale);
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={detail.actionsTitle} description={hub.emptyDescription}>
        <RailButtonStack>
          <Button asChild className="w-full justify-start gap-1.5">
            <Link href={ROUTES.productCreate}>
              <Plus className="size-4" />
              {hub.createCta}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.batchCreate}>
              <Layers className="size-4" />
              {detail.createBatch}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.qr}>
              <QrCode className="size-4" />
              {detail.generateQr}
            </Link>
          </Button>
        </RailButtonStack>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}

export function ProductCreateRightRail({ locale = getClientLocale() }: LocaleProps) {
  const copy = getProductsCopy(locale);
  const rail = copy.createRail;
  const { data: productList, isLoading } = useProducts(1, 5);
  const recentProducts = productList?.items ?? [];

  return (
    <div className="space-y-4">
      {/* Tips */}
      <div className="space-y-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-950 shadow-sm dark:text-amber-100">
        <div className="flex items-center gap-2 text-base font-bold text-amber-900 dark:text-amber-200">
          <Sparkles className="size-5 text-amber-600 dark:text-amber-400" />
          <span>{rail.tips.title}</span>
        </div>
        <ul className="space-y-2.5 text-sm">
          {rail.tips.items.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-800 dark:text-amber-300">
                {i + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* QR */}
      <div className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-950 shadow-sm dark:text-emerald-100">
        <div className="flex items-center gap-2 text-base font-bold text-emerald-900 dark:text-emerald-200">
          <QrCode className="size-5 text-emerald-600 dark:text-emerald-400" />
          <span>{rail.qr.title}</span>
        </div>
        <p className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-200/80">
          {rail.qr.description}
        </p>
        <div className="rounded-xl border border-dashed border-emerald-500/30 bg-card p-5 text-center shadow-inner">
          <QrCode className="mx-auto mb-1.5 size-8 text-muted-foreground/40" />
          <p className="text-xs font-medium text-muted-foreground">{rail.qr.notCreated}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          className="w-full gap-2 border-emerald-500/30 bg-card/60 font-medium text-emerald-800 opacity-80 dark:text-emerald-300"
        >
          <QrCode className="size-4 text-emerald-600" />
          <span>{rail.qr.createAfterPost}</span>
        </Button>
      </div>

      {/* My products */}
      <div className="space-y-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-bold text-foreground">
            <span className="flex size-5 items-center justify-center rounded-full bg-amber-500/10 text-xs text-amber-600">
              🍊
            </span>
            <span>{rail.myProducts.title}</span>
          </div>
          <Link
            href={ROUTES.products}
            className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:underline"
          >
            {rail.myProducts.viewAll} <span>→</span>
          </Link>
        </div>
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4 text-xs text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" /> {copy.hub.loading}
            </div>
          ) : recentProducts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border py-3 text-center text-xs text-muted-foreground">
              {rail.myProducts.empty}
            </p>
          ) : (
            recentProducts.slice(0, 5).map((prod) => {
              const isProdActive = prod.status === "active";
              const statusLabel = isProdActive
                ? copy.hub.filters.active
                : prod.status === "out_of_stock"
                  ? copy.hub.filters.out_of_stock
                  : copy.hub.filters.draft;
              const statusColor = isProdActive
                ? "text-emerald-600 dark:text-emerald-400"
                : prod.status === "out_of_stock"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground";
              const dotColor = isProdActive
                ? "bg-emerald-500"
                : prod.status === "out_of_stock"
                  ? "bg-amber-500"
                  : "bg-muted-foreground";

              return (
                <Link
                  key={prod.id}
                  href={ROUTES.productDetail(prod.id)}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-border/60 p-2.5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg shadow-sm">
                      📦
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{prod.name}</p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium">
                        <span className={`size-1.5 rounded-full ${dotColor}`} />
                        <span className={statusColor}>{statusLabel}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="ml-2 size-4 shrink-0 text-muted-foreground" />
                </Link>
              );
            })
          )}
        </div>
        <Button
          asChild
          className="w-full gap-2 bg-emerald-600 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Link href={ROUTES.productCreate}>
            <Plus className="size-4" /> {rail.myProducts.createCta}
          </Link>
        </Button>
      </div>
    </div>
  );
}
