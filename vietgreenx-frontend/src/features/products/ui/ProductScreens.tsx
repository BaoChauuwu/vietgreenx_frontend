"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Info,
  Check,
  Plus,
  X,
  CheckCircle2,
  ChevronDown,
  Link2,
  FileText,
  Layers,
  QrCode,
  RefreshCw,
  CheckCircle,
  Package,
  Tag,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  useProvinces,
  useWardsByProvince,
  useDistrictsByProvince,
} from "@/entities/location/api/location.queries";
import { Combobox } from "@/shared/ui/combobox";

import type { Product } from "@/entities/product";
import {
  PRODUCT_STATUS_FILTERS,
  type ProductStatusFilter,
  getProductsCopy,
} from "../products.constants";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { toastService } from "@/shared/lib/toast";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { SubmitButton } from "@/shared/ui/submit-button";
import { Textarea } from "@/shared/ui/textarea";

import {
  useCreateProduct,
  useDeleteProduct,
  useProduct,
  useUpdateProduct,
} from "../api/product.queries";
import { productPhotosFromIds, type ProductPhotoItem } from "../lib/product-photos";
import {
  createCreateProductInputSchema,
  type CreateProductInput,
} from "../model/product-input.schema";
import { ProductPhotoFields } from "./ProductPhotoFields";

export interface ProductCategoryOption {
  id: string;
  label: string;
}

export interface ProductCertificationOption {
  id: string;
  label: string;
}

interface ProductFilterBarProps {
  locale?: AppLocale;
  className?: string;
  value: ProductStatusFilter;
  onChange: (value: ProductStatusFilter) => void;
}

export function ProductFilterBar({
  locale = getClientLocale(),
  className,
  value,
  onChange,
}: ProductFilterBarProps) {
  const copy = getProductsCopy(locale).hub.filters;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {PRODUCT_STATUS_FILTERS.map((key) => (
        <Button
          key={key}
          type="button"
          variant={value === key ? "default" : "outline"}
          size="sm"
          className={cn(value !== key && "bg-card hover:bg-muted/60")}
          onClick={() => onChange(key)}
        >
          {copy[key]}
        </Button>
      ))}
    </div>
  );
}

interface ProductFormShellProps {
  mode: "create" | "edit";
  productId?: string;
  locale?: AppLocale;
  categoryOptions?: ProductCategoryOption[];
  categoriesLoading?: boolean;
  certificationOptions?: ProductCertificationOption[];
}

function productToFormValues(product: Product): CreateProductInput {
  return {
    name: product.name,
    categoryId: product.categoryId,
    priceUnit: product.priceUnit ?? "",
    description: product.description ?? "",
    productionLocation: product.productionLocation ?? "",
    provinceCode: product.provinceCode ?? undefined,
    wardCode: product.wardCode ?? undefined,
    harvestDate: product.harvestDate ?? "",
    priceReference: product.priceReference ?? undefined,
    availableQuantity: product.availableQuantity ?? undefined,
    photoMediaIds: product.photoMediaIds ?? [],
    qualityStandards: product.qualityStandards ?? [],
    certificationIds: product.certificationIds ?? [],
    isForMarketplace: product.isForMarketplace,
    hasQr: product.hasQr,
    status: product.status,
  };
}

function toProductPayload(data: CreateProductInput, photoMediaIds: string[]): CreateProductInput {
  return {
    ...data,
    description: data.description?.trim() || undefined,
    productionLocation: data.productionLocation?.trim() || undefined,
    province: data.province,
    provinceCode: data.provinceCode ? Number(data.provinceCode) : undefined,
    ward: data.ward,
    wardCode: data.wardCode ? Number(data.wardCode) : undefined,
    harvestDate: data.harvestDate?.trim() || undefined,
    photoMediaIds: photoMediaIds.length ? photoMediaIds : undefined,
    qualityStandards: data.qualityStandards?.length ? data.qualityStandards : undefined,
    certificationIds: data.certificationIds?.length ? data.certificationIds : undefined,
  };
}

