"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import type { ReportReason, ReportTargetType } from "@/entities/report";
import { REPORT_REASONS } from "@/entities/report";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

import { useReport } from "../api/report.queries";
import { getReportsCopy } from "../reports.constants";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: ReportTargetType;
  targetId: string;
  locale?: AppLocale;
}

export function ReportDialog({
  open,
  onOpenChange,
  targetType,
  targetId,
  locale = getClientLocale(),
}: ReportDialogProps) {
  const copy = getReportsCopy(locale);
  const reportMutation = useReport(locale);
  const [reason, setReason] = useState<ReportReason>("spam");
  const [details, setDetails] = useState("");

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setReason("spam");
      setDetails("");
    }
    onOpenChange(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;

    reportMutation.mutate(
      {
        targetType,
        targetId,
        reason,
        details: details.trim() || undefined,
      },
      {
        onSuccess: () => {
          handleOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.dialog.title}</DialogTitle>
          <DialogDescription>{copy.dialog.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{copy.dialog.reasonLabel}</Label>
            <div className="grid gap-2">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 text-sm transition-colors ${
                    reason === r
                      ? "border-primary bg-primary/5 font-medium text-foreground"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <span>{copy.reasons[r]}</span>
                  <input
                    type="radio"
                    name="reportReason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-primary"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-details">{copy.dialog.descriptionLabel}</Label>
            <Textarea
              id="report-details"
              rows={3}
              placeholder={copy.dialog.descriptionPlaceholder}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={1000}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={reportMutation.isPending}
            >
              {copy.dialog.cancel}
            </Button>
            <Button type="submit" disabled={reportMutation.isPending}>
              {reportMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {copy.dialog.submitting}
                </>
              ) : (
                copy.dialog.submit
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
