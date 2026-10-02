"use client";

import { AlertTriangle, CheckCircle2, Cpu, Link2, ShieldCheck } from "lucide-react";

import type { TraceVerificationStatus } from "@/entities/trace";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getTraceCopy } from "@/features/traceability";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatRelativeTime } from "@/shared/lib/format-relative-time";

interface TraceBlockchainHashPanelProps {
  verificationStatus?: TraceVerificationStatus;
  locale?: AppLocale;
}

export function TraceBlockchainHashPanel({
  verificationStatus,
  locale = getClientLocale(),
}: TraceBlockchainHashPanelProps) {
  const copy = getTraceCopy(locale).preview.blockchainHash;

  const isVerified = verificationStatus?.isVerified ?? true;
  const chainLength = verificationStatus?.chainLength ?? 1;
  const lastVerifiedAt = verificationStatus?.lastVerifiedAt;

  return (
    <ElevatedCard className="overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
            <Cpu className="size-4 text-emerald-600 dark:text-emerald-400" />
            {copy.title}
          </CardTitle>

          <div className="flex items-center gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {copy.verified}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-100/80 px-2.5 py-0.5 text-xs font-semibold text-rose-800 shadow-sm dark:border-rose-800 dark:bg-rose-950/80 dark:text-rose-200">
                <AlertTriangle className="size-3.5 text-rose-600 dark:text-rose-400" />
                {copy.tampered}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{copy.subtitle}</p>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 text-xs">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* Chain Length Metric */}
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/40 p-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Link2 className="size-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{copy.chainLengthLabel}</p>
              <p className="text-sm font-bold tabular-nums text-foreground">
                {chainLength} {copy.blocks}
              </p>
            </div>
          </div>

          {/* Cryptographic Proof */}
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/40 p-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{copy.cryptographicProof}</p>
              <p className="text-xs font-semibold text-foreground">{copy.proofAlgorithm}</p>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="flex items-start gap-2 rounded-md bg-emerald-500/10 p-2.5 text-[11px] text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="space-y-0.5">
            <p className="font-medium">{copy.immutableData}</p>
            {lastVerifiedAt ? (
              <p className="text-[10px] opacity-80">
                {copy.lastVerifiedLabel}: {formatRelativeTime(lastVerifiedAt, locale)}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
