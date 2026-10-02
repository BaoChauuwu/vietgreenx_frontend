"use client";

import Link from "next/link";
import { Layers, QrCode } from "lucide-react";

import { getPostsCopy } from "@/features/posts";
import { getTraceCopy, QrQuotaSummary } from "@/features/traceability";
import type { QrQuota } from "@/entities/qr-quota";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { FarmTipsRail, WorkspaceRailCard } from "@/shared/ui/workspace-rail-card";

interface LocaleProps {
  locale?: AppLocale;
}

interface QrQuotaRailProps extends LocaleProps {
  quota?: QrQuota | null;
  quotaLoading?: boolean;
}

export function QrQuotaRail({
  locale = getClientLocale(),
  quota,
  quotaLoading = false,
}: QrQuotaRailProps) {
  const copy = getTraceCopy(locale).qr;
  const rail = copy.rail;
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={rail.title} description={copy.emptyDescription}>
        <QrQuotaSummary
          locale={locale}
          quota={quota}
          isLoading={quotaLoading}
          variant="inline"
          className="mb-3"
        />
        <div className="flex flex-col gap-2">
          <Button asChild className="mt-2 w-full justify-start gap-1.5">
            <Link href={ROUTES.batches}>
              <QrCode className="size-4" />
              {copy.createFromBatchesCta}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.batches}>
              <Layers className="size-4" />
              {rail.batches}
            </Link>
          </Button>
        </div>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}
