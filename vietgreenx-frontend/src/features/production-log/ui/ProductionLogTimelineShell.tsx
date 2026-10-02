"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  ClipboardPlus,
  CloudRain,
  Droplets,
  Eye,
  HeartHandshake,
  Loader2,
  ScrollText,
  ShoppingBag,
  Sparkles,
  Sprout,
  Tag,
  Filter,
  CheckCircle2,
  FileText,
} from "lucide-react";

import type { ActivityType, ProductionLogList } from "@/entities/production-log";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { Pagination } from "@/shared/ui/pagination";
import { Select } from "@/shared/ui/select";
import { toIntlLocale } from "@/shared/lib/format-relative-time";

import { getProductionLogCopy } from "../production-log.constants";

export interface ProductionLogSeasonFilterOption {
  id: string;
  label: string;
}

interface ProductionLogTimelineShellProps {
  locale?: AppLocale;
  logs?: ProductionLogList;
  seasonOptions?: ProductionLogSeasonFilterOption[];
  activityTypeLabels: Record<ActivityType, string>;
  isLoading?: boolean;
  isError?: boolean;
  onAddClick?: () => void;
  onLogClick?: (logId: string) => void;
  viewLabel?: string;
}

const ACTIVITY_THEME: Record<
  ActivityType,
  {
    icon: typeof Sprout;
    iconBg: string;
  }
> = {
  sowing: {
    icon: Sprout,
    iconBg:
      "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20",
  },
  caring: {
    icon: HeartHandshake,
    iconBg:
      "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/20",
  },
  fertilizing: {
    icon: Sparkles,
    iconBg:
      "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20",
  },
  spraying: {
    icon: Droplets,
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20",
  },
  irrigating: {
    icon: CloudRain,
    iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20",
  },
  harvesting: {
    icon: ShoppingBag,
    iconBg:
      "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20",
  },
  other: {
    icon: Tag,
    iconBg: "bg-gradient-to-br from-slate-600 to-zinc-700 text-white shadow-md shadow-slate-500/20",
  },
};

