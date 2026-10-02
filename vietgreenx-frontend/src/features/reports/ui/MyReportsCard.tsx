"use client";

import { Loader2, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useState } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { Button } from "@/shared/ui/button";
import type { ReportStatus, ReportTargetType, ReportReason } from "@/entities/report";

import { useMyReports } from "../api/report.queries";
import { getReportsCopy } from "../reports.constants";

interface MyReportsCardProps {
  locale?: AppLocale;
}

export function MyReportsCard({ locale = getClientLocale() }: MyReportsCardProps) {
  const copy = getReportsCopy(locale);
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useMyReports(page, 10);

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Clock className="size-3" />
            {copy.myReports.statuses.pending}
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
            <AlertCircle className="size-3" />
            {copy.myReports.statuses.under_review}
          </span>
        );
      case "actioned":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3" />
            {copy.myReports.statuses.actioned}
          </span>
        );
      case "dismissed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
            <XCircle className="size-3" />
            {copy.myReports.statuses.dismissed}
          </span>
        );
      default:
        return null;
    }
  };

  const getReasonLabel = (reason: ReportReason) => {
    return copy.reasons[reason] ?? reason;
  };

  const getTargetTypeLabel = (targetType: ReportTargetType) => {
    return copy.myReports.targetTypes[targetType] ?? targetType;
  };

  return (
    <ElevatedCard>
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">{copy.myReports.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{copy.myReports.description}</p>
          </div>
          {isFetching && !isLoading && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : !data || data.data.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">{copy.myReports.empty}</p>
        ) : (
          <div className="space-y-3">
            <ul className="divide-y divide-border rounded-lg border border-border">
              {data.data.map((report) => (
                <li key={report.id} className="space-y-1.5 p-3.5 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {getTargetTypeLabel(report.targetType)}
                      </span>
                      <span className="font-medium text-foreground">
                        {getReasonLabel(report.reason)}
                      </span>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>

                  {report.details && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{report.details}</p>
                  )}

                  <div className="text-[11px] text-muted-foreground">
                    {new Date(report.createdAt).toLocaleString(
                      locale === "vi" ? "vi-VN" : "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {copy.myReports.prevPage}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {copy.myReports.pageInfo(data.pagination.page, data.pagination.totalPages)}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= data.pagination.totalPages || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {copy.myReports.nextPage}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </ElevatedCard>
  );
}
