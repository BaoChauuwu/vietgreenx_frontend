"use client";

import { useState } from "react";
import { FileDown, Grid, Loader2, Printer } from "lucide-react";

import type { PublicTraceToken } from "@/entities/public-trace-token";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { toastService } from "@/shared/lib/toast";

import { useExportQrPdf } from "../api/qr.queries";
import { getTraceCopy } from "../trace.constants";
import type { QrLinkLabels } from "./QRDashboardShell";

interface ExportQrPdfDialogProps {
  tokens?: PublicTraceToken[];
  linkLabels?: QrLinkLabels;
  locale?: AppLocale;
  trigger?: React.ReactNode;
}

export function ExportQrPdfDialog({
  tokens = [],
  linkLabels = { batches: {}, products: {} },
  locale = getClientLocale(),
  trigger,
}: ExportQrPdfDialogProps) {
  const copy = getTraceCopy(locale).qr;
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState<4 | 9 | 16>(9);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const exportPdfMutation = useExportQrPdf(locale);

  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({
    isPending: exportPdfMutation.isPending,
  });

  const handleOpen = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && tokens.length > 0 && selectedIds.length === 0) {
      setSelectedIds(tokens.slice(0, 16).map((t) => t.id));
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === Math.min(tokens.length, 16)) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tokens.slice(0, 16).map((t) => t.id));
    }
  };

  const toggleToken = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 16) {
        toastService.error(copy.maxLimitError);
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = guardFormEvent(async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      toastService.error(copy.noTokenSelected);
      release();
      return;
    }

    try {
      await exportPdfMutation.mutateAsync({
        tokenIds: selectedIds,
        layout,
      });
      setOpen(false);
    } finally {
      release();
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-1.5 font-semibold">
            <Printer className="size-4" />
            {copy.exportPdfBtn}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <FileDown className="size-5 text-primary" />
            {copy.exportPdfTitle}
          </DialogTitle>
        </DialogHeader>

        <GuardedForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || exportPdfMutation.isPending}
          className="space-y-4 pt-2"
        >
          <p className="text-xs text-muted-foreground">{copy.exportPdfSubtitle}</p>

          {/* Layout Selector */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-foreground">
              {copy.layoutLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([4, 9, 16] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLayout(l)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2.5 text-center transition-all ${
                    layout === l
                      ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <Grid className="size-5" />
                  <span className="text-xs font-bold">
                    {l} {copy.labelSuffix}
                  </span>
                  <span className="text-[10px] opacity-80">
                    {l === 4 ? copy.sizeLarge : l === 9 ? copy.sizeMedium : copy.sizeSmall}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* QR Selection List */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                {copy.selectTokensLabel}
              </label>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-xs font-medium text-primary hover:underline"
              >
                {selectedIds.length === Math.min(tokens.length, 16)
                  ? copy.deselectAll
                  : copy.selectAll}
              </button>
            </div>

            <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-md border border-border bg-background p-2">
              {tokens.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">{copy.emptyTitle}</p>
              ) : (
                tokens.map((t) => {
                  const isChecked = selectedIds.includes(t.id);
                  const label =
                    t.batchId && linkLabels.batches[t.batchId]
                      ? `${copy.linkedBatch}: ${linkLabels.batches[t.batchId]}`
                      : t.productId && linkLabels.products[t.productId]
                        ? `${copy.linkedProduct}: ${linkLabels.products[t.productId]}`
                        : `${copy.qrCodePrefix}${t.token.slice(0, 8)}`;

                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleToken(t.id)}
                      className={`flex cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-xs transition-colors ${
                        isChecked
                          ? "bg-primary/10 font-medium text-foreground"
                          : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleToken(t.id)}
                          className="size-4 cursor-pointer rounded border-input accent-primary"
                        />
                        <span>{label}</span>
                      </div>
                      <span className="font-mono text-[11px] opacity-75">
                        {t.token.slice(0, 8)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              {copy.cancel}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 font-semibold"
              disabled={
                isSubmitting ||
                exportPdfMutation.isPending ||
                selectedIds.length === 0 ||
                tokens.length === 0
              }
            >
              {isSubmitting || exportPdfMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FileDown className="size-4" />
              )}
              {isSubmitting || exportPdfMutation.isPending
                ? copy.exporting
                : `${copy.submitExport} (${selectedIds.length})`}
            </Button>
          </div>
        </GuardedForm>
      </DialogContent>
    </Dialog>
  );
}
