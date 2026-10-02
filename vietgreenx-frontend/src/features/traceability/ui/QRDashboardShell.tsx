"use client";

import Link from "next/link";
import { Loader2, QrCode } from "lucide-react";

import type { PublicTraceToken, PublicTraceTokenList } from "@/entities/public-trace-token";
import type { QrQuota } from "@/entities/qr-quota";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import { Pagination } from "@/shared/ui/pagination";
import { getTraceCopy } from "../trace.constants";
import { QrQuotaSummary } from "./QrQuotaSummary";
import { TraceTokenActions } from "./TraceTokenActions";
import { ExportQrPdfDialog } from "./ExportQrPdfDialog";

export interface QrLinkLabels {
  batches: Record<string, string>;
  products: Record<string, string>;
}

interface QRDashboardShellProps {
  locale?: AppLocale;
  quota?: QrQuota | null;
  quotaLoading?: boolean;
  quotaUnavailable?: boolean;
  tokens?: PublicTraceTokenList;
  tokensLoading?: boolean;
  tokensError?: boolean;
  apiUnavailable?: boolean;
  linkLabels?: QrLinkLabels;
  page?: number;
  onPageChange?: (page: number) => void;
}

function resolveLinkedLabel(
  token: PublicTraceToken,
  locale: AppLocale,
  linkLabels: QrLinkLabels,
): string {
  const copy = getTraceCopy(locale).qr;

  if (token.batchId) {
    const name = linkLabels.batches[token.batchId];
    return name ? `${copy.linkedBatch}: ${name}` : `${copy.linkedBatch}`;
  }

  if (token.productId) {
    const name = linkLabels.products[token.productId];
    return name ? `${copy.linkedProduct}: ${name}` : `${copy.linkedProduct}`;
  }

  return "—";
}

export function QRDashboardShell({
  locale = getClientLocale(),
  quota,
  quotaLoading = false,
  quotaUnavailable = false,
  tokens,
  tokensLoading = false,
  tokensError = false,
  apiUnavailable = false,
  linkLabels = { batches: {}, products: {} },
  page = 1,
  onPageChange,
}: QRDashboardShellProps) {
  const copy = getTraceCopy(locale).qr;

  return (
    <div className="w-full space-y-4">
      <ModulePageHeader
        title={copy.title}
        description={copy.emptyDescription}
        icon={QrCode}
        iconTileClassName="bg-tertiary-50 text-tertiary"
        actions={
          <div className="flex items-center gap-2">
            <ExportQrPdfDialog tokens={tokens?.items} linkLabels={linkLabels} locale={locale} />
            <Button asChild className="gap-1.5">
              <Link href={ROUTES.batches}>
                <QrCode className="size-4" />
                {copy.createFromBatchesCta}
              </Link>
            </Button>
          </div>
        }
      />

      {apiUnavailable ? (
        <ElevatedCard className="border border-dashed border-amber-500/40 bg-amber-500/5">
          <CardContent className="p-4 text-sm text-muted-foreground">
            {copy.apiUnavailable}
          </CardContent>
        </ElevatedCard>
      ) : null}

      <QrQuotaSummary
        locale={locale}
        quota={quota}
        isLoading={quotaLoading}
        isUnavailable={quotaUnavailable}
      />

      <ElevatedCard>
        <CardHeader className="pb-2">
          <h2 className="text-sm font-semibold text-foreground">{copy.listTitle}</h2>
        </CardHeader>
        <CardContent className="p-0">
          {tokensLoading ? (
            <div className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin" aria-hidden />
              {copy.loading}
            </div>
          ) : tokensError || apiUnavailable ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {apiUnavailable ? copy.apiUnavailable : copy.loadError}
            </div>
          ) : tokens?.items.length ? (
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <Table className="min-w-[720px]">
                  <TableHeader>
                    <TableRow className="text-muted-foreground">
                      <TableHead>{copy.columns.code}</TableHead>
                      <TableHead>{copy.columns.linked}</TableHead>
                      <TableHead>{copy.columns.scans}</TableHead>
                      <TableHead>{copy.columns.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokens.items.map((token) => (
                      <TableRow key={token.id} className="border-border/60">
                        <TableCell className="px-4 py-3 font-mono text-xs text-foreground">
                          {token.token.slice(0, 8)}…
                        </TableCell>
                        <TableCell className="px-4 py-3 text-foreground">
                          {resolveLinkedLabel(token, locale, linkLabels)}
                        </TableCell>
                        <TableCell className="px-4 py-3 tabular-nums text-muted-foreground">
                          {token.scanCount.toLocaleString(toIntlLocale(locale))}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <TraceTokenActions token={token} locale={locale} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {onPageChange && (
                <div className="border-t border-border px-4">
                  <Pagination
                    currentPage={page}
                    totalPages={tokens.totalPage ?? 1}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
              <p className="font-semibold text-foreground">{copy.emptyTitle}</p>
              <p className="max-w-sm text-sm text-muted-foreground">{copy.emptyDescription}</p>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href={ROUTES.batches}>{copy.createFromBatchesCta}</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </ElevatedCard>
    </div>
  );
}
