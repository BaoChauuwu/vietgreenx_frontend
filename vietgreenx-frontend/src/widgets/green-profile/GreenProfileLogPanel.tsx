"use client";

import { useMemo, useState } from "react";

import type { CropSeasonStatus } from "@/entities/crop-season";
import type { GreenProfile } from "@/entities/green-profile";
import { ProductionLogTimelineShell } from "@/features/production-log";
import { useCropSeasons, useCropSeason } from "@/features/crop-season";
import {
  ProductionLogCreateDialog,
  ProductionLogDetailDialog,
  ProductionLogQrSummaryShell,
  getProductionLogCopy,
  useProductionLogsBySeasons,
  useProductionLog,
} from "@/features/production-log";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

interface GreenProfileLogPanelProps {
  profile: GreenProfile;
  locale?: AppLocale;
}

export function GreenProfileLogPanel({
  profile,
  locale = getClientLocale(),
}: GreenProfileLogPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailLogId, setDetailLogId] = useState<string | null>(null);
  const {
    data: seasons,
    isLoading: seasonsLoading,
    isError: seasonsError,
  } = useCropSeasons(1, 50, profile.id);

  const traceSeasonOptions = useMemo(
    () =>
      (seasons?.items ?? [])
        .filter((season) => season.status !== "cancelled")
        .map((season) => ({
          id: season.id,
          label: `${season.seasonName} · ${season.cropType}`,
        })),
    [seasons?.items],
  );

  const loggableSeasonOptions = useMemo(
    () =>
      (seasons?.items ?? [])
        .filter((season) => season.status === "planning" || season.status === "active")
        .map((season) => ({
          id: season.id,
          label: `${season.seasonName} · ${season.cropType}`,
        })),
    [seasons?.items],
  );

  const seasonStatusById = useMemo(
    () =>
      Object.fromEntries(
        (seasons?.items ?? []).map((season) => [season.id, season.status]),
      ) as Record<string, CropSeasonStatus>,
    [seasons?.items],
  );

  const { data: detailLog } = useProductionLog(detailLogId, Boolean(detailLogId));
  const { data: detailSeason } = useCropSeason(
    detailLog?.cropSeasonId ?? null,
    Boolean(detailLog?.cropSeasonId),
  );

  const resolvedSeasonStatusById = useMemo(() => {
    if (!detailLog?.cropSeasonId || !detailSeason) return seasonStatusById;
    return { ...seasonStatusById, [detailLog.cropSeasonId]: detailSeason.status };
  }, [detailLog?.cropSeasonId, detailSeason, seasonStatusById]);

  const [qrSeasonId, setQrSeasonId] = useState<string | null>(null);
  const resolvedQrSeasonId = qrSeasonId ?? traceSeasonOptions[0]?.id ?? null;

  const seasonIds = useMemo(
    () => traceSeasonOptions.map((season) => season.id),
    [traceSeasonOptions],
  );

  const {
    data: logs,
    isLoading: logsLoading,
    isError: logsError,
  } = useProductionLogsBySeasons(seasonIds, seasonIds.length > 0);

  const isLoading = seasonsLoading || (seasonIds.length > 0 && logsLoading);
  const isError = seasonsError || logsError;

  const productionLogCopy = getProductionLogCopy(locale);
  const activityTypeLabels = productionLogCopy.activityTypes;

  return (
    <div className="space-y-5 p-5 md:p-6">
      <ProductionLogCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        locale={locale}
        seasonOptions={loggableSeasonOptions}
        seasonsLoading={seasonsLoading}
      />
      <ProductionLogDetailDialog
        logId={detailLogId}
        open={Boolean(detailLogId)}
        onOpenChange={(open) => {
          if (!open) setDetailLogId(null);
        }}
        activityTypeLabels={activityTypeLabels}
        seasonStatusById={resolvedSeasonStatusById}
        locale={locale}
      />
      <ProductionLogQrSummaryShell
        locale={locale}
        seasonOptions={traceSeasonOptions}
        selectedSeasonId={resolvedQrSeasonId}
        onSeasonChange={setQrSeasonId}
        activityTypeLabels={activityTypeLabels}
      />
      <ProductionLogTimelineShell
        locale={locale}
        logs={logs}
        seasonOptions={traceSeasonOptions}
        activityTypeLabels={activityTypeLabels}
        isLoading={isLoading}
        isError={isError}
        onAddClick={loggableSeasonOptions.length ? () => setDialogOpen(true) : undefined}
        onLogClick={setDetailLogId}
        viewLabel={productionLogCopy.detail.view}
      />
    </div>
  );
}
