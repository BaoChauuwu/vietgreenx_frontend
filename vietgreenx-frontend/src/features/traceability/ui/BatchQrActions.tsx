"use client";

import { Loader2, QrCode } from "lucide-react";

import type { PublicTraceToken } from "@/entities/public-trace-token";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { Button } from "@/shared/ui/button";

import { getTraceCopy } from "../trace.constants";
import { TraceTokenActions } from "./TraceTokenActions";

interface BatchQrActionsProps {
  locale?: AppLocale;
  traceToken?: PublicTraceToken | null;
  canGenerate?: boolean;
  isGenerating?: boolean;
  qrUnavailable?: boolean;
  onGenerate?: () => void;
  generateLabel: string;
  className?: string;
}

export function BatchQrActions({
  locale = getClientLocale(),
  traceToken,
  canGenerate = false,
  isGenerating = false,
  qrUnavailable = false,
  onGenerate,
  generateLabel,
  className,
}: BatchQrActionsProps) {
  const copy = getTraceCopy(locale).qr;

  return (
    <div className={className}>
      {traceToken ? (
        <>
          <TraceTokenActions token={traceToken} locale={locale} />
          <p className="mt-2 text-xs text-muted-foreground">
            {copy.columns.scans}:{" "}
            {traceToken.scanCount.toLocaleString(toIntlLocale(locale))}
          </p>
        </>
      ) : qrUnavailable ? (
        <p className="text-xs text-muted-foreground">{copy.apiUnavailable}</p>
      ) : canGenerate && onGenerate ? (
        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          disabled={isGenerating}
          onClick={onGenerate}
        >
          {isGenerating ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <QrCode className="size-3.5" />
          )}
          {isGenerating ? copy.generating : generateLabel}
        </Button>
      ) : null}
    </div>
  );
}
