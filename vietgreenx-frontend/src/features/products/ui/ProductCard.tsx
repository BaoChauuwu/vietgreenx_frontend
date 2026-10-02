"use client";

import Link from "next/link";
import {
  Layers,
  MapPin,
  MoreHorizontal,
  Pencil,
  QrCode,
  ShoppingBag,
  Store,
  Tag,
  Trash2,
} from "lucide-react";

import type { Product } from "@/entities/product";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { useDeleteProduct } from "../api/product.queries";
import { getProductsCopy } from "../products.constants";

interface ProductCardProps {
  product: Product;
  locale?: AppLocale;
  className?: string;
}

function getStatusBadgeConfig(status: Product["status"]): {
  className: string;
  dotColor: string;
  textColor: string;
} {
  switch (status) {
    case "active":
      return {
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        dotColor: "bg-emerald-500",
        textColor: "text-emerald-700 dark:text-emerald-400",
      };
    case "draft":
      return {
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        dotColor: "bg-amber-500",
        textColor: "text-amber-700 dark:text-amber-400",
      };
    case "out_of_stock":
      return {
        className: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        dotColor: "bg-rose-500",
        textColor: "text-rose-700 dark:text-rose-400",
      };
    case "archived":
    default:
      return {
        className: "bg-muted text-muted-foreground border-border",
        dotColor: "bg-muted-foreground/60",
        textColor: "text-muted-foreground",
      };
  }
}

