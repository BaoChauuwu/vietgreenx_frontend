"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import type { CropSeasonStatus } from "@/entities/crop-season";
import type { ActivityType } from "@/entities/production-log";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Label } from "@/shared/ui/label";
import { SubmitButton } from "@/shared/ui/submit-button";
import { Textarea } from "@/shared/ui/textarea";

import { useAddProductionLogNote, useProductionLog } from "../api/production-log.queries";
import { getProductionLogCopy } from "../production-log.constants";
import {
  createAddProductionLogNoteInputSchema,
  type AddProductionLogNoteInput,
} from "../model/production-log-note-input.schema";

interface ProductionLogDetailDialogProps {
  logId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityTypeLabels: Record<ActivityType, string>;
  seasonStatusById: Record<string, CropSeasonStatus>;
  locale?: AppLocale;
}

function canAddNoteToSeason(status: CropSeasonStatus | undefined): boolean {
  return status === "planning" || status === "active";
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export function ProductionLogDetailDialog({
  logId,
  open,
  onOpenChange,
  activityTypeLabels,
  seasonStatusById,
  locale = getClientLocale(),
}: ProductionLogDetailDialogProps) {
  const copy = getProductionLogCopy(locale);
  const detailCopy = copy.detail;
  const schema = useMemo(() => createAddProductionLogNoteInputSchema(locale), [locale]);
  const { data: log, isLoading, isError } = useProductionLog(logId, open);
  const { mutate, isPending } = useAddProductionLogNote();

  const form = useForm<AddProductionLogNoteInput>({
    resolver: zodResolver(schema),
    defaultValues: { noteBody: "" },
  });
  const isDirty = form.formState.isDirty;
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({
    isPending,
  });

  const seasonStatus = log ? seasonStatusById[log.cropSeasonId] : undefined;
  const canAddNote = canAddNoteToSeason(seasonStatus);

  useEffect(() => {
    if (!open) {
      form.reset({ noteBody: "" });
    }
  }, [open, form]);

  useEffect(() => {
    form.reset({ noteBody: "" });
  }, [logId, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit((data) => {
      if (!logId) return;
      mutate(
        { logId, input: data },
        {
          onSuccess: () => {
            form.reset({ noteBody: "" });
            release();
          },
          onError: () => {
            release();
          },
        },
      );
    }),
  );

  const activeFields = useMemo(() => {
    if (!log) return [];
    return [
      { label: detailCopy.fields.activityType, value: activityTypeLabels[log.activityType] },
      {
        label: detailCopy.fields.logDate,
        value: log.logDate ? new Date(log.logDate).toLocaleDateString(toIntlLocale(locale)) : null,
      },
      { label: detailCopy.fields.inputMaterial, value: log.inputMaterial },
      {
        label: detailCopy.fields.dosage,
        value: log.dosage ? [log.dosage, log.dosageUnit].filter(Boolean).join(" ") : null,
      },
      { label: detailCopy.fields.weather, value: log.weather },
      { label: detailCopy.fields.pestStatus, value: log.pestStatus },
      {
        label: detailCopy.fields.estimatedYield,
        value: log.estimatedYield != null ? String(log.estimatedYield) : null,
      },
    ].filter((f) => Boolean(f.value));
  }, [log, activityTypeLabels, detailCopy, locale]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[560px] max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/20 p-6 pb-4">
          <DialogTitle>{detailCopy.title}</DialogTitle>
          <DialogDescription>{detailCopy.subtitle}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {detailCopy.loading}
          </div>
        ) : isError || !log ? (
          <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
            {detailCopy.loadError}
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
            {/* Basic fields in structured card */}
            {activeFields.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 rounded-xl border border-border/60 bg-muted/30 p-4">
                {activeFields.map((field, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">{field.label}</p>
                    <p className="text-sm font-semibold text-foreground">{field.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Original notes */}
            {log.notes && (
              <div className="space-y-1 rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  {detailCopy.fields.notes}
                </p>
                <p className="whitespace-pre-line text-sm text-foreground">{log.notes}</p>
              </div>
            )}

            {/* Media images */}
            {(() => {
              const displayMedia =
                log.media && log.media.length > 0
                  ? log.media
                  : log.medias && log.medias.length > 0
                    ? log.medias
                    : [];
              const hasMediaIds = log.mediaIds && log.mediaIds.length > 0;
              if (displayMedia.length === 0 && !hasMediaIds) return null;

              return (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {detailCopy.mediaTitle}
                  </p>
                  {displayMedia.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {displayMedia.map((item) => {
                        const url = resolveMediaUrl(item.cdnUrl);
                        return (
                          <a
                            key={item.id}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative size-20 overflow-hidden rounded-lg border border-border bg-muted transition-all hover:ring-2 hover:ring-primary"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={detailCopy.mediaTitle}
                              className="size-full object-cover transition-transform group-hover:scale-105"
                            />
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
                      <ImageIcon className="size-4 shrink-0" />
                      {detailCopy.mediaCount(log.mediaIds.length)}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Additional notes history */}
            {log.additionalNotes && log.additionalNotes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {detailCopy.additionalNotesTitle}
                </p>
                <div className="space-y-2">
                  {log.additionalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-lg border border-border bg-muted/30 px-3 py-2.5"
                    >
                      <p className="text-sm text-foreground">{note.noteBody}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleString(toIntlLocale(locale))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add note form */}
            {canAddNote ? (
              <GuardedForm
                noValidate
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                className="space-y-3 pt-2"
              >
                <div className="space-y-2">
                  <Label htmlFor="production-log-note" className="text-xs font-medium">
                    {detailCopy.addNote}
                  </Label>
                  <Textarea
                    id="production-log-note"
                    rows={2}
                    placeholder={detailCopy.notePlaceholder}
                    disabled={isSubmitting}
                    {...form.register("noteBody")}
                  />
                  {form.formState.errors.noteBody && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.noteBody.message}
                    </p>
                  )}
                </div>
                <SubmitButton type="submit" size="sm" disabled={isSubmitting || !isDirty}>
                  {detailCopy.addNote}
                </SubmitButton>
              </GuardedForm>
            ) : (
              <p className="text-xs text-muted-foreground">{detailCopy.noteDisabled}</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
