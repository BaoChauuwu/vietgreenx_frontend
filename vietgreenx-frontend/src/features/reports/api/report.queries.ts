"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toastService } from "@/shared/lib/toast";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import type { ReportInput } from "@/entities/report";

import { getReportsCopy } from "../reports.constants";
import { reportService } from "./report.service";

export const reportKeys = {
  all: ["reports"] as const,
  myReports: (page: number, limit: number) => [...reportKeys.all, "my", page, limit] as const,
};

export function useMyReports(page = 1, limit = 10) {
  const { user } = useUser();

  return useQuery({
    queryKey: reportKeys.myReports(page, limit),
    queryFn: () => reportService.getMyReports(page, limit),
    enabled: Boolean(user?.id),
    staleTime: 30_000,
  });
}

export function useReport(locale: AppLocale = getClientLocale()) {
  const qc = useQueryClient();
  const copy = getReportsCopy(locale);

  return useSingleFlightMutation({
    mutationFn: (input: ReportInput) => reportService.create(input),
    onSuccess: () => {
      toastService.success(copy.toast.reported);
      void qc.invalidateQueries({ queryKey: reportKeys.all });
    },
    onError: () => {
      toastService.error(copy.toast.reportError);
    },
  });
}
