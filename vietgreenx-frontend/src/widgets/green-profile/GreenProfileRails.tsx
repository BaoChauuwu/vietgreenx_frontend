"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, FileText, Leaf, Pencil, Sprout } from "lucide-react";

import { getGreenProfileCopy } from "@/features/green-profile";
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

interface GreenProfileContextRailProps extends LocaleProps {
  greenProfileId: string;
}

export function GreenProfileContextRail({
  greenProfileId,
  locale = getClientLocale(),
}: GreenProfileContextRailProps) {
  const hub = getGreenProfileCopy(locale).hub;
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={hub.rail.contextTitle} description={hub.rail.contextDescription}>
        <div className="flex flex-col gap-2.5 pt-1">
          {/* Action 1: Chỉnh sửa */}
          <Link
            href={ROUTES.greenProfileEdit(greenProfileId)}
            className="hover:shadow-xs group flex items-center justify-between rounded-xl border border-amber-200/70 bg-gradient-to-r from-amber-50/80 to-amber-50/30 p-2.5 transition-all hover:border-amber-400/80 hover:bg-amber-100/60"
          >
            <div className="flex items-center gap-3">
              <div className="shadow-xs flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                <Pencil className="size-4" />
              </div>
              <span className="text-sm font-semibold text-amber-950">{hub.actions.edit}</span>
            </div>
            <ChevronRight className="size-4 text-amber-500 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Action 2: Mùa vụ */}
          <Link
            href={ROUTES.greenProfileSeasons(greenProfileId)}
            className="hover:shadow-xs group flex items-center justify-between rounded-xl border border-emerald-200/70 bg-gradient-to-r from-emerald-50/80 to-emerald-50/30 p-2.5 transition-all hover:border-emerald-400/80 hover:bg-emerald-100/60"
          >
            <div className="flex items-center gap-3">
              <div className="shadow-xs flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Sprout className="size-4" />
              </div>
              <span className="text-sm font-semibold text-emerald-950">{hub.actions.seasons}</span>
            </div>
            <ChevronRight className="size-4 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Action 3: Nhật ký */}
          <Link
            href={ROUTES.greenProfileLog(greenProfileId)}
            className="hover:shadow-xs group flex items-center justify-between rounded-xl border border-teal-200/70 bg-gradient-to-r from-teal-50/80 to-teal-50/30 p-2.5 transition-all hover:border-teal-400/80 hover:bg-teal-100/60"
          >
            <div className="flex items-center gap-3">
              <div className="shadow-xs flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
                <FileText className="size-4" />
              </div>
              <span className="text-sm font-semibold text-teal-950">{hub.actions.log}</span>
            </div>
            <ChevronRight className="size-4 text-teal-600 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}

export function GreenProfileCreateRail({ locale = getClientLocale() }: LocaleProps) {
  const { form, nav } = getGreenProfileCopy(locale);
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={form.createTitle} description={form.createSubtitle}>
        <RailButtonStack>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.greenProfile}>
              <Leaf className="size-4" />
              {nav.breadcrumb}
            </Link>
          </Button>
        </RailButtonStack>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}
