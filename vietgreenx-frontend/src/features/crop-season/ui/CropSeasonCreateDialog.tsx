"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

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

import { useCreateCropSeason } from "../api/crop-season.queries";
import { getCropSeasonCopy } from "../crop-season.constants";
import {
  createCreateCropSeasonInputSchema,
  type CreateCropSeasonInput,
} from "../model/crop-season-input.schema";

export interface CropSeasonProductOption {
  id: string;
  label: string;
}

interface CropSeasonCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  greenProfileId: string;
  locale?: AppLocale;
  productOptions?: CropSeasonProductOption[];
  productsLoading?: boolean;
}

export function CropSeasonCreateDialog({
  open,
  onOpenChange,
  greenProfileId,
  locale = getClientLocale(),
  productOptions = [],
  productsLoading = false,
}: CropSeasonCreateDialogProps) {
  const copy = getCropSeasonCopy(locale).form;
  const schema = useMemo(() => createCreateCropSeasonInputSchema(locale), [locale]);
  const { mutate, isPending } = useCreateCropSeason();
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });

  const form = useForm<CreateCropSeasonInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      greenProfileId,
      seasonName: "",
      cropType: "",
      areaHa: 0,
      startDate: "",
      expectedHarvestDate: "",
      productId: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    form.setValue("greenProfileId", greenProfileId);
  }, [greenProfileId, form]);

  useEffect(() => {
    if (!open) {
      form.reset({
        greenProfileId,
        seasonName: "",
        cropType: "",
        areaHa: 0,
        startDate: "",
        expectedHarvestDate: "",
        productId: undefined,
        notes: "",
      });
    }
  }, [open, greenProfileId, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      (data) => {
        mutate(
          {
            ...data,
            productId: data.productId || undefined,
            notes: data.notes?.trim() || undefined,
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
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.subtitle}</DialogDescription>
        </DialogHeader>

        <GuardedForm noValidate onSubmit={onSubmit} isSubmitting={isSubmitting} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="season-name">{copy.fields.seasonName}</Label>
            <Input id="season-name" {...form.register("seasonName")} />
            {form.formState.errors.seasonName ? (
              <p className="text-sm text-destructive">{form.formState.errors.seasonName.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="crop-type">{copy.fields.cropType}</Label>
            <Input id="crop-type" {...form.register("cropType")} />
            {form.formState.errors.cropType ? (
              <p className="text-sm text-destructive">{form.formState.errors.cropType.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="area-ha">{copy.fields.areaHa}</Label>
            <Input id="area-ha" type="number" step="any" min="0" {...form.register("areaHa")} />
            {form.formState.errors.areaHa ? (
              <p className="text-sm text-destructive">{form.formState.errors.areaHa.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="start-date">{copy.fields.startDate}</Label>
              <Input id="start-date" type="date" {...form.register("startDate")} />
              {form.formState.errors.startDate ? (
                <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="harvest-date">{copy.fields.expectedHarvestDate}</Label>
              <Input id="harvest-date" type="date" {...form.register("expectedHarvestDate")} />
              {form.formState.errors.expectedHarvestDate ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.expectedHarvestDate.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="product-id">{copy.fields.product}</Label>
            <Select
              id="product-id"
              className="text-foreground"
              disabled={productsLoading}
              {...form.register("productId")}
            >
              <option value="">{productsLoading ? "…" : copy.productNone}</option>
              {productOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="season-notes">{copy.fields.notes}</Label>
            <Textarea id="season-notes" rows={2} {...form.register("notes")} />
          </div>

          <SubmitButton isSubmitting={isSubmitting} className="w-full sm:w-auto">
            {copy.submit}
          </SubmitButton>
        </GuardedForm>
      </DialogContent>
    </Dialog>
  );
}
