"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Layers, Package, Plus, QrCode } from "lucide-react";

import { getBatchesCopy } from "@/features/batches";
import { getPostsCopy } from "@/features/posts";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { FarmTipsRail, WorkspaceRailCard } from "@/shared/ui/workspace-rail-card";

interface LocaleProps {
  locale?: AppLocale;
}

function RailButtonStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function BatchesWorkflowRail({ locale = getClientLocale() }: LocaleProps) {
  const { hub, detail } = getBatchesCopy(locale);
  const rail = hub.rail;
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={rail.title} description={hub.emptyDescription}>
        <RailButtonStack>
          <Button asChild className="w-full justify-start gap-1.5">
            <Link href={ROUTES.batchCreate}>
              <Plus className="size-4" />
              {hub.createCta}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.products}>
              <Package className="size-4" />
              {rail.products}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.qr}>
              <QrCode className="size-4" />
              {detail.generateQr}
            </Link>
          </Button>
        </RailButtonStack>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}

interface BatchDetailQrRailProps extends LocaleProps {
  description?: string;
  qrActions?: ReactNode;
}

export function BatchDetailQrRail({
  locale = getClientLocale(),
  description,
  qrActions,
}: BatchDetailQrRailProps) {
  const detail = getBatchesCopy(locale).detail;
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={detail.qrSection} description={description ?? detail.qrEmpty}>
        {qrActions}
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}
