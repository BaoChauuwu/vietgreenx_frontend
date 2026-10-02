"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Info,
  Layers,
  Loader2,
  Package,
  Tag,
} from "lucide-react";
import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import type { Batch, BatchDetail, BatchStatus } from "@/entities/batch";
import type { PublicTraceToken } from "@/entities/public-trace-token";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { toastService } from "@/shared/lib/toast";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { ROUTES } from "@/shared/routing";
import { VGX_ELEVATED_SURFACE } from "@/shared/ui/page-layout";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { SubmitButton } from "@/shared/ui/submit-button";

import { useBatchDetail, useCreateBatch, useUpdateBatch } from "../api/batch.queries";
import { getBatchesCopy } from "../batches.constants";
import {
  batchEditFormToUpdateInput,
  batchToEditFormValues,
  createBatchEditFormSchema,
  createCreateBatchInputSchema,
  type BatchEditFormInput,
  type CreateBatchInput,
} from "../model/batch-input.schema";

const TERMINAL_BATCH_STATUSES: BatchStatus[] = ["shipped", "sold", "recalled"];

const STATUS_CLASS: Record<BatchStatus, string> = {
  created: "bg-muted text-muted-foreground",
  qr_generated: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  shipped: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  sold: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  recalled: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
};

export interface BatchCropSeasonOption {
  id: string;
  label: string;
  productId?: string | null;
}

export interface BatchProductOption {
  id: string;
  label: string;
  name?: string;
  status?: string;
}

interface BatchRowProps {
  batch: Batch;
  productName?: string;
  locale?: AppLocale;
}

export function BatchRow({ batch, productName, locale = getClientLocale() }: BatchRowProps) {
  const copy = getBatchesCopy(locale);

  return (
    <Link
      href={ROUTES.batchDetail(batch.id)}
      className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-105 dark:text-emerald-400">
          <Layers className="size-5" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
            {batch.batchCode}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {productName ? `${productName}` : copy.hub.columns.product} ·{" "}
            <span className="font-medium text-foreground/80">
              {batch.quantity} {batch.quantityUnit}
            </span>
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {batch.harvestDate ? (
          <span className="hidden rounded-md bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline-block">
            {new Date(batch.harvestDate).toLocaleDateString(toIntlLocale(locale))}
          </span>
        ) : null}
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
            STATUS_CLASS[batch.status],
          )}
        >
          {copy.status[batch.status]}
        </span>
      </div>
    </Link>
  );
}

export interface BatchProductOption {
  id: string;
  label: string;
  name?: string;
  status?: string;
}

interface BatchFormShellProps {
  locale?: AppLocale;
  productOptions?: BatchProductOption[];
  productsLoading?: boolean;
  cropSeasonOptions?: BatchCropSeasonOption[];
  cropSeasonsLoading?: boolean;
}