export function ProductionLogTimelineShell({
  locale = getClientLocale(),
  logs,
  seasonOptions = [],
  activityTypeLabels,
  isLoading = false,
  isError = false,
  onAddClick,
  onLogClick,
  viewLabel,
}: ProductionLogTimelineShellProps) {
  const copy = getProductionLogCopy(locale).timeline;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("all");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [logs, selectedFilter, selectedSeasonId]);

  const allItems = useMemo(() => logs?.items ?? [], [logs?.items]);

  const seasonMap = useMemo(() => {
    const map: Record<string, string> = {};
    (seasonOptions ?? []).forEach((opt) => {
      map[opt.id] = opt.label;
    });
    return map;
  }, [seasonOptions]);

  const seasonFilteredItems = useMemo(() => {
    if (selectedSeasonId === "all") return allItems;
    return allItems.filter((item) => item.cropSeasonId === selectedSeasonId);
  }, [allItems, selectedSeasonId]);

  const filteredItems = useMemo(() => {
    if (selectedFilter === "all") return seasonFilteredItems;
    return seasonFilteredItems.filter((item) => item.activityType === selectedFilter);
  }, [seasonFilteredItems, selectedFilter]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const filterOptions = useMemo(() => {
    const typesSet = new Set(seasonFilteredItems.map((item) => item.activityType));
    const list: { id: string; label: string; count: number }[] = [
      { id: "all", label: copy.allFilter, count: seasonFilteredItems.length },
    ];

    typesSet.forEach((type) => {
      const count = seasonFilteredItems.filter((i) => i.activityType === type).length;
      list.push({
        id: type,
        label: activityTypeLabels[type as ActivityType] ?? type,
        count,
      });
    });

    return list;
  }, [seasonFilteredItems, activityTypeLabels, copy.allFilter]);

  return (
    <div className="space-y-4">
      {/* Module Header */}
      <ModulePageHeader
        title={copy.title}
        description={copy.subtitle}
        icon={ScrollText}
        iconTileClassName="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
        actions={
          onAddClick ? (
            <Button
              type="button"
              onClick={onAddClick}
              className="shrink-0 gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 font-bold text-white shadow-md shadow-emerald-600/25 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95"
            >
              <ClipboardPlus className="size-4" />
              {copy.addCta}
            </Button>
          ) : null
        }
        meta={
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {copy.appendOnlyNote}
          </p>
        }
      />

      {/* Main Container - Single Unified Card */}
      {isLoading ? (
        <ElevatedCard className="rounded-3xl border border-border/70 shadow-sm">
          <CardContent className="flex items-center justify-center gap-2 py-16 text-sm font-medium text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" aria-hidden />
            {copy.loading}
          </CardContent>
        </ElevatedCard>
      ) : isError ? (
        <ElevatedCard className="rounded-3xl border border-dashed border-destructive/30 bg-destructive/5">
          <CardContent className="py-12 text-center text-sm font-semibold text-destructive">
            {copy.loadError}
          </CardContent>
        </ElevatedCard>
      ) : allItems.length > 0 ? (
        <ElevatedCard className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
          {/* 2-ROW FILTER HEADER BAR */}
          <div className="divide-y divide-border/50 border-b border-border/60 bg-muted/20">
            {/* ROW 1: Season Selector Dropdown */}
            {seasonOptions && seasonOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 px-6 py-2.5">
                <div className="flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                  <Sprout className="size-4 text-emerald-600" />
                  <span>{copy.seasonLabel}</span>
                </div>
                <div className="w-full max-w-md sm:w-auto">
                  <Select
                    value={selectedSeasonId}
                    onChange={(e) => setSelectedSeasonId(e.target.value)}
                    className="shadow-2xs h-9 cursor-pointer rounded-xl border-emerald-500/30 bg-background text-xs font-extrabold text-foreground transition-colors focus:border-emerald-500 focus:ring-emerald-500/20"
                  >
                    <option value="all">{copy.allSeasonsFilter}</option>
                    {seasonOptions.map((season) => (
                      <option key={season.id} value={season.id}>
                        {season.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}

            {/* ROW 2: Activity Category Filter Tabs */}
            <div className="no-scrollbar flex items-center gap-2.5 overflow-x-auto px-6 py-2.5">
              <div className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Filter className="size-3.5 text-emerald-600" />
                <span>{copy.filterLabel}</span>
              </div>
              {filterOptions.map((opt) => {
                const isActive = selectedFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedFilter(opt.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95",
                      isActive
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/20"
                        : "border border-border/50 bg-background/90 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span>{opt.label}</span>
                    <span
                      className={cn(
                        "size-4.5 flex items-center justify-center rounded-full text-[10px] font-black",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted-foreground/15 text-muted-foreground",
                      )}
                    >
                      {opt.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unified Timeline List Container */}
          {filteredItems.length > 0 ? (
            <div className="relative divide-y divide-border/50 py-1.5 before:absolute before:bottom-6 before:left-8 before:top-6 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500/40 before:to-emerald-400/20 sm:before:left-9">
              {paginatedItems.map((log) => {
                const theme = ACTIVITY_THEME[log.activityType] ?? ACTIVITY_THEME.other;
                const IconComponent = theme.icon;
                const seasonName = seasonMap[log.cropSeasonId];

                return (
                  <div
                    key={log.id}
                    onClick={() => onLogClick?.(log.id)}
                    className="group relative flex flex-col justify-between gap-4 px-6 py-5 transition-all duration-200 hover:bg-muted/30 sm:flex-row sm:items-center"
                  >
                    {/* Left Column: Icon Node, Activity Title & Season Badge */}
                    <div className="flex min-w-0 flex-1 items-center gap-4 pl-11 sm:pl-12">
                      {/* Node Icon */}
                      <div className="sm:left-4.5 absolute left-4 top-5 flex items-center justify-center">
                        <div
                          className={cn(
                            "size-9.5 flex items-center justify-center rounded-xl ring-4 ring-card transition-transform duration-200 group-hover:scale-110 sm:size-10",
                            theme.iconBg,
                          )}
                        >
                          <IconComponent className="size-4.5" />
                        </div>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h4 className="text-base font-extrabold tracking-tight text-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400 sm:text-lg">
                            {activityTypeLabels[log.activityType] ?? log.activityType}
                          </h4>

                          {seasonName ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                              <Sprout className="size-3 text-emerald-600" />
                              {seasonName}
                            </span>
                          ) : null}
                        </div>

                        {log.notes ? (
                          <div className="mt-1.5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/40 px-3 py-2 text-xs font-medium text-foreground/80 sm:text-sm">
                            <FileText className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <span className="line-clamp-2 break-words break-all leading-relaxed [overflow-wrap:anywhere]">
                              {log.notes}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Right Column: Date & Action Button INLINE Side-by-Side */}
                    <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border/40 pl-11 pt-3 sm:border-t-0 sm:pl-0 sm:pt-0">
                      <time
                        className="shadow-2xs flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs font-semibold text-muted-foreground"
                        dateTime={log.logDate}
                      >
                        <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        {new Date(log.logDate).toLocaleDateString(toIntlLocale(locale), {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </time>

                      {onLogClick && viewLabel ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8.5 gap-1.5 rounded-xl border-border/70 text-xs font-bold transition-all hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLogClick(log.id);
                          }}
                        >
                          <Eye className="size-3.5" />
                          {viewLabel}
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs font-semibold text-muted-foreground">
              {copy.noFilterResults}
            </div>
          )}

          {/* Pagination Footer inside Card */}
          {totalPages > 1 && (
            <div className="border-t border-border/60 bg-muted/20 px-6 py-3.5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                previousLabel={copy.previousPage}
                nextLabel={copy.nextPage}
                className="py-0"
              />
            </div>
          )}
        </ElevatedCard>
      ) : (
        <ElevatedCard className="shadow-xs rounded-3xl border border-border/60">
          <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ScrollText className="size-7" />
            </span>
            <div className="max-w-sm space-y-1">
              <p className="font-bold text-foreground">{copy.emptyTitle}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {copy.emptyDescription}
              </p>
            </div>
            {onAddClick ? (
              <Button
                type="button"
                onClick={onAddClick}
                className="gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-sm hover:from-emerald-500 hover:to-teal-500"
              >
                <ClipboardPlus className="size-4" />
                {copy.addCta}
              </Button>
            ) : null}
          </CardContent>
        </ElevatedCard>
      )}
    </div>
  );
}
