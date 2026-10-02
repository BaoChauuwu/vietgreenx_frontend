"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Leaf, MapPin, ShoppingBag } from "lucide-react";
import type { Product } from "@/entities/product";
import { getSearchCopy } from "@/features/search";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";

interface SearchProductCardProps {
  product: Product & {
    media?: Array<{ cdnUrl?: string; url?: string }>;
    medias?: Array<{ cdnUrl?: string; url?: string }>;
    photoUrl?: string;
    coverUrl?: string;
    imageUrl?: string;
    cdnUrl?: string;
  };
  locale?: AppLocale;
}

export function SearchProductCard({ product, locale = getClientLocale() }: SearchProductCardProps) {
  const copy = getSearchCopy(locale);

  // Extract image URL across all possible backend field conventions
  const rawMediaUrl =
    product.photoMedias?.[0]?.cdnUrl ||
    product.medias?.[0]?.cdnUrl ||
    product.medias?.[0]?.url ||
    product.media?.[0]?.cdnUrl ||
    product.media?.[0]?.url ||
    product.photoUrl ||
    product.coverUrl ||
    product.imageUrl ||
    product.cdnUrl ||
    null;

  const coverUrl = rawMediaUrl ? resolveMediaUrl(rawMediaUrl) : null;

  const location = product.productionLocation || product.province || null;
  const quantityLabel =
    product.availableQuantity != null
      ? `${product.availableQuantity} ${product.priceUnit || ""}`.trim()
      : null;
  const standards =
    product.qualityStandards && product.qualityStandards.length > 0
      ? product.qualityStandards.join(" · ")
      : null;

  return (
    <div className="group w-full overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        {/* Cover / Image Thumbnail */}
        <div className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-primary/10 to-primary/5 sm:size-32">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={product.name}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 text-primary/70">
              <Leaf className="size-10 stroke-[1.5]" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {copy.status.product}
              </span>
            </div>
          )}

          <span className="backdrop-blur-xs absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
            {product.status === "active" ? copy.status.active : copy.status.product}
          </span>
        </div>

        {/* Product Details */}
        <div className="flex min-w-0 flex-1 flex-col justify-between space-y-2">
          {/* Top content */}
          <div className="space-y-1.5">
            <Link
              href={ROUTES.productDetail(product.id)}
              className="line-clamp-1 text-lg font-bold text-foreground transition-colors hover:text-primary"
            >
              {product.name}
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {product.priceUnit && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  <ShoppingBag className="size-3.5" />
                  {product.priceUnit}
                </span>
              )}
              {standards && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> {standards}
                </span>
              )}
            </div>

            {product.description && (
              <p className="line-clamp-2 pt-0.5 text-xs leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}
          </div>

          {/* Bottom row: Info on left, Button at bottom right */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/30 pt-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {location && (
                <span className="inline-flex items-center gap-1 font-medium">
                  <MapPin className="size-3.5 shrink-0 text-primary" />
                  {location}
                </span>
              )}
              {location && quantityLabel && <span>·</span>}
              {quantityLabel && <span>Số lượng: {quantityLabel}</span>}
            </div>

            <Button
              asChild
              size="sm"
              className="ml-auto h-9 shrink-0 gap-1 rounded-xl bg-primary px-4 font-bold text-primary-foreground transition-all hover:bg-primary/90"
            >
              <Link href={ROUTES.productDetail(product.id)}>
                {copy.actions.viewProduct} <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
