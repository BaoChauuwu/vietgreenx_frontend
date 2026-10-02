"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ProductionLog, ProductionLogList } from "@/entities/production-log";
import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import type { AddProductionLogNoteVariables } from "../model/production-log-note-input.schema";
import type { CreateProductionLogVariables } from "../model/production-log-input.schema";
import { getProductionLogCopy } from "../production-log.constants";
import { productionLogService } from "./production-log.service";

export const productionLogKeys = {
  all: ["production-logs"] as const,
  bySeasons: (seasonIds: string[]) =>
    [...productionLogKeys.all, "by-seasons", ...seasonIds.sort()] as const,
  detail: (logId: string) => [...productionLogKeys.all, "detail", logId] as const,
  qrSummary: (seasonId: string) => [...productionLogKeys.all, "qr-summary", seasonId] as const,
};

function patchProductionLogNoteInListCache(
  qc: ReturnType<typeof useQueryClient>,
  logId: string,
  noteBody: string,
) {
  qc.setQueriesData<ProductionLogList>(
    {
      queryKey: productionLogKeys.all,
      predicate: (query) => query.queryKey[1] === "by-seasons",
    },
    (current) => {
      if (!current) return current;
      return {
        ...current,
        items: current.items.map((item) =>
          item.id === logId ? { ...item, notes: noteBody } : item,
        ),
      };
    },
  );
}

function appendProductionLogToListCache(
  qc: ReturnType<typeof useQueryClient>,
  log: ProductionLog,
) {
  qc.setQueriesData<ProductionLogList>(
    {
      queryKey: productionLogKeys.all,
      predicate: (query) => query.queryKey[1] === "by-seasons",
    },
    (current) => {
      if (!current) return current;
      if (current.items.some((item) => item.id === log.id)) return current;
      const items = [log, ...current.items].sort(
        (a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime(),
      );
      return {
        ...current,
        items,
        total: items.length,
        limit: items.length,
        totalPage: items.length > 0 ? 1 : 0,
      };
    },
  );
}

export function useProductionLogsBySeasons(seasonIds: string[], enabled = true) {
  const { user } = useUser();

  return useQuery({
    queryKey: productionLogKeys.bySeasons(seasonIds),
    queryFn: () => productionLogService.listBySeasons(seasonIds),
    staleTime: 30_000,
    enabled: enabled && Boolean(user?.id) && seasonIds.length > 0,
  });
}

export function useProductionLog(logId: string | null, enabled = true) {
  const { user } = useUser();

  return useQuery({
    queryKey: productionLogKeys.detail(logId ?? ""),
    queryFn: () => productionLogService.byId(logId as string),
    staleTime: 30_000,
    enabled: enabled && Boolean(user?.id) && Boolean(logId),
  });
}

export function useQrMilestoneSummary(seasonId: string | null, enabled = true) {
  const { user } = useUser();

  return useQuery({
    queryKey: productionLogKeys.qrSummary(seasonId ?? ""),
    queryFn: () => productionLogService.qrSummaryBySeason(seasonId as string),
    staleTime: 60_000,
    enabled: enabled && Boolean(seasonId) && Boolean(user?.id),
  });
}

export function useCreateProductionLog() {
  const qc = useQueryClient();
  const toast = getProductionLogCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: ({ cropSeasonId, input }: CreateProductionLogVariables) =>
      productionLogService.create(cropSeasonId, input),
    onSuccess: (log, variables) => {
      appendProductionLogToListCache(qc, log);
      toastService.success(toast.createSuccess);
      void qc.invalidateQueries({
        queryKey: productionLogKeys.qrSummary(variables.cropSeasonId),
      });
    },
    onError: () => {
      toastService.error(toast.createError);
    },
  });
}

export function useAddProductionLogNote() {
  const qc = useQueryClient();
  const toast = getProductionLogCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: ({ logId, input }: AddProductionLogNoteVariables) =>
      productionLogService.addNote(logId, input),
    onSuccess: (_data, variables) => {
      const { logId, input } = variables;
      patchProductionLogNoteInListCache(qc, logId, input.noteBody);
      qc.setQueryData(productionLogKeys.detail(logId), (current) =>
        current ? { ...current, notes: input.noteBody } : current,
      );
      toastService.success(toast.noteSuccess);
      void qc.invalidateQueries({
        queryKey: productionLogKeys.all,
        predicate: (query) => query.queryKey[1] === "qr-summary",
      });
      void qc.invalidateQueries({ queryKey: productionLogKeys.detail(logId) });
    },
    onError: () => {
      toastService.error(toast.noteError);
    },
  });
}
