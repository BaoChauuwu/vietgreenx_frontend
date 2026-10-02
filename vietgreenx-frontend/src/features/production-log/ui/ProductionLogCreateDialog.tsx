"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { uploadMedia } from "@/entities/media";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { toastService } from "@/shared/lib/toast";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { SubmitButton } from "@/shared/ui/submit-button";
import { Textarea } from "@/shared/ui/textarea";

import { useCreateProductionLog } from "../api/production-log.queries";
import { ACTIVITY_TYPES, getProductionLogCopy } from "../production-log.constants";
import {
  createProductionLogFormSchema,
  productionLogFormToCreateInput,
  type ProductionLogFormInput,
} from "../model/production-log-input.schema";

const MEDIA_MAX_BYTES = 10 * 1024 * 1024;
const MEDIA_ACCEPT = "image/jpeg,image/png,image/webp";
const MEDIA_MAX_COUNT = 5;

interface UploadedMediaItem {
  mediaId: string;
  cdnUrl: string;
  previewUrl: string;
}

function defaultLogDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface ProductionLogSeasonOption {
  id: string;
  label: string;
}

interface ProductionLogCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
  seasonOptions?: ProductionLogSeasonOption[];
  seasonsLoading?: boolean;
}

export function ProductionLogCreateDialog({
  open,
  onOpenChange,
  locale = getClientLocale(),
  seasonOptions = [],
  seasonsLoading = false,
}: ProductionLogCreateDialogProps) {
  const copy = getProductionLogCopy(locale);
  const formCopy = copy.form;
  const schema = useMemo(() => createProductionLogFormSchema(locale), [locale]);
  const { mutate, isPending } = useCreateProductionLog();
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });

  const [mediaItems, setMediaItems] = useState<UploadedMediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadFile, isPending: isUploading } = useSingleFlightMutation<
    { mediaId: string; cdnUrl: string; mimeType: string },
    Error,
    File
  >({
    mutationFn: (file: File) => uploadMedia(file, "production_log_image"),
  });

  const form = useForm<ProductionLogFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      cropSeasonId: "",
      activityType: "caring",
      logDate: defaultLogDate(),
      notes: "",
      inputMaterial: "",
      dosage: "",
      dosageUnit: "",
      weather: "",
      pestStatus: "",
      estimatedYield: "",
      mediaIds: [],
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        cropSeasonId: seasonOptions[0]?.id ?? "",
        activityType: "caring",
        logDate: defaultLogDate(),
        notes: "",
        inputMaterial: "",
        dosage: "",
        dosageUnit: "",
        weather: "",
        pestStatus: "",
        estimatedYield: "",
        mediaIds: [],
      });
      setMediaItems([]);
    }
  }, [open, seasonOptions, form]);

  useEffect(() => {
    const firstSeasonId = seasonOptions[0]?.id;
    if (firstSeasonId && !form.getValues("cropSeasonId")) {
      form.setValue("cropSeasonId", firstSeasonId);
    }
  }, [seasonOptions, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (mediaItems.length >= MEDIA_MAX_COUNT) return;

    if (file.size > MEDIA_MAX_BYTES) {
      toastService.error(formCopy.mediaSizeError);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toastService.error(formCopy.mediaTypeError);
      return;
    }

    try {
      const uploaded = await uploadFile(file);
      if (!uploaded) return;
      const next = [
        ...mediaItems,
        {
          mediaId: uploaded.mediaId,
          cdnUrl: uploaded.cdnUrl,
          previewUrl: resolveMediaUrl(uploaded.cdnUrl) ?? uploaded.cdnUrl,
        },
      ];
      setMediaItems(next);
      form.setValue(
        "mediaIds",
        next.map((m) => m.mediaId),
      );
    } catch {
      toastService.error(formCopy.mediaUploadError);
    }
  };

  const removeMedia = (mediaId: string) => {
    const next = mediaItems.filter((m) => m.mediaId !== mediaId);
    setMediaItems(next);
    form.setValue(
      "mediaIds",
      next.map((m) => m.mediaId),
    );
  };

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      (data) => {
        mutate(
          {
            cropSeasonId: data.cropSeasonId,
            input: productionLogFormToCreateInput(data),
          },
          {
            onSuccess: () => onOpenChange(false),
            onSettled: () => release(),
          },
        );
      },
      () => release(),
    ),
  );

  const hasSeasons = seasonOptions.length > 0;
  const isDisabled = isSubmitting || isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[640px] max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/20 p-6 pb-4">
          <DialogTitle>{formCopy.title}</DialogTitle>
          <DialogDescription>{formCopy.subtitle}</DialogDescription>
        </DialogHeader>

        {!hasSeasons && !seasonsLoading ? (
          <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
            {formCopy.noSeasons}
          </div>
        ) : (
          <GuardedForm
            noValidate
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
              <div className="space-y-1.5">
                <Label htmlFor="crop-season-id">{formCopy.fields.cropSeason}</Label>
                <Select
                  id="crop-season-id"
                  className="text-foreground"
                  disabled={seasonsLoading || isDisabled}
                  {...form.register("cropSeasonId")}
                >
                  <option value="">{seasonsLoading ? "…" : formCopy.cropSeasonNone}</option>
                  {seasonOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {form.formState.errors.cropSeasonId && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.cropSeasonId.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="activity-type">{formCopy.fields.activityType}</Label>
                  <Select
                    id="activity-type"
                    className="text-foreground"
                    disabled={isDisabled}
                    {...form.register("activityType")}
                  >
                    {ACTIVITY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {copy.activityTypes[type]}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="log-date">{formCopy.fields.logDate}</Label>
                  <Input
                    id="log-date"
                    type="date"
                    disabled={isDisabled}
                    {...form.register("logDate")}
                  />
                  {form.formState.errors.logDate && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.logDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="input-material">{formCopy.fields.inputMaterial}</Label>
                  <Input
                    id="input-material"
                    placeholder="Phân NPK, thuốc trừ sâu..."
                    disabled={isDisabled}
                    {...form.register("inputMaterial")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{formCopy.fields.dosage}</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="10"
                      className="w-20 shrink-0"
                      disabled={isDisabled}
                      {...form.register("dosage")}
                    />
                    <Input
                      placeholder="kg/ha"
                      disabled={isDisabled}
                      {...form.register("dosageUnit")}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="weather">{formCopy.fields.weather}</Label>
                  <Input
                    id="weather"
                    placeholder="Nắng, mưa nhẹ..."
                    disabled={isDisabled}
                    {...form.register("weather")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="estimated-yield">{formCopy.fields.estimatedYield}</Label>
                  <Input
                    id="estimated-yield"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.0"
                    disabled={isDisabled}
                    {...form.register("estimatedYield")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pest-status">{formCopy.fields.pestStatus}</Label>
                <Input
                  id="pest-status"
                  placeholder="Không phát hiện, rầy nâu nhẹ..."
                  disabled={isDisabled}
                  {...form.register("pestStatus")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="log-notes">{formCopy.fields.notes}</Label>
                <Textarea
                  id="log-notes"
                  rows={3}
                  disabled={isDisabled}
                  {...form.register("notes")}
                />
              </div>

              {/* Media upload */}
              <div className="space-y-2">
                <Label>{formCopy.fields.media}</Label>
                {mediaItems.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {mediaItems.map((item) => (
                      <div
                        key={item.mediaId}
                        className="group relative size-20 overflow-hidden rounded-lg border border-border"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.previewUrl} alt="" className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeMedia(item.mediaId)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 className="size-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {mediaItems.length < MEDIA_MAX_COUNT && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isDisabled}
                    className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ImagePlus className="size-4" />
                    )}
                    {isUploading
                      ? "Đang tải lên..."
                      : `Thêm ảnh (${mediaItems.length}/${MEDIA_MAX_COUNT})`}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={MEDIA_ACCEPT}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="flex shrink-0 justify-end border-t border-border/50 bg-muted/10 p-4">
              <SubmitButton
                isSubmitting={isSubmitting}
                disabled={!hasSeasons || isDisabled}
                className="w-full sm:w-auto"
              >
                {formCopy.submit}
              </SubmitButton>
            </div>
          </GuardedForm>
        )}
      </DialogContent>
    </Dialog>
  );
}
