"use client";

import { Loader2, QrCode } from "lucide-react";

import {
  getQrQuotaRemaining,
  getQrQuotaTotal,
  getQrQuotaUsagePercent,
  type QrQuota,
} from "@/entities/qr-quota";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { getTraceCopy } from "../trace.constants";

interface QrQuotaSummaryProps {
  locale?: AppLocale;
  quota?: QrQuota | null;
  isLoading?: boolean;
  isUnavailable?: boolean;
  className?: string;
  variant?: "card" | "inline";
}

function formatQuotaLimit(quota: QrQuota, unlimitedLabel: string): string {
  const total = getQrQuotaTotal(quota);
  return total > 0 ? String(total) : unlimitedLabel;
}

export function QrQuotaSummary({
  locale = getClientLocale(),
  quota,
  isLoading = false,
  isUnavailable = false,
  className,
  variant = "card",
}: QrQuotaSummaryProps) {
  const copy = getTraceCopy(locale).qr;
  const used = quota?.qrGenerated ?? 0;
  const limitLabel = quota ? formatQuotaLimit(quota, copy.quotaUnlimited) : "—";
  const remaining = quota ? getQrQuotaRemaining(quota) : null;
  const usagePercent = quota ? getQrQuotaUsagePercent(quota) : 0;

  const body = (
    <div className="space-y-2 text-sm">
      {isLoading ? (
        <div className="flex items-center gap-2 py-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {copy.loading}
        </div>
      ) : isUnavailable ? (
        <p className="py-2 text-muted-foreground">{copy.quotaUnavailable}</p>
      ) : (
        <>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{copy.quotaUsed}</span>
            <span className="font-semibold tabular-nums text-foreground">{used}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{copy.quotaLimit}</span>
            <span className="font-semibold tabular-nums text-foreground">{limitLabel}</span>
          </div>
          {remaining != null && getQrQuotaTotal(quota!) > 0 ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{copy.remaining}</span>
              <span className="font-semibold tabular-nums text-foreground">{remaining}</span>
            </div>
          ) : null}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-tertiary transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </>
      )}
    </div>
  );

  if (variant === "inline") {
    return <div className={className}>{body}</div>;
  }

  return (
    <ElevatedCard className={cn("border-tertiary/25 bg-gradient-to-br from-tertiary-50/80 to-card", className)}>
      <CardHeader className="pb-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <QrCode className="size-4 text-tertiary" aria-hidden />
          {copy.quotaTitle}
        </h2>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </ElevatedCard>
  );
}
