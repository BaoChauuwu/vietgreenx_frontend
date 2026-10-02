"use client";

import { Loader2, Star, UserCircle2 } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import type { SupplierReview } from "@/entities/supplier";
import { useSupplierReviews, useSupplierReviewSummary } from "../api/supplier.queries";
import { SUPPLIER_COPY } from "../supplier.constants";
import { SupplierReviewDialog } from "./SupplierReviewDialog";

interface SupplierReviewSummaryCardProps {
  supplierId: string;
  supplierName?: string;
  locale?: AppLocale;
}

export function SupplierReviewSummaryCard({
  supplierId,
  supplierName,
  locale = getClientLocale(),
}: SupplierReviewSummaryCardProps) {
  const t = SUPPLIER_COPY[locale];
  const { data: summary, isLoading: isLoadingSummary } = useSupplierReviewSummary(supplierId);
  const { data: reviewsData, isLoading: isLoadingReviews } = useSupplierReviews(supplierId, 1, 5);

  const avgRating = summary?.avgRating ? Number(summary.avgRating).toFixed(1) : "0.0";
  const reviewCount = summary?.reviewCount || 0;
  const reviews: SupplierReview[] = summary?.items || reviewsData?.data || [];

  const intlLocale = toIntlLocale(locale);

  return (
    <ElevatedCard>
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              {t.reviewsTitle}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t.totalReviews.replace("{count}", String(reviewCount))}
            </p>
          </div>

          <SupplierReviewDialog
            supplierId={supplierId}
            supplierName={supplierName}
            locale={locale}
          />
        </div>

        {/* Rating Banner */}
        <div className="flex items-center gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 dark:bg-amber-500/10">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-foreground">{avgRating}</span>
            <span className="text-sm font-semibold text-muted-foreground">/ 5.0</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`size-4 ${
                    star <= Math.round(Number(avgRating))
                      ? "fill-amber-500 text-amber-500"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {t.totalReviews.replace("{count}", String(reviewCount))}
            </span>
          </div>
        </div>

        {/* Reviews List */}
        {isLoadingSummary || isLoadingReviews ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-sm font-semibold text-foreground">{t.noReviewsTitle}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.noReviewsDesc}</p>
          </div>
        ) : (
          <ul className="space-y-3 pt-2">
            {reviews.map((rev) => (
              <li
                key={rev.id}
                className="space-y-1.5 rounded-lg border border-border/60 bg-background p-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="size-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {rev.reviewer?.displayName || rev.reviewer?.username || "Thành viên"}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(intlLocale) : ""}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-3 ${
                        star <= rev.rating
                          ? "fill-amber-500 text-amber-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                {rev.reviewBody && (
                  <p className="leading-relaxed text-muted-foreground">{rev.reviewBody}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </ElevatedCard>
  );
}
