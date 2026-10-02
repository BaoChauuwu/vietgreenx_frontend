"use client";

import Link from "next/link";
import { Copy, ExternalLink, Eye } from "lucide-react";

import type { PublicTraceToken } from "@/entities/public-trace-token";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { toastService } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";

import { getTraceCopy } from "../trace.constants";
import { TraceQrDialog } from "./TraceQrDialog";

export function buildTraceUrl(token: string): string {
  if (typeof window === "undefined") return ROUTES.trace(token);
  return `${window.location.origin}${ROUTES.trace(token)}`;
}

interface TraceTokenActionsProps {
  token: PublicTraceToken;
  locale?: AppLocale;
  size?: "sm" | "default";
  className?: string;
}

export function TraceTokenActions({
  token,
  locale = getClientLocale(),
  size = "sm",
  className,
}: TraceTokenActionsProps) {
  const copy = getTraceCopy(locale).qr;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildTraceUrl(token.token));
      toastService.success(copy.copyLinkSuccess);
    } catch {
      toastService.error(copy.copyLinkError);
    }
  };

  return (
    <div className={className}>
      <div className="-mb-1 flex flex-nowrap gap-2 overflow-x-auto pb-1">
        <Button
          asChild
          variant="secondary"
          size={size}
          className="gap-1.5 border-none bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Link href={`/qr/preview?token=${token.token}`}>
            <Eye className="size-3.5" />
            Xem trước
          </Link>
        </Button>
        <Button asChild variant="default" size={size} className="gap-1.5">
          <Link href={ROUTES.trace(token.token)} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" />
            {copy.viewTrace}
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size={size}
          className="gap-1.5"
          onClick={handleCopyLink}
        >
          <Copy className="size-3.5" />
          {copy.copyLink}
        </Button>
        <TraceQrDialog token={token.token} locale={locale} />
      </div>
    </div>
  );
}
