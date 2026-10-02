"use client";

import { Sprout, Leaf, Activity, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent, CardHeader } from "@/shared/ui/card";
import type { TraceResponse } from "@/entities/trace";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getTraceCopy } from "@/features/traceability";
import { toIntlLocale } from "@/shared/lib/format-relative-time";

const ICON_MAP: Record<string, React.ReactNode> = {
  "gieo trồng": <Sprout className="size-5" />,
  "chăm sóc": <Leaf className="size-5" />,
  "tuổi tiêu": <Activity className="size-5" />,
  "kiểm tra": <ClipboardCheck className="size-5" />,
  "thu hoạch": <CheckCircle2 className="size-5" />,
};

interface Props {
  milestones: TraceResponse["milestones"];
  locale?: AppLocale;
}

export function TraceTimelinePanel({ milestones, locale = getClientLocale() }: Props) {
  const copy = getTraceCopy(locale).preview.timeline;
  if (!milestones || milestones.length === 0) return null;
  const displayMilestones = milestones;

  return (
    <ElevatedCard className="mt-6 overflow-hidden rounded-2xl border-none bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between px-5 pb-3 pt-5">
        <h3 className="text-base font-bold text-slate-800">{copy.title}</h3>
        <button className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">
          {copy.viewDetail}
        </button>
      </CardHeader>
      <CardContent className="overflow-x-auto px-5 pb-8 pt-4">
        <div className="relative flex min-w-[600px] items-center justify-between">
          {/* Horizontal Line */}
          <div className="absolute left-10 right-10 top-6 z-0 h-1 rounded-full bg-emerald-500"></div>

          {displayMilestones.map((m, index) => {
            const milestoneText = m?.milestone || copy.fallbackMilestone;
            const label = milestoneText.toLowerCase();
            const icon = ICON_MAP[label] || <CheckCircle2 className="size-5" />;
            const dateStr =
              m.logs && m.logs.length > 0 && m.logs[0]?.logDate
                ? new Date(m.logs[0].logDate).toLocaleDateString(toIntlLocale(locale))
                : "--/--/----";

            return (
              <div key={index} className="relative z-10 flex w-24 flex-col items-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-4 ring-white">
                  {icon}
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-[11px] font-semibold text-slate-500">{dateStr}</p>
                  <p className="text-[13px] font-bold capitalize text-slate-800">{milestoneText}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
