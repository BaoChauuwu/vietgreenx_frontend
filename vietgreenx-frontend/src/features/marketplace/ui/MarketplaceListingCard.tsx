"use client";

import Link from "next/link";
import { BadgeCheck, DollarSign, MapPin, Package } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { ROUTES } from "@/shared/routing";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { getMarketplaceCopy } from "../marketplace.constants";
import type { MarketplaceListing } from "../marketplace.types";

import { useProvinces } from "@/entities/location/api/location.queries";

const KIND_CLASS = {
  sell: "bg-secondary-50 text-secondary-700",
  buy: "bg-primary/10 text-primary",
} as const;

interface MarketplaceListingCardProps {
  listing: MarketplaceListing;
  locale?: AppLocale;
  className?: string;
}

export function MarketplaceListingCard({
  listing,
  locale = getClientLocale(),
  className,
}: MarketplaceListingCardProps) {
  const copy = getMarketplaceCopy(locale);
  const { data: provinces } = useProvinces();
  const provinceName = provinces?.find(
    (p) => String(p.code) === String(listing.provinceCode),
  )?.name;

  const postedLabel = new Date(listing.postedAt).toLocaleDateString(toIntlLocale(locale));

  return (
    <ElevatedCard className={cn("transition-colors hover:bg-muted/20", className)}>
      <CardContent className="p-4">
        <Link href={ROUTES.marketplaceDetail(listing.id)} className="block space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    KIND_CLASS[listing.kind],
                  )}
                >
                  {copy.kind[listing.kind]}
                </span>
                {listing.orgVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                    <BadgeCheck className="size-3.5" aria-hidden />
                    {copy.card.verified}
                  </span>
                )}
              </div>
              <h2 className="font-semibold text-foreground hover:text-primary">{listing.title}</h2>
              <p className="text-sm text-muted-foreground">{listing.orgName}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{postedLabel}</span>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <p className="flex items-center gap-1.5 text-foreground/90">
              <Package className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                {copy.card.quantity}: {listing.quantity} {listing.unit}
              </span>
            </p>
            <p className="flex items-center gap-1.5 text-foreground/90">
              <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                {copy.card.province}: {provinceName || "—"}
              </span>
            </p>
            <p className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <DollarSign
                className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
              <span>
                {copy.card.price}: {listing.priceLabel || copy.detail.negotiable}
              </span>
            </p>
          </div>

          {listing.certifications && listing.certifications.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {listing.certifications.map((cert) => (
                <li
                  key={cert}
                  className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground/80"
                >
                  {cert}
                </li>
              ))}
            </ul>
          )}
        </Link>
      </CardContent>
    </ElevatedCard>
  );
}