export function ProductCard({ product, locale = getClientLocale(), className }: ProductCardProps) {
  const copy = getProductsCopy(locale);
  const cardCopy = copy.card;
  const filterCopy = copy.hub.filters;
  const deleteCopy = copy.delete;
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const coverUrl = product.photoMedias?.[0]?.cdnUrl
    ? resolveMediaUrl(product.photoMedias[0].cdnUrl)
    : null;

  const handleDelete = () => {
    if (!window.confirm(deleteCopy.confirm)) return;
    deleteProduct(product.id);
  };

  const statusLabel = filterCopy[product.status as keyof typeof filterCopy] ?? product.status;
  const statusConfig = getStatusBadgeConfig(product.status);

  const formattedPrice =
    product.priceReference != null
      ? `${new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN").format(product.priceReference)} ${product.priceUnit ?? "đ"}`
      : product.priceUnit;

  return (
    <div
      className={cn(
        "group relative p-4 transition-all duration-200 hover:bg-muted/40 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Product Thumbnail */}
        <div className="shadow-2xs relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-emerald-500/5 via-primary/5 to-muted transition-all group-hover:border-primary/30 sm:size-24">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={product.name}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ShoppingBag
              className="size-9 text-muted-foreground/35 transition-all duration-300 group-hover:scale-110 group-hover:text-primary/40"
              aria-hidden
            />
          )}
        </div>

        {/* Product Information */}
        <div className="min-w-0 flex-1 space-y-2.5">
          {/* Top row: Name, status badge, price */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={ROUTES.productDetail(product.id)}
                className="text-base font-bold tracking-tight text-foreground transition-colors hover:text-primary sm:text-lg"
              >
                {product.name}
              </Link>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  statusConfig.className,
                )}
              >
                <span className={cn("size-1.5 rounded-full", statusConfig.dotColor)} />
                {statusLabel}
              </span>
            </div>

            {formattedPrice ? (
              <span className="text-xs font-semibold text-foreground">{formattedPrice}</span>
            ) : null}
          </div>

          {/* Location if available */}
          {product.productionLocation || product.province ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3 text-muted-foreground/70" />
              <span>
                {[product.productionLocation, product.province].filter(Boolean).join(", ")}
              </span>
            </div>
          ) : null}

          {/* Description */}
          {product.description && (
            <p className="line-clamp-2 text-sm font-normal leading-relaxed text-muted-foreground/90">
              {product.description}
            </p>
          )}

          {/* Action Toolbar - Icon + Text buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="shadow-2xs h-8 gap-1.5 border-border/70 bg-background px-3 text-xs font-medium transition-all hover:bg-accent"
            >
              <Link href={ROUTES.productDetail(product.id)}>
                <Pencil className="size-3.5 text-foreground/80" />
                {cardCopy.edit}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="shadow-2xs h-8 gap-1.5 border-border/70 bg-background px-3 text-xs font-medium text-foreground transition-all hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
            >
              <Link href={ROUTES.batchCreate}>
                <Layers className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {cardCopy.createBatch}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="shadow-2xs h-8 gap-1.5 border-border/70 bg-background px-3 text-xs font-medium text-foreground transition-all hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/30 dark:hover:text-amber-300"
            >
              <Link href={ROUTES.marketplaceSellCreate}>
                <Store className="size-3.5 text-amber-600 dark:text-amber-400" />
                {cardCopy.marketplace}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="shadow-2xs h-8 gap-1.5 border-border/70 bg-background px-3 text-xs font-medium text-foreground transition-all hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
            >
              <Link href={ROUTES.qr}>
                <QrCode className="size-3.5 text-blue-600 dark:text-blue-400" />
                {cardCopy.qr}
              </Link>
            </Button>

            {product.status !== "archived" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shadow-2xs h-8 gap-1.5 border-border/70 bg-background px-3 text-xs font-medium text-rose-600 transition-all hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                <Trash2 className="size-3.5 text-rose-500" />
                {cardCopy.delete}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridCard({
  product,
  locale = getClientLocale(),
  className,
}: ProductCardProps) {
  const copy = getProductsCopy(locale);
  const cardCopy = copy.card;
  const filterCopy = copy.hub.filters;
  const deleteCopy = copy.delete;
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const coverUrl = product.photoMedias?.[0]?.cdnUrl
    ? resolveMediaUrl(product.photoMedias[0].cdnUrl)
    : null;

  const handleDelete = () => {
    if (!window.confirm(deleteCopy.confirm)) return;
    deleteProduct(product.id);
  };

  const statusLabel = filterCopy[product.status as keyof typeof filterCopy] ?? product.status;
  const statusConfig = getStatusBadgeConfig(product.status);

  const formattedPrice =
    product.priceReference != null
      ? `${new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN").format(product.priceReference)} ${product.priceUnit ?? "đ"}`
      : product.priceUnit;

  return (
    <ElevatedCard
      className={cn(
        "group flex flex-col overflow-hidden border border-border/60 transition-all duration-300 hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      {/* Top Banner Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-emerald-500/5 via-primary/5 to-muted">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground/30">
            <ShoppingBag className="size-12 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary/40" />
          </div>
        )}

        {/* Top Badges overlay */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <span
            className={cn(
              "shadow-xs inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-2.5 py-1 text-xs font-semibold backdrop-blur-md",
              statusConfig.className,
            )}
          >
            <span className={cn("size-1.5 rounded-full", statusConfig.dotColor)} />
            {statusLabel}
          </span>

          {formattedPrice ? (
            <span className="shadow-xs inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-background/90 px-2.5 py-1 text-xs font-bold text-emerald-800 backdrop-blur-md dark:text-emerald-200">
              <Tag className="size-3 text-emerald-600 dark:text-emerald-400" />
              {formattedPrice}
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <Link
          href={ROUTES.productDetail(product.id)}
          className="line-clamp-1 text-base font-bold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>

        {product.productionLocation || product.province ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0 text-muted-foreground/70" />
            <span className="truncate">
              {[product.productionLocation, product.province].filter(Boolean).join(", ")}
            </span>
          </div>
        ) : null}

        {product.description ? (
          <p className="line-clamp-2 text-xs font-normal leading-relaxed text-muted-foreground/90">
            {product.description}
          </p>
        ) : null}

        {/* Action Toolbar - 5 fixed icon-only slots for 100% uniform alignment */}
        <div className="mt-auto grid w-full grid-cols-5 gap-1.5 border-t border-border/50 pt-3">
          {/* Slot 1: Sửa */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8.5 shadow-2xs flex w-full items-center justify-center border-border/70 bg-background p-0 hover:bg-accent"
            title={cardCopy.edit}
          >
            <Link href={ROUTES.productDetail(product.id)}>
              <Pencil className="size-3.5 text-foreground/80" />
            </Link>
          </Button>

          {/* Slot 2: Tạo lô */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8.5 shadow-2xs flex w-full items-center justify-center border-border/70 bg-background p-0 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
            title={cardCopy.createBatch}
          >
            <Link href={ROUTES.batchCreate}>
              <Layers className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            </Link>
          </Button>

          {/* Slot 3: Đăng chợ */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8.5 shadow-2xs flex w-full items-center justify-center border-border/70 bg-background p-0 text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/30"
            title={cardCopy.marketplace}
          >
            <Link href={ROUTES.marketplaceSellCreate}>
              <Store className="size-3.5 text-amber-600 dark:text-amber-400" />
            </Link>
          </Button>

          {/* Slot 4: Tạo QR */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8.5 shadow-2xs flex w-full items-center justify-center border-border/70 bg-background p-0 text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/30"
            title={cardCopy.qr}
          >
            <Link href={ROUTES.qr}>
              <QrCode className="size-3.5 text-blue-600 dark:text-blue-400" />
            </Link>
          </Button>

          {/* Slot 5: Xóa (placeholder if archived) */}
          {product.status !== "archived" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8.5 shadow-2xs flex w-full items-center justify-center border-border/70 bg-background p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              disabled={isDeleting}
              onClick={handleDelete}
              title={cardCopy.delete}
            >
              <Trash2 className="size-3.5 text-rose-500" />
            </Button>
          ) : (
            <div className="h-8.5 w-full" aria-hidden />
          )}
        </div>
      </div>
    </ElevatedCard>
  );
}

export function ProductTableRow({
  product,
  locale = getClientLocale(),
  className,
}: ProductCardProps) {
  const copy = getProductsCopy(locale);
  const cardCopy = copy.card;
  const filterCopy = copy.hub.filters;
  const deleteCopy = copy.delete;
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const coverUrl = product.photoMedias?.[0]?.cdnUrl
    ? resolveMediaUrl(product.photoMedias[0].cdnUrl)
    : null;

  const handleDelete = () => {
    if (!window.confirm(deleteCopy.confirm)) return;
    deleteProduct(product.id);
  };

  const statusLabel = filterCopy[product.status as keyof typeof filterCopy] ?? product.status;
  const statusConfig = getStatusBadgeConfig(product.status);

  const formattedPrice =
    product.priceReference != null
      ? `${new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN").format(product.priceReference)} ${product.priceUnit ?? "đ"}`
      : product.priceUnit;

  return (
    <tr
      className={cn(
        "group border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40",
        className,
      )}
    >
      {/* Product Image & Name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt={product.name} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground/30">
                <ShoppingBag className="size-6" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={ROUTES.productDetail(product.id)}
              className="line-clamp-1 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              {product.name}
            </Link>
            {product.description && (
              <p className="line-clamp-1 max-w-xs text-xs text-muted-foreground">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-foreground">
        {statusLabel}
      </td>

      {/* Price / Unit */}
      <td className="whitespace-nowrap px-4 py-3">
        {formattedPrice ? (
          <span className="text-xs font-semibold text-foreground">{formattedPrice}</span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>

      {/* Location */}
      <td className="max-w-xs truncate whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
        {[product.productionLocation, product.province].filter(Boolean).join(", ") || "—"}
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="size-8 h-8 p-0 text-xs text-foreground hover:bg-muted hover:text-primary"
            title={cardCopy.edit}
          >
            <Link href={ROUTES.productDetail(product.id)}>
              <Pencil className="size-3.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="size-8 h-8 p-0 text-xs text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
            title={cardCopy.createBatch}
          >
            <Link href={ROUTES.batchCreate}>
              <Layers className="size-3.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="size-8 h-8 p-0 text-xs text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
            title={cardCopy.marketplace}
          >
            <Link href={ROUTES.marketplaceSellCreate}>
              <Store className="size-3.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="size-8 h-8 p-0 text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
            title={cardCopy.qr}
          >
            <Link href={ROUTES.qr}>
              <QrCode className="size-3.5" />
            </Link>
          </Button>

          {product.status !== "archived" ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-8 h-8 p-0 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600"
              disabled={isDeleting}
              onClick={handleDelete}
              title={cardCopy.delete}
            >
              <Trash2 className="size-3.5" />
            </Button>
          ) : (
            <div className="size-8 h-8" aria-hidden />
          )}
        </div>
      </td>
    </tr>
  );
}
