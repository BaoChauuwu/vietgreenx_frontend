"use client";

import { CalendarPlus, Layers, Loader2, Pencil, Trash2 } from "lucide-react";

import type { CropSeason, CropSeasonList } from "@/entities/crop-season";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { Pagination } from "@/shared/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import { useDeleteCropSeason, useUpdateCropSeasonStatus } from "../api/crop-season.queries";
import { getCropSeasonCopy } from "../crop-season.constants";
import {
  getNextCropSeasonStatuses,
  type CropSeasonStatusTransition,
} from "../lib/crop-season-status";

function canEditSeason(status: CropSeason["status"]): boolean {
  return status === "planning" || status === "active";
}

function canDeleteSeason(status: CropSeason["status"]): boolean {
  return status === "planning" || status === "active";
}

interface CropSeasonListShellProps {
  locale?: AppLocale;
  seasons?: CropSeasonList;
  isLoading?: boolean;
  isError?: boolean;
  onAddClick?: () => void;
  onEditClick?: (season: CropSeason) => void;
  page?: number;
  onPageChange?: (page: number) => void;
  unstyled?: boolean;
}

const STATUS_CONFIG: Record<CropSeason["status"], { style: string; dotStyle: string }> = {
  active: {
    style: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300",
    dotStyle: "bg-emerald-500 animate-pulse",
  },
  planning: {
    style: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300",
    dotStyle: "bg-amber-500",
  },
  harvested: {
    style: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300",
    dotStyle: "bg-blue-500",
  },
  cancelled: {
    style: "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-300",
    dotStyle: "bg-slate-400",
  },
};