export function BatchFormShell({
  locale = getClientLocale(),
  productOptions = [],
  productsLoading = false,
  cropSeasonOptions = [],
  cropSeasonsLoading = false,
}: BatchFormShellProps) {
  const router = useRouter();
  const copy = getBatchesCopy(locale).form;
  const toastCopy = getBatchesCopy(locale).toast;
  const schema = useMemo(() => createCreateBatchInputSchema(locale), [locale]);
  const { mutateAsync: createBatch, isPending } = useCreateBatch();
  const { guardFormEvent, release, isSubmitting, isDisabled } = useGuardedSubmit({ isPending });

  const form = useForm<CreateBatchInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      batchCode: "",
      productId: "",
      cropSeasonId: "",
      quantity: 0,
      quantityUnit: "",
      harvestDate: "",
    },
  });

  const selectedProductId = form.watch("productId");
  const selectedProduct = useMemo(
    () => productOptions.find((p) => p.id === selectedProductId),
    [productOptions, selectedProductId],
  );
  const isDraftProduct = selectedProduct?.status === "draft";

  const filteredCropSeasons = cropSeasonOptions.filter(
    (season) => !season.productId || season.productId === selectedProductId,
  );

  useEffect(() => {
    const currentSeasonId = form.getValues("cropSeasonId");
    if (!currentSeasonId) return;
    const stillValid = filteredCropSeasons.some((season) => season.id === currentSeasonId);
    if (!stillValid) {
      form.setValue("cropSeasonId", filteredCropSeasons[0]?.id ?? "");
    }
  }, [filteredCropSeasons, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          if (isDraftProduct) {
            toastService.error(toastCopy.draftProductError);
            return;
          }
          const created = await createBatch({
            ...data,
            harvestDate: data.harvestDate?.trim() || undefined,
          });
          router.push(ROUTES.batchDetail(created.id));
        } catch (err: unknown) {
          if (isDraftProduct) {
            toastService.error(toastCopy.draftProductError);
          } else {
            toastService.error(toastCopy.createError);
          }
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  return (
    <div className="w-full space-y-6">
      {/* Header breadcrumb & title */}
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Link href={ROUTES.batches} className="transition-colors hover:text-primary">
            {getBatchesCopy(locale).hub.title}
          </Link>
          <span>›</span>
          <span className="text-foreground">{copy.createTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Layers className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {copy.createTitle}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>
        </div>
      </div>

      <GuardedForm noValidate onSubmit={onSubmit} isSubmitting={isSubmitting} className="space-y-6">
        {/* Single Card Container */}
        <ElevatedCard className="shadow-xs divide-y divide-border/60 overflow-hidden border border-border/80">
          {/* Card Header Section Title */}
          <div className="border-b border-border/60 bg-muted/20 px-6 py-4">
            <h2 className="text-base font-semibold text-foreground">{copy.createHeaderTitle}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{copy.createHeaderSubtitle}</p>
          </div>

          <div className="space-y-6 p-6">
            {/* Grid Row 1: Mã lô & Sản phẩm */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="batchCode">
                  {copy.fields.batchCode} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="batchCode"
                  placeholder="VD: DLHL-2026-VIP01"
                  {...form.register("batchCode")}
                />
                {form.formState.errors.batchCode ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.batchCode.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productId">
                  {copy.fields.product} <span className="text-destructive">*</span>
                </Label>
                <Select
                  id="productId"
                  className="text-foreground"
                  disabled={productsLoading}
                  {...form.register("productId")}
                >
                  <option value="">{productsLoading ? "…" : "—"}</option>
                  {productOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {form.formState.errors.productId ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.productId.message}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Inline warning for Draft Product */}
            {isDraftProduct && selectedProduct && (
              <div className="flex flex-col gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs font-medium text-amber-900 dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>{copy.draftWarning}</span>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="shadow-2xs h-7 shrink-0 border-amber-500/40 bg-background text-xs font-semibold text-amber-900 hover:bg-amber-50 dark:text-amber-100"
                >
                  <Link href={ROUTES.productDetail(selectedProduct.id)}>{copy.editProductCta}</Link>
                </Button>
              </div>
            )}

            {/* Grid Row 2: Mùa vụ & Ngày thu hoạch */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cropSeasonId">
                  {copy.fields.cropSeason} <span className="text-destructive">*</span>
                </Label>
                <Select
                  id="cropSeasonId"
                  className="text-foreground"
                  disabled={
                    cropSeasonsLoading || !selectedProductId || isSubmitting || isDraftProduct
                  }
                  {...form.register("cropSeasonId")}
                >
                  <option value="">
                    {cropSeasonsLoading ? "…" : selectedProductId ? "—" : copy.fields.product}
                  </option>
                  {filteredCropSeasons.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {form.formState.errors.cropSeasonId ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.cropSeasonId.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="harvestDate">{copy.fields.harvestDate}</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  disabled={isDraftProduct}
                  {...form.register("harvestDate")}
                />
                {form.formState.errors.harvestDate ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.harvestDate.message}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Grid Row 3: Số lượng & Đơn vị */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  {copy.fields.quantity} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="any"
                  min="0"
                  disabled={isDraftProduct}
                  {...form.register("quantity")}
                />
                {form.formState.errors.quantity ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.quantity.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantityUnit">
                  {copy.fields.unit} <span className="text-destructive">*</span>
                </Label>
                <Select
                  id="quantityUnit"
                  className="text-foreground"
                  disabled={isDraftProduct}
                  {...form.register("quantityUnit")}
                >
                  <option value="">{copy.units.selectPlaceholder}</option>
                  <option value="kg">{copy.units.kg}</option>
                  <option value="Tấn">{copy.units.tonne}</option>
                  <option value="Tạ">{copy.units.ta}</option>
                  <option value="Hộp">{copy.units.box}</option>
                  <option value="Bao">{copy.units.bag}</option>
                  <option value="Quả">{copy.units.item}</option>
                  <option value="Chai">{copy.units.bottle}</option>
                </Select>
                {form.formState.errors.quantityUnit ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.quantityUnit.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Integrated Card Footer */}
          <div className="flex flex-col items-start justify-between gap-4 bg-muted/20 px-6 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground md:text-sm">
              <Info className="size-4 shrink-0 text-primary" />
              <span>{copy.footerInfoHint}</span>
            </div>
            <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
              <Button
                asChild
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="border-border/80 bg-background px-5 font-medium hover:bg-accent"
              >
                <Link href={ROUTES.batches}>{copy.cancel}</Link>
              </Button>
              <SubmitButton
                isSubmitting={isSubmitting}
                disabled={isDisabled || isDraftProduct}
                className="border-0 bg-primary px-7 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
              >
                <span>{copy.save}</span>
              </SubmitButton>
            </div>
          </div>
        </ElevatedCard>
      </GuardedForm>
    </div>
  );
}

interface BatchEditFormShellProps {
  batch: BatchDetail;
  productName?: string;
  locale?: AppLocale;
}

export function BatchEditFormShell({
  batch,
  productName,
  locale = getClientLocale(),
}: BatchEditFormShellProps) {
  const copy = getBatchesCopy(locale).form;
  const schema = useMemo(() => createBatchEditFormSchema(locale), [locale]);
  const { mutateAsync: updateBatch, isPending } = useUpdateBatch(batch.id);
  const isTerminal = TERMINAL_BATCH_STATUSES.includes(batch.status);
  const canEditBatchCode = batch.status === "created";

  const form = useForm<BatchEditFormInput>({
    resolver: zodResolver(schema),
    defaultValues: batchToEditFormValues(batch),
  });

  const isDirty = form.formState.isDirty;
  const { guardFormEvent, release, isSubmitting, isDisabled } = useGuardedSubmit({
    isPending,
    enabled: isDirty,
  });

  useEffect(() => {
    form.reset(batchToEditFormValues(batch));
  }, [batch, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          const updated = await updateBatch(batchEditFormToUpdateInput(data));
          form.reset(batchToEditFormValues(updated));
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  if (isTerminal) {
    return (
      <ElevatedCard className="border border-dashed border-border">
        <CardContent className="p-4 text-sm text-muted-foreground md:p-5">
          {copy.terminalLocked}
        </CardContent>
      </ElevatedCard>
    );
  }

  return (
    <ElevatedCard>
      <CardContent className="space-y-4 p-4 md:p-5">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{copy.editTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy.editSubtitle}</p>
        </div>

        <GuardedForm
          noValidate
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-product">{copy.fields.product}</Label>
            <Input id="edit-product" value={productName ?? batch.productId} disabled readOnly />
            <p className="text-xs text-muted-foreground">{copy.productReadOnly}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-batchCode">{copy.fields.batchCode}</Label>
            <Input
              id="edit-batchCode"
              disabled={!canEditBatchCode || isSubmitting}
              {...form.register("batchCode")}
            />
            {!canEditBatchCode ? (
              <p className="text-xs text-muted-foreground">{copy.batchCodeLocked}</p>
            ) : null}
            {form.formState.errors.batchCode ? (
              <p className="text-sm text-destructive">{form.formState.errors.batchCode.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">{copy.fields.quantity}</Label>
              <Input
                id="edit-quantity"
                type="number"
                step="any"
                min="0"
                disabled={isSubmitting}
                {...form.register("quantity")}
              />
              {form.formState.errors.quantity ? (
                <p className="text-sm text-destructive">{form.formState.errors.quantity.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantityUnit">{copy.fields.unit}</Label>
              <Select
                id="edit-quantityUnit"
                className="text-foreground"
                disabled={isSubmitting}
                {...form.register("quantityUnit")}
              >
                <option value="">{copy.units.selectPlaceholder}</option>
                <option value="kg">{copy.units.kg}</option>
                <option value="Tấn">{copy.units.tonne}</option>
                <option value="Tạ">{copy.units.ta}</option>
                <option value="Hộp">{copy.units.box}</option>
                <option value="Bao">{copy.units.bag}</option>
                <option value="Quả">{copy.units.item}</option>
                <option value="Chai">{copy.units.bottle}</option>
              </Select>
              {form.formState.errors.quantityUnit ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.quantityUnit.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-harvestDate">{copy.fields.harvestDate}</Label>
            <Input
              id="edit-harvestDate"
              type="date"
              disabled={isSubmitting}
              {...form.register("harvestDate")}
            />
            {form.formState.errors.harvestDate ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.harvestDate.message}
              </p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <SubmitButton isSubmitting={isSubmitting} disabled={isDisabled}>
              {copy.save}
            </SubmitButton>
          </div>
        </GuardedForm>
      </CardContent>
    </ElevatedCard>
  );
}

interface BatchDetailShellProps {
  batchId: string;
  locale?: AppLocale;
  traceToken?: PublicTraceToken | null;
  qrActions?: ReactNode;
}

export function BatchDetailShell({
  batchId,
  locale = getClientLocale(),
  traceToken,
  qrActions,
}: BatchDetailShellProps) {
  const copy = getBatchesCopy(locale).detail;
  const { data: batch, isLoading, isError } = useBatchDetail(batchId);

  if (isLoading) {
    return (
      <ElevatedCard>
        <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {copy.loading}
        </CardContent>
      </ElevatedCard>
    );
  }

  if (isError || !batch) {
    return (
      <ElevatedCard className="border border-dashed border-border">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {copy.loadError}
        </CardContent>
      </ElevatedCard>
    );
  }

  const statusCopy = getBatchesCopy(locale).status;

  return (
    <div className="w-full space-y-4">
      <ElevatedCard>
        <CardContent className="space-y-3 p-4 md:p-5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {batch.batchCode}
          </h1>
          <p className="text-sm text-muted-foreground">
            {batch.quantity} {batch.quantityUnit}
            {" · "}
            <span className="capitalize">{statusCopy[batch.status]}</span>
          </p>
          {batch.cropSeason ? (
            <p className="text-sm text-foreground/80">
              {batch.cropSeason.seasonName} · {batch.cropSeason.cropType}
            </p>
          ) : null}
        </CardContent>
      </ElevatedCard>

      <ElevatedCard className="border-tertiary/20">
        <CardContent className="space-y-3 p-4 md:p-5">
          <h2 className="text-sm font-semibold text-foreground">{copy.qrSection}</h2>
          <p className="text-sm text-muted-foreground">
            {traceToken || batch.status !== "created" ? copy.viewTrace : copy.qrEmpty}
          </p>
          {qrActions}
        </CardContent>
      </ElevatedCard>
    </div>
  );
}
