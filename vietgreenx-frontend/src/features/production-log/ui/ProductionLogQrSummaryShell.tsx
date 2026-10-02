"use client";

import { Loader2, QrCode } from "lucide-react";

import type { ActivityType } from "@/entities/production-log";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";

import { useQrMilestoneSummary } from "../api/production-log.queries";
import { getProductionLogCopy } from "../production-log.constants";

export interface ProductionLogSeasonOption {
  id: string;
  label: string;
}

interface ProductionLogQrSummaryShellProps {
  locale?: AppLocale;
  seasonOptions: ProductionLogSeasonOption[];
  selectedSeasonId: string | null;
  onSeasonChange: (seasonId: string) => void;
  activityTypeLabels: Record<ActivityType, string>;
}

const MILESTONE_ORDER = ["sowing", "caring", "fertilizing", "spraying", "harvesting"] as const;

const MILESTONE_THEME: Record<
  string,
  {
    stepNum: string;
    dotBg: string;
    cardBorder: string;
    tagBg: string;
  }
> = {
  sowing: {
    stepNum: "01",
    dotBg: "bg-emerald-500",
    cardBorder: "hover:border-emerald-500/50",
    tagBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  },
  caring: {
    stepNum: "02",
    dotBg: "bg-green-500",
    cardBorder: "hover:border-green-500/50",
    tagBg: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
  },
  fertilizing: {
    stepNum: "03",
    dotBg: "bg-amber-500",
    cardBorder: "hover:border-amber-500/50",
    tagBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  },
  spraying: {
    stepNum: "04",
    dotBg: "bg-blue-500",
    cardBorder: "hover:border-blue-500/50",
    tagBg: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  },
  harvesting: {
    stepNum: "05",
    dotBg: "bg-purple-500",
    cardBorder: "hover:border-purple-500/50",
    tagBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  },
};

export function ProductionLogQrSummaryShell({
  locale = getClientLocale(),
  seasonOptions,
  selectedSeasonId,
  onSeasonChange,
  activityTypeLabels,
}: ProductionLogQrSummaryShellProps) {
  const copy = getProductionLogCopy(locale).qrSummary;
  const {
    data: milestones,
    isLoading,
    isError,
  } = useQrMilestoneSummary(selectedSeasonId, Boolean(selectedSeasonId));

  const milestoneLabel = (milestone: string) => {
    if (milestone in activityTypeLabels) {
      return activityTypeLabels[milestone as ActivityType];
    }
    return milestone;
  };

  return (
    <ElevatedCard className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-card shadow-sm shadow-emerald-500/5">
      <CardContent className="space-y-5 p-6">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/20">
              <QrCode className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
                {copy.title}
              </h3>
              <p className="text-xs font-medium text-muted-foreground">{copy.subtitle}</p>
            </div>
          </div>

          {seasonOptions.length > 0 ? (
            <div className="flex items-center gap-2">
              <Label
                htmlFor="qr-summary-season"
                className="shrink-0 text-xs font-bold text-muted-foreground"
              >
                {copy.seasonLabel}:
              </Label>
              <Select
                id="qr-summary-season"
                value={selectedSeasonId ?? ""}
                onChange={(event) => onSeasonChange(event.target.value)}
                className="shadow-2xs h-9 rounded-xl border-border/80 bg-background text-xs font-bold text-foreground focus:border-emerald-500"
              >
                {seasonOptions.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.label}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
        </div>

        {/* Milestone Steps Process Container */}
        {!selectedSeasonId ? (
          <div className="py-8 text-center text-xs font-semibold text-muted-foreground">
            {copy.noSeason}
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-xs font-medium text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-emerald-600" />
            {copy.loading}
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-xs font-semibold text-destructive">
            {copy.loadError}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(milestones ?? [])
              .slice()
              .sort(
                (a, b) =>
                  MILESTONE_ORDER.indexOf(a.milestone as (typeof MILESTONE_ORDER)[number]) -
                  MILESTONE_ORDER.indexOf(b.milestone as (typeof MILESTONE_ORDER)[number]),
              )
              .map((item) => {
                const theme = MILESTONE_THEME[item.milestone] ?? {
                  stepNum: "••",
                  dotBg: "bg-slate-500",
                  cardBorder: "hover:border-slate-500/50",
                  tagBg: "bg-slate-500/10 text-slate-700 border-slate-500/20",
                };
                const hasLogs = item.logs.length > 0;

                return (
                  <div
                    key={item.milestone}
                    className={cn(
                      "shadow-2xs group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                      theme.cardBorder,
                    )}
                  >
                    {/* Top Step Header */}
                    <div>
                      <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className={cn("size-2.5 rounded-full", theme.dotBg)} />
                          <h4 className="text-sm font-extrabold tracking-tight text-foreground">
                            {milestoneLabel(item.milestone)}
                          </h4>
                        </div>
                        <span className="text-[11px] font-black text-muted-foreground/50">
                          {theme.stepNum}
                        </span>
                      </div>

                      {/* Scrollable Logs List Container (Fixed Height Prevents Overflow) */}
                      <div className="no-scrollbar mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                        {hasLogs ? (
                          item.logs.map((log) => (
                            <div
                              key={log.id}
                              className="rounded-xl border border-border/50 bg-muted/30 p-2.5 transition-colors group-hover:bg-muted/50"
                            >
                              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                {new Date(log.logDate).toLocaleDateString(toIntlLocale(locale), {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </div>
                              {log.notes ? (
                                <p className="mt-1 line-clamp-2 break-words break-all text-xs font-medium leading-snug text-muted-foreground [overflow-wrap:anywhere]">
                                  {log.notes}
                                </p>
                              ) : null}
                            </div>
                          ))
                        ) : (
                          <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 py-4 text-center text-[11px] font-medium text-muted-foreground/60">
                            {copy.emptyMilestone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step Footer Status Badge */}
                    <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-[10px] font-bold">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 uppercase tracking-wider",
                          theme.tagBg,
                        )}
                      >
                        {hasLogs ? copy.recordCount(item.logs.length) : copy.pendingStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </ElevatedCard>
  );
}