export function CropSeasonListShell({
  locale = getClientLocale(),
  seasons,
  isLoading = false,
  isError = false,
  onAddClick,
  onEditClick,
  page = 1,
  onPageChange,
  unstyled = false,
}: CropSeasonListShellProps) {
  const copy = getCropSeasonCopy(locale);
  const sectionCopy = copy.section;
  const listCopy = copy.list;
  const { mutate: deleteSeason, isPending: isDeleting } = useDeleteCropSeason();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateCropSeasonStatus();

  const handleDelete = (id: string) => {
    if (!window.confirm(listCopy.deleteConfirm)) return;
    deleteSeason(id);
  };

  const handleStatusChange = (id: string, nextStatus: CropSeasonStatusTransition) => {
    const message = listCopy.statusConfirm[nextStatus];
    if (!window.confirm(message)) return;
    updateStatus({ id, input: { status: nextStatus } });
  };

  const Container = unstyled ? "div" : ElevatedCard;
  const containerProps = unstyled
    ? { className: "overflow-hidden" }
    : {
        className:
          "overflow-hidden rounded-3xl border border-emerald-500/20 bg-card shadow-md shadow-emerald-500/5",
      };

  return (
    <Container {...containerProps}>
      <ModulePageHeader
        elevated={false}
        className="mb-0 border-b border-border/60 bg-muted/20 p-5 px-6"
        title={sectionCopy.title}
        description={sectionCopy.subtitle}
        icon={Layers}
        iconTileClassName="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
        actions={
          onAddClick ? (
            <Button
              type="button"
              onClick={onAddClick}
              className="shrink-0 gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 font-bold text-white shadow-sm shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95"
            >
              <CalendarPlus className="size-4" />
              {listCopy.addCta}
            </Button>
          ) : null
        }
      />

      {isLoading ? (
        <CardContent className="flex items-center justify-center gap-2 py-14 text-sm font-medium text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-emerald-600" aria-hidden />
          {listCopy.loading}
        </CardContent>
      ) : isError ? (
        <CardContent className="border-t border-dashed border-destructive/30 py-12 text-center text-sm font-semibold text-destructive">
          {copy.loadError}
        </CardContent>
      ) : seasons?.items.length ? (
        <CardContent className="overflow-x-auto p-0">
          <Table className="w-full min-w-[720px] border-collapse">
            <TableHeader className="border-b border-border/60 bg-muted/40">
              <TableRow className="whitespace-nowrap hover:bg-transparent">
                <TableHead className="h-11 w-[32%] min-w-[200px] pl-6 pr-4 text-left text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  {listCopy.columns.name}
                </TableHead>
                <TableHead className="h-11 w-[14%] px-4 text-center text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  {listCopy.columns.start}
                </TableHead>
                <TableHead className="h-11 w-[16%] px-4 text-center text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  {listCopy.columns.harvest}
                </TableHead>
                <TableHead className="h-11 w-[16%] px-4 text-center text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  {listCopy.columns.status}
                </TableHead>
                <TableHead className="h-11 w-[28%] px-4 text-center text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  {listCopy.columns.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/50">
              {seasons.items.map((season) => {
                const statusConf = STATUS_CONFIG[season.status] ?? STATUS_CONFIG.active;
                return (
                  <TableRow
                    key={season.id}
                    className="transition-colors hover:bg-emerald-500/5 dark:hover:bg-emerald-950/20"
                  >
                    {/* Season Name & Crop Type Column */}
                    <TableCell className="w-[28%] min-w-[200px] py-4 pl-6 pr-4 align-middle">
                      <p className="font-extrabold leading-snug tracking-tight text-foreground sm:text-base">
                        {season.seasonName}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                        {season.cropType}
                      </p>
                    </TableCell>

                    {/* Start Date */}
                    <TableCell className="w-[14%] whitespace-nowrap px-4 py-4 text-center align-middle text-xs font-extrabold text-muted-foreground">
                      {new Date(season.startDate).toLocaleDateString(toIntlLocale(locale))}
                    </TableCell>

                    {/* Harvest Date */}
                    <TableCell className="w-[15%] whitespace-nowrap px-4 py-4 text-center align-middle text-xs font-extrabold text-muted-foreground">
                      {new Date(season.expectedHarvestDate).toLocaleDateString(
                        toIntlLocale(locale),
                      )}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="w-[15%] whitespace-nowrap px-4 py-4 text-center align-middle">
                      <span
                        className={cn(
                          "shadow-2xs inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider",
                          statusConf.style,
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full", statusConf.dotStyle)} />
                        {copy.status[season.status]}
                      </span>
                    </TableCell>

                    {/* Action Buttons Column - Centered */}
                    <TableCell className="w-[28%] whitespace-nowrap px-4 py-4 text-center align-middle">
                      <div className="flex flex-nowrap items-center justify-center gap-1.5">
                        {getNextCropSeasonStatuses(season.status).map((nextStatus) => (
                          <Button
                            key={nextStatus}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={cn(
                              "shadow-2xs h-8 whitespace-nowrap rounded-xl px-3 text-xs font-extrabold transition-all",
                              nextStatus === "cancelled"
                                ? "border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white"
                                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:text-emerald-300",
                            )}
                            disabled={isUpdatingStatus}
                            onClick={() => handleStatusChange(season.id, nextStatus)}
                          >
                            {listCopy.statusActions[nextStatus]}
                          </Button>
                        ))}

                        {onEditClick && canEditSeason(season.status) ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            title={listCopy.edit}
                            className="h-8 gap-1 rounded-xl border-border/70 px-2.5 text-xs font-extrabold text-foreground transition-all hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
                            onClick={() => onEditClick(season)}
                          >
                            <Pencil className="size-3.5" />
                            <span className="hidden sm:inline">{listCopy.edit}</span>
                          </Button>
                        ) : null}

                        {canDeleteSeason(season.status) ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            title={listCopy.delete}
                            className="h-8 gap-1 rounded-xl px-2 text-xs font-extrabold text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={isDeleting}
                            onClick={() => handleDelete(season.id)}
                          >
                            <Trash2 className="size-3.5" />
                            <span className="hidden sm:inline">{listCopy.delete}</span>
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {onPageChange && (
            <div className="border-t border-border/60 bg-muted/10 px-5 py-3">
              <Pagination
                currentPage={page}
                totalPages={seasons.totalPage ?? 1}
                onPageChange={onPageChange}
                className="py-0"
              />
            </div>
          )}
        </CardContent>
      ) : (
        <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Layers className="size-7" />
          </span>
          <div className="max-w-sm space-y-1">
            <p className="text-base font-extrabold text-foreground">{listCopy.emptyTitle}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {listCopy.emptyDescription}
            </p>
          </div>
          {onAddClick ? (
            <Button
              type="button"
              onClick={onAddClick}
              className="gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 font-bold text-white shadow-sm hover:from-emerald-500 hover:to-teal-500"
            >
              <CalendarPlus className="size-4" />
              {listCopy.addCta}
            </Button>
          ) : null}
        </CardContent>
      )}
    </Container>
  );
}