export function ProductFormShell({
  mode,
  productId,
  locale = getClientLocale(),
  categoryOptions = [],
  categoriesLoading = false,
  certificationOptions = [],
}: ProductFormShellProps) {
  const router = useRouter();
  const { form: copy, hub: hubCopy, delete: deleteCopy } = getProductsCopy(locale);
  const title = mode === "create" ? copy.createTitle : copy.editTitle;
  const schema = useMemo(() => createCreateProductInputSchema(locale), [locale]);
  const { data: product, isLoading, isError } = useProduct(productId ?? "");
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct(productId ?? "");
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const isPending = mode === "create" ? isCreating : isUpdating;
  const [photoItems, setPhotoItems] = useState<ProductPhotoItem[]>([]);
  const [customFeatureInput, setCustomFeatureInput] = useState("");

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      categoryId: "",
      priceUnit: copy.ui.priceUnitDefault,
      description: "",
      province: "",
      ward: "",
      provinceCode: undefined,
      wardCode: undefined,
      harvestDate: "",
      photoMediaIds: [],
      qualityStandards: [],
      certificationIds: [],
      isForMarketplace: false,
      hasQr: false,
      status: "draft",
    },
  });

  const selectedCertificationIds = form.watch("certificationIds") ?? [];
  const qualityStandards = form.watch("qualityStandards") ?? [];
  const selectedProvinceCode = form.watch("provinceCode");

  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const { data: districts } = useDistrictsByProvince(
    selectedProvinceCode ? Number(selectedProvinceCode) : undefined,
  );
  const { data: wards, isLoading: isLoadingWards } = useWardsByProvince(
    selectedProvinceCode ? Number(selectedProvinceCode) : undefined,
  );

  const provinceOptions = useMemo(() => {
    return (provinces || []).map((p) => ({ value: String(p.code), label: p.name }));
  }, [provinces]);

  const wardOptions = useMemo(() => {
    if (!wards) return [];
    const districtMap = new Map(districts?.map((d) => [d.code, d.name]) ?? []);
    return wards.map((w) => {
      const districtName = districtMap.get(w.district_code ?? -1);
      const label = districtName ? `${w.name} - ${districtName}` : w.name;
      return { value: String(w.code), label, id: w.code };
    });
  }, [wards, districts]);

  const isDirty = form.formState.isDirty;
  const { guardFormEvent, release, isSubmitting, isDisabled } = useGuardedSubmit({
    isPending,
    enabled: mode === "create" || isDirty,
  });

  useEffect(() => {
    if (mode !== "edit" || !product) return;
    form.reset(productToFormValues(product));
    setPhotoItems(productPhotosFromIds(product.photoMediaIds ?? [], product.photoMedias));
  }, [mode, product, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          const payload = toProductPayload(
            data,
            photoItems.map((item) => item.mediaId),
          );
          if (mode === "create") {
            const created = await createProduct(payload);
            if (payload.status === "draft") {
              router.push(ROUTES.products);
            } else {
              router.push(ROUTES.productDetail(created.id));
            }
            return;
          }
          const updated = await updateProduct(payload);
          form.reset(productToFormValues(updated));
          setPhotoItems(productPhotosFromIds(updated.photoMediaIds ?? [], updated.photoMedias));
          if (payload.status === "draft") {
            router.push(ROUTES.products);
          }
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  const handleDelete = () => {
    if (!productId || !window.confirm(deleteCopy.confirm)) return;
    deleteProduct(productId, {
      onSuccess: () => router.push(ROUTES.products),
    });
  };

  if (mode === "edit" && isLoading) {
    return (
      <ElevatedCard>
        <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {copy.loading}
        </CardContent>
      </ElevatedCard>
    );
  }

  if (mode === "edit" && (isError || !product)) {
    return (
      <ElevatedCard className="border border-dashed border-border">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {copy.loadError}
        </CardContent>
      </ElevatedCard>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header breadcrumb & title */}
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Link href={ROUTES.products} className="transition-colors hover:text-primary">
            {hubCopy.title}
          </Link>
          <span>›</span>
          <span className="text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-700 dark:bg-secondary-950/50 dark:text-secondary-400">
            <Package className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{copy.createSubtitle}</p>
          </div>
        </div>
      </div>

      <GuardedForm noValidate onSubmit={onSubmit} isSubmitting={isSubmitting} className="space-y-6">
        {/* Single Card Container for all Form Sections */}
        <ElevatedCard className="shadow-xs divide-y divide-border/60 overflow-hidden border border-border/80">
          {/* Top Quick-Jump Tab Navigator Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/60 bg-muted/20 px-5 py-3">
            {[
              { id: "sec-1", icon: Package, label: copy.ui.card1Title },
              { id: "sec-2", icon: MapPin, label: copy.ui.card2Title },
              { id: "sec-3", icon: ImageIcon, label: copy.ui.card3Title },
              { id: "sec-4", icon: Link2, label: copy.ui.card4Title },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    document
                      .getElementById(tab.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="hover:shadow-2xs flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-background hover:text-foreground"
                >
                  <TabIcon className="size-3.5 text-primary" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 1: Thông tin chung */}
          <div id="sec-1" className="space-y-5 p-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  1
                </span>
                <h2 className="text-base font-semibold text-foreground">{copy.ui.card1Title}</h2>
              </div>
              <span className="cursor-help text-muted-foreground" title={copy.ui.card1Tooltip}>
                <Info className="size-4" />
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {copy.fields.name} <span className="text-destructive">*</span>
                </Label>
                <Input id="name" placeholder={copy.ui.namePlaceholder} {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">
                  {copy.fields.category} <span className="text-destructive">*</span>
                </Label>
                <Select
                  id="categoryId"
                  className="text-foreground"
                  disabled={categoriesLoading}
                  {...form.register("categoryId")}
                >
                  <option value="">{categoriesLoading ? "…" : "—"}</option>
                  {categoryOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {form.formState.errors.categoryId ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.categoryId.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{copy.fields.description}</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder={copy.ui.descriptionPlaceholder}
                {...form.register("description")}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {form.formState.errors.description ? (
                  <span className="text-destructive">
                    {form.formState.errors.description.message}
                  </span>
                ) : (
                  <span />
                )}
                <span>{(form.watch("description") || "").length}/1000</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>{copy.ui.qualityStandardsLabel}</Label>
              <div className="flex flex-wrap items-center gap-2">
                {qualityStandards.map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                  >
                    <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                    {feat}
                    <button
                      type="button"
                      onClick={() => {
                        const next = qualityStandards.filter((item) => item !== feat);
                        form.setValue("qualityStandards", next, { shouldDirty: true });
                      }}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                {qualityStandards.length === 0 && (
                  <span className="mr-1 text-xs italic text-muted-foreground">
                    {copy.ui.qualityStandardsEmpty}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="mr-1 text-xs font-medium text-muted-foreground">
                  {copy.ui.qualityStandardsHint}
                </span>
                {(copy.ui.qualityStandardsSuggestions || [])
                  .filter((feat) => !qualityStandards.includes(feat))
                  .map((feat) => (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => {
                        form.setValue("qualityStandards", [...qualityStandards, feat], {
                          shouldDirty: true,
                        });
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Plus className="size-3" /> {feat}
                    </button>
                  ))}
              </div>
              <div className="flex max-w-sm items-center gap-2 pt-1">
                <Input
                  placeholder={copy.ui.qualityStandardsInputPlaceholder}
                  value={customFeatureInput}
                  onChange={(e) => setCustomFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = customFeatureInput.trim();
                      if (val && !qualityStandards.includes(val)) {
                        form.setValue("qualityStandards", [...qualityStandards, val], {
                          shouldDirty: true,
                        });
                        setCustomFeatureInput("");
                      }
                    }
                  }}
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 shrink-0 px-3 text-xs"
                  onClick={() => {
                    const val = customFeatureInput.trim();
                    if (val && !qualityStandards.includes(val)) {
                      form.setValue("qualityStandards", [...qualityStandards, val], {
                        shouldDirty: true,
                      });
                      setCustomFeatureInput("");
                    }
                  }}
                >
                  <Plus className="mr-1 size-3" /> {copy.ui.qualityStandardsAddBtn}
                </Button>
              </div>
            </div>

            <div className="grid items-center gap-4 border-t border-border/40 pt-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {copy.ui.statusLabel}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: "active",
                      label: copy.ui.statusActive,
                      activeClass:
                        "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20",
                      dot: "bg-emerald-500",
                    },
                    {
                      id: "draft",
                      label: copy.ui.statusDraft,
                      activeClass:
                        "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20",
                      dot: "bg-amber-500",
                    },
                    {
                      id: "out_of_stock",
                      label: copy.ui.statusOutOfStock,
                      activeClass:
                        "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20",
                      dot: "bg-rose-500",
                    },
                  ].map((item) => {
                    const isChecked = form.watch("status") === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          form.setValue("status", item.id as CreateProductInput["status"], {
                            shouldDirty: true,
                          })
                        }
                        className={cn(
                          "flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition-all",
                          isChecked
                            ? item.activeClass + " shadow-2xs font-semibold"
                            : "border-border/70 bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            isChecked ? item.dot : "bg-muted-foreground/40",
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="priceReference"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {copy.fields.priceReference}
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                      id="priceReference"
                      type="number"
                      min={0}
                      step="any"
                      placeholder={copy.ui.priceReferencePlaceholder}
                      className="pl-9"
                      {...form.register("priceReference")}
                    />
                  </div>
                  <Select className="w-32 text-center font-medium" {...form.register("priceUnit")}>
                    <option value={copy.ui.priceUnitDefault}>{copy.ui.priceUnitDefault}</option>
                    <option value={copy.ui.priceUnits.tonne}>{copy.ui.priceUnits.tonne}</option>
                    <option value={copy.ui.priceUnits.box}>{copy.ui.priceUnits.box}</option>
                    <option value={copy.ui.priceUnits.bag}>{copy.ui.priceUnits.bag}</option>
                    <option value={copy.ui.priceUnits.item}>{copy.ui.priceUnits.item}</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Nguồn gốc & Sản xuất */}
          <div id="sec-2" className="space-y-5 p-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  2
                </span>
                <h2 className="text-base font-semibold text-foreground">{copy.ui.card2Title}</h2>
              </div>
              <span className="cursor-help text-muted-foreground" title={copy.ui.card2Tooltip}>
                <Info className="size-4" />
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="productionLocation">
                  {copy.fields.productionLocation || copy.ui.productionLocationLabel}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="productionLocation"
                  placeholder={copy.ui.productionLocationPlaceholder}
                  {...form.register("productionLocation")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">
                  {copy.fields.province || copy.ui.provinceLabel}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={form.control}
                  name="provinceCode"
                  render={({ field }) => (
                    <Combobox
                      id="province"
                      options={provinceOptions}
                      value={field.value ? String(field.value) : ""}
                      loading={isLoadingProvinces}
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("wardCode", undefined, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        form.setValue("ward", "", { shouldValidate: true, shouldDirty: true });
                        const selectedName = provinceOptions.find((o) => o.value === val)?.label;
                        if (selectedName) {
                          form.setValue("province", selectedName, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        } else {
                          form.setValue("province", "", {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                      placeholder={copy.ui.provincePlaceholder}
                      searchPlaceholder={copy.ui.searchPlaceholder}
                      emptyText={copy.ui.emptyText}
                    />
                  )}
                />
                {form.formState.errors.provinceCode && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.provinceCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="ward">{copy.fields.ward || copy.ui.districtLabel}</Label>
                <Controller
                  control={form.control}
                  name="wardCode"
                  render={({ field }) => (
                    <Combobox
                      id="ward"
                      options={wardOptions}
                      value={field.value ? String(field.value) : ""}
                      loading={isLoadingWards}
                      disabled={!selectedProvinceCode}
                      onValueChange={(val) => {
                        field.onChange(val ? Number(val) : undefined);
                        const selectedName = wardOptions.find((o) => o.value === val)?.label;
                        if (selectedName) {
                          form.setValue("ward", selectedName, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        } else {
                          form.setValue("ward", "", {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                      placeholder={copy.ui.districtPlaceholder}
                      searchPlaceholder={copy.ui.searchPlaceholder}
                      emptyText={copy.ui.emptyText}
                    />
                  )}
                />
                {form.formState.errors.wardCode && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.wardCode.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="harvestDate">
                  {copy.fields.harvestDate || copy.ui.harvestDateLabel}
                </Label>
                <Input id="harvestDate" type="date" {...form.register("harvestDate")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{copy.ui.certificationsLabel}</Label>
              <div className="flex flex-wrap items-center gap-2">
                {certificationOptions.length === 0 && (
                  <span className="mr-1 text-xs italic text-muted-foreground">
                    {copy.ui.certificationsEmptyNote}
                  </span>
                )}
                {certificationOptions.map((option) => {
                  const isChecked = selectedCertificationIds.includes(option.id);
                  return (
                    <label
                      key={option.id}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                        isChecked
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        disabled={isSubmitting}
                        onChange={(event) => {
                          const next = event.target.checked
                            ? [...selectedCertificationIds, option.id]
                            : selectedCertificationIds.filter((id) => id !== option.id);
                          form.setValue("certificationIds", next, { shouldDirty: true });
                        }}
                      />
                      {isChecked && <Check className="size-3" />}
                      <span>{option.label}</span>
                    </label>
                  );
                })}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                  className="inline-flex h-auto items-center gap-1.5 rounded-full border border-dashed border-primary/40 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                >
                  <Link href={ROUTES.greenProfile}>
                    <Plus className="size-3" /> {copy.ui.addCertFromGreenProfile}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Section 3: Ảnh sản phẩm */}
          <div id="sec-3" className="space-y-5 p-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  3
                </span>
                <h2 className="text-base font-semibold text-foreground">{copy.ui.card3Title}</h2>
              </div>
              <span className="cursor-help text-muted-foreground" title={copy.ui.card3Tooltip}>
                <Info className="size-4" />
              </span>
            </div>

            <ProductPhotoFields
              locale={locale}
              items={photoItems}
              onChange={(nextItems) => {
                setPhotoItems(nextItems);
                form.setValue(
                  "photoMediaIds",
                  nextItems.map((item) => item.mediaId),
                  { shouldDirty: true },
                );
              }}
              disabled={isSubmitting}
            />

            <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>{copy.ui.photoGuidance}</span>
            </div>
          </div>

          {/* Section 4: Truy xuất & Liên kết */}
          <div id="sec-4" className="space-y-5 p-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  4
                </span>
                <div>
                  <h2 className="text-base font-semibold text-foreground">{copy.ui.card4Title}</h2>
                  <p className="text-xs text-muted-foreground">{copy.ui.card4Subtitle}</p>
                </div>
              </div>
              <span className="cursor-help text-muted-foreground" title={copy.ui.card4Tooltip}>
                <Info className="size-4" />
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {copy.ui.productionLogLabel}
                </Label>
                {mode === "edit" && productId ? (
                  <Link
                    href={
                      product?.greenProfileId ? ROUTES.greenProfileLog(product.greenProfileId) : "#"
                    }
                    className={cn(
                      "flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400",
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FileText className="size-4 shrink-0 text-emerald-600" />
                      {`NK-${product?.slug?.slice(0, 8) || productId.slice(0, 6).toUpperCase()}`}
                    </span>
                    <CheckCircle2 className="ml-1 size-4 shrink-0 text-emerald-600" />
                  </Link>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-2 truncate">
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      {copy.ui.logLinkedAfterPost}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {copy.ui.batchesLabel}
                </Label>
                {mode === "edit" && productId ? (
                  <Link
                    href={`${ROUTES.batches}?productId=${productId}`}
                    className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Layers className="size-4 shrink-0 text-emerald-600" /> {copy.ui.viewBatches}
                    </span>
                    <CheckCircle2 className="ml-1 size-4 shrink-0 text-emerald-600" />
                  </Link>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2 truncate">
                      <Layers className="size-4 shrink-0" /> {copy.ui.batchCreatedAfterPost}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {copy.ui.qrTraceabilityLabel}
                </Label>
                {mode === "edit" && productId ? (
                  <Link
                    href={`${ROUTES.qr}?productId=${productId}`}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors",
                      product?.hasQr
                        ? "border-emerald-500/30 bg-emerald-500/5 font-medium text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <QrCode className="size-4 shrink-0" />{" "}
                      {product?.hasQr ? copy.ui.qrLinked : copy.ui.qrNotLinked}
                    </span>
                    {product?.hasQr ? (
                      <CheckCircle2 className="ml-1 size-4 shrink-0 text-emerald-600" />
                    ) : (
                      <ChevronDown className="ml-1 size-4 shrink-0 text-muted-foreground" />
                    )}
                  </Link>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2 truncate">
                      <QrCode className="size-4 shrink-0" /> {copy.ui.qrNotLinked}
                    </span>
                    <ChevronDown className="ml-1 size-4 shrink-0 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {mode === "edit" && productId ? (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  asChild
                  className="gap-1.5 bg-emerald-600 font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  <Link href={`${ROUTES.qr}?productId=${productId}`}>
                    <QrCode className="size-4" /> {copy.ui.manageQrBtn}
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => toastService.info(copy.ui.qrRequiredAlert)}
                  className="gap-1.5 bg-emerald-600 font-semibold text-white opacity-90 shadow-sm hover:bg-emerald-700"
                >
                  <QrCode className="size-4" /> {copy.ui.createQrBtn}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toastService.success(copy.ui.refreshSuccessToast)}
                className="gap-1.5"
              >
                <RefreshCw className="size-3.5" /> {copy.ui.refreshLinkBtn}
              </Button>
            </div>
          </div>

          {/* Integrated Card Footer Actions */}
          <div className="flex flex-col items-start justify-between gap-4 bg-muted/20 px-6 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground md:text-sm">
              <Info className="size-4 shrink-0 text-primary" />
              <span>{copy.ui.footerInfo}</span>
            </div>
            <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
                  form.setValue("status", "draft", { shouldDirty: true });
                }}
                className="border-border/80 bg-background px-5 font-medium hover:bg-accent"
              >
                {copy.ui.saveDraftBtn}
              </Button>
              <SubmitButton
                isSubmitting={isSubmitting}
                disabled={isDisabled}
                onClick={() => {
                  if (mode === "create" && form.watch("status") === "draft") {
                    form.setValue("status", "active", { shouldDirty: true });
                  }
                }}
                className="border-0 bg-primary px-7 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle className="size-4" />
                  {mode === "create" ? copy.ui.publishBtn : copy.ui.saveChangesBtn}
                </span>
              </SubmitButton>
            </div>
          </div>
        </ElevatedCard>
      </GuardedForm>

      {mode === "edit" && product && product.status !== "archived" ? (
        <ElevatedCard className="rounded-2xl border border-destructive/20 bg-destructive/5">
          <CardContent className="space-y-3 p-4 md:p-5">
            <h2 className="text-base font-semibold text-destructive">{deleteCopy.title}</h2>
            <p className="text-sm text-muted-foreground">{deleteCopy.description}</p>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting || isSubmitting}
              onClick={handleDelete}
            >
              {deleteCopy.action}
            </Button>
          </CardContent>
        </ElevatedCard>
      ) : null}
    </div>
  );
}

interface ProductDetailShellProps {
  productId: string;
  locale?: AppLocale;
  categoryOptions?: ProductCategoryOption[];
  categoriesLoading?: boolean;
  certificationOptions?: ProductCertificationOption[];
}

export function ProductDetailShell({
  productId,
  locale = getClientLocale(),
  categoryOptions,
  categoriesLoading,
  certificationOptions,
}: ProductDetailShellProps) {
  return (
    <ProductFormShell
      mode="edit"
      productId={productId}
      locale={locale}
      categoryOptions={categoryOptions}
      categoriesLoading={categoriesLoading}
      certificationOptions={certificationOptions}
    />
  );
}
