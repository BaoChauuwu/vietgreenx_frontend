"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import type { CropSeason } from "@/entities/crop-season";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
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

import { useUpdateCropSeason } from "../api/crop-season.queries";
import { getCropSeasonCopy } from "../crop-season.constants";
import {
  cropSeasonFormToUpdateInput,
  cropSeasonToEditFormValues,
  createUpdateCropSeasonFormSchema,
  type UpdateCropSeasonFormInput,
} from "../model/crop-season-input.schema";
import type { CropSeasonProductOption } from "./CropSeasonCreateDialog";

interface CropSeasonEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: CropSeason | null;
  locale?: AppLocale;
  productOptions?: CropSeasonProductOption[];
  productsLoading?: boolean;
}

export function CropSeasonEditDialog({
  open,
  onOpenChange,
  season,
  locale = getClientLocale(),
  productOptions = [],
  productsLoading = false,
}: CropSeasonEditDialogProps) {
  const copy = getCropSeasonCopy(locale);
  const formCopy = copy.form;
  const editCopy = copy.editForm;
  const schema = useMemo(() => createUpdateCropSeasonFormSchema(locale), [locale]);
  const { mutate, isPending } = useUpdateCropSeason();
  const form = useForm<UpdateCropSeasonFormInput>({
    resolver: zodResolver(schema),
    defaultValues: season
      ? cropSeasonToEditFormValues(season)
      : {
          seasonName: "",
          cropType: "",
          areaHa: 0,
          startDate: "",
          expectedHarvestDate: "",
          productId: "",
          notes: "",
        },
  });
  const isDirty = form.formState.isDirty;
  const { guardFormEvent, release, isSubmitting, isDisabled } = useGuardedSubmit({
    isPending,
    enabled: isDirty,
  });

  useEffect(() => {
    if (!open || !season) return;
    form.reset(cropSeasonToEditFormValues(season));
  }, [open, season, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      (data) => {
        if (!season) {
          release();
          return;
        }

        mutate(
          {
            id: season.id,
            input: cropSeasonFormToUpdateInput(data),
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editCopy.title}</DialogTitle>
          <DialogDescription>{editCopy.subtitle}</DialogDescription>
        </DialogHeader>

        <GuardedForm noValidate onSubmit={onSubmit} isSubmitting={isSubmitting} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-season-name">{formCopy.fields.seasonName}</Label>
            <Input id="edit-season-name" {...form.register("seasonName")} />
            {form.formState.errors.seasonName ? (
              <p className="text-sm text-destructive">{form.formState.errors.seasonName.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-crop-type">{formCopy.fields.cropType}</Label>
            <Input id="edit-crop-type" {...form.register("cropType")} />
            {form.formState.errors.cropType ? (
              <p className="text-sm text-destructive">{form.formState.errors.cropType.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-area-ha">{formCopy.fields.areaHa}</Label>
            <Input id="edit-area-ha" type="number" step="any" min="0" {...form.register("areaHa")} />
            {form.formState.errors.areaHa ? (
              <p className="text-sm text-destructive">{form.formState.errors.areaHa.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-start-date">{formCopy.fields.startDate}</Label>
              <Input id="edit-start-date" type="date" {...form.register("startDate")} />
              {form.formState.errors.startDate ? (
                <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-harvest-date">{formCopy.fields.expectedHarvestDate}</Label>
              <Input id="edit-harvest-date" type="date" {...form.register("expectedHarvestDate")} />
              {form.formState.errors.expectedHarvestDate ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.expectedHarvestDate.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-product-id">{formCopy.fields.product}</Label>
            <Select
              id="edit-product-id"
              className="text-foreground"
              disabled={productsLoading}
              {...form.register("productId")}
            >
              <option value="">{productsLoading ? "…" : formCopy.productNone}</option>
              {productOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-season-notes">{formCopy.fields.notes}</Label>
            <Textarea id="edit-season-notes" rows={2} {...form.register("notes")} />
          </div>

          <SubmitButton
            isSubmitting={isSubmitting}
            disabled={isDisabled}
            className="w-full sm:w-auto"
          >
            {editCopy.submit}
          </SubmitButton>
        </GuardedForm>
      </DialogContent>
    </Dialog>
  );
}
