"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, History, Loader2, Package } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { formatRelativeTime } from "@/shared/lib/format-relative-time";
import { buildProfileUrl } from "@/entities/user";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { useTransactionHistory } from "../api/profile.queries";
import { getProfileCopy } from "../profile.constants";

interface ProfileTransactionHistoryCardProps {
  userId: string;
  locale?: AppLocale;
}

export function ProfileTransactionHistoryCard({
  userId,
  locale = getClientLocale(),
}: ProfileTransactionHistoryCardProps) {
  const copy = getProfileCopy(locale).screen.transactionHistory;
  const { data, isLoading, isError } = useTransactionHistory(userId, 1, 20);

  if (isLoading) {
    return (
      <ElevatedCard>
        <CardContent className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {locale === "en" ? "Loading history..." : "Đang tải lịch sử giao dịch..."}
        </CardContent>
      </ElevatedCard>
    );
  }

  if (isError || !data || data.items.length === 0) {
    return (
      <ElevatedCard>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <History className="size-4 text-primary" />
            {copy.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center text-xs text-muted-foreground">
          {copy.emptyDescription}
        </CardContent>
      </ElevatedCard>
    );
  }

  return (
    <ElevatedCard>
      <CardHeader className="pb-2.5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <History className="size-4 text-primary" />
            {copy.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
          {data.items.map((item) => {
            const isSent = item.direction === "sent";
            const partnerName =
              item.partner.displayName || (locale === "en" ? "User" : "Người dùng");
            const partnerUrl = buildProfileUrl(null, item.partner.userId);

            const statusClass =
              item.status === "accepted"
                ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                : item.status === "rejected" || item.status === "withdrawn"
                  ? "bg-rose-100/80 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                  : item.status === "expired"
                    ? "bg-amber-100/80 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                    : "bg-blue-100/80 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300";

            const statusLabel =
              item.status === "accepted"
                ? copy.statusAccepted
                : item.status === "rejected"
                  ? copy.statusRejected
                  : item.status === "expired"
                    ? copy.statusExpired
                    : item.status === "withdrawn"
                      ? copy.statusWithdrawn
                      : copy.statusPending;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/30 p-2.5 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                {/* Top Row: Direction Pill + Status Tag */}
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                      isSent
                        ? "border border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border border-sky-200/60 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300"
                    }`}
                  >
                    {isSent ? (
                      <ArrowUpRight className="size-3" />
                    ) : (
                      <ArrowDownLeft className="size-3" />
                    )}
                    {isSent ? copy.sent : copy.received}
                  </span>

                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Middle Row: Partner Info + Time */}
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  <Link
                    href={partnerUrl}
                    className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary hover:underline"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {partnerName.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate">{partnerName}</span>
                  </Link>

                  {item.createdAt ? (
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {formatRelativeTime(item.createdAt, locale)}
                    </span>
                  ) : null}
                </div>

                {/* Bottom Row: Product & Quantity */}
                {item.productName ? (
                  <div className="mt-0.5 flex items-center justify-between border-t border-border/40 pt-1.5 text-[11px]">
                    <span className="flex min-w-0 items-center gap-1 text-muted-foreground">
                      <Package className="size-3 shrink-0 text-muted-foreground/60" />
                      <span className="truncate">{item.productName}</span>
                    </span>
                    {item.quantity ? (
                      <span className="shrink-0 font-semibold tabular-nums text-foreground">
                        {item.quantity} {item.quantityUnit || "kg"}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
