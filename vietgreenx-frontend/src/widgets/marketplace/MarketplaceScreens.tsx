"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Loader2, MessageCircle, Send } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getUnitOptions } from "@/shared/i18n/units";
import { useProvinces } from "@/entities/location/api/location.queries";
import { useCategories } from "@/features/category";
import { cn } from "@/shared/lib/cn";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { GuardedForm } from "@/shared/ui/guarded-form";

import {
  LAYOUT_PREVIEW_LISTINGS,
  getMarketplaceCopy,
  type MarketplaceListing,
} from "@/features/marketplace";
import { SendQuotationDialog } from "@/features/quotation";
import { SupplierSaveButton, SupplierReviewSummaryCard } from "@/features/supplier";
import {
  createSellOfferInputSchema,
  createBuyRequestInputSchema,
  type CreateSellOfferInput,
  type CreateBuyRequestInput,
} from "@/entities/trade-post";
import { useCreateSellOffer, useCreateBuyRequest, useTradePostById } from "@/features/trade-post";

function findPreviewListing(id: string): MarketplaceListing | undefined {
  return LAYOUT_PREVIEW_LISTINGS.find((item) => item.id === id);
}

interface SellOfferFormShellProps {
  locale?: AppLocale;
}

export function SellOfferFormShell({ locale = getClientLocale() }: SellOfferFormShellProps) {
  const router = useRouter();
  const copy = getMarketplaceCopy(locale);
  const formCopy = copy.sellForm;
  const createSellOffer = useCreateSellOffer(locale);
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.items ?? [];
  const { data: provinces } = useProvinces();

  const form = useForm<CreateSellOfferInput>({
    resolver: zodResolver(createSellOfferInputSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      quantity: 1,
      quantityUnit: "kg",
      priceReference: undefined,
      provinceCode: undefined,
      description: "",
    },
  });

  useEffect(() => {
    if (categories.length > 0 && !form.getValues("categoryId") && categories[0]?.id) {
      form.setValue("categoryId", categories[0].id);
    }
  }, [categories, form]);

  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({
    isPending: createSellOffer.isPending,
  });

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          await createSellOffer.mutateAsync(data);
          router.push(ROUTES.marketplace);
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  return (
    <GuardedForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting || createSellOffer.isPending}
      className="w-full space-y-4"
    >
      <ElevatedCard>
        <CardContent className="space-y-4 p-4 md:p-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {formCopy.createTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{formCopy.subtitle}</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {formCopy.labels.title}
              </label>
              <Input
                required
                placeholder={formCopy.placeholders.title}
                {...form.register("title")}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {formCopy.labels.category}
                </label>
                <select
                  required
                  {...form.register("categoryId")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {locale === "en"
                          ? cat.nameEn || cat.nameVi || cat.name
                          : cat.nameVi || cat.nameEn || cat.name}
                      </option>
                    ))
                  ) : (
                    <option value="">{formCopy.placeholders.categoryLoading}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {formCopy.labels.province}
                </label>
                <select
                  {...form.register("provinceCode", {
                    setValueAs: (v) => (v ? Number(v) : undefined),
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">{formCopy.placeholders.provinceSelect}</option>
                  {provinces?.map((prov) => (
                    <option key={prov.code} value={prov.code}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {formCopy.labels.quantity}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={0.01}
                    step="any"
                    required
                    placeholder={formCopy.placeholders.quantity}
                    {...form.register("quantity", { valueAsNumber: true })}
                    className="flex-1"
                  />
                  <select
                    {...form.register("quantityUnit")}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {getUnitOptions(locale).map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {formCopy.labels.price.replace("{unit}", form.watch("quantityUnit") || "kg")}
                </label>
                <Input
                  type="number"
                  placeholder={formCopy.placeholders.price}
                  {...form.register("priceReference", {
                    setValueAs: (v) => (v ? Number(v) : undefined),
                  })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {formCopy.labels.description}
              </label>
              <Textarea
                placeholder={formCopy.placeholders.description}
                rows={4}
                className="resize-none"
                {...form.register("description")}
              />
            </div>
          </div>
        </CardContent>
      </ElevatedCard>

      <div className="flex justify-end gap-2">
        <Button asChild variant="ghost">
          <Link href={ROUTES.marketplace}>{formCopy.cancel}</Link>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || createSellOffer.isPending}
          className="gap-1.5 font-semibold"
        >
          {isSubmitting || createSellOffer.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          {formCopy.save}
        </Button>
      </div>
    </GuardedForm>
  );
}

interface BuyRequestFormShellProps {
  locale?: AppLocale;
}

export function BuyRequestFormShell({ locale = getClientLocale() }: BuyRequestFormShellProps) {
  const router = useRouter();
  const copy = getMarketplaceCopy(locale);
  const formCopy = copy.buyForm;
  const createBuyRequest = useCreateBuyRequest(locale);
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.items ?? [];
  const { data: provinces } = useProvinces();

  const form = useForm<CreateBuyRequestInput>({
    resolver: zodResolver(createBuyRequestInputSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      quantity: 1,
      quantityUnit: "kg",
      priceReference: undefined,
      provinceCode: undefined,
      description: "",
    },
  });

  useEffect(() => {
    if (categories.length > 0 && !form.getValues("categoryId") && categories[0]?.id) {
      form.setValue("categoryId", categories[0].id);
    }
  }, [categories, form]);

  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({
    isPending: createBuyRequest.isPending,
  });

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          await createBuyRequest.mutateAsync(data);
          router.push(ROUTES.marketplace);
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  return (
    <GuardedForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting || createBuyRequest.isPending}
      className="w-full space-y-4"
    >
      <ElevatedCard>
        <CardContent className="space-y-4 p-4 md:p-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {formCopy.createTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{formCopy.subtitle}</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {formCopy.labels.title}
              </label>
              <Input
                required
                placeholder={formCopy.placeholders.title}
                {...form.register("title")}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {formCopy.labels.category}
                </label>
                <select
                  required
                  {...form.register("categoryId")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {locale === "en"
                          ? cat.nameEn || cat.nameVi || cat.name
                          : cat.nameVi || cat.nameEn || cat.name}
                      </option>
                    ))
                  ) : (
                    <option value="">{formCopy.placeholders.categoryLoading}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {formCopy.labels.province}
                </label>
                <select
                  {...form.register("provinceCode", {
                    setValueAs: (v) => (v ? Number(v) : undefined),
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">{formCopy.placeholders.provinceSelect}</option>
                  {provinces?.map((prov) => (
                    <option key={prov.code} value={prov.code}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {formCopy.labels.quantity}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={0.01}
                    step="any"
                    required
                    placeholder={formCopy.placeholders.quantity}
                    {...form.register("quantity", { valueAsNumber: true })}
                    className="flex-1"
                  />
                  <select
                    {...form.register("quantityUnit")}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {getUnitOptions(locale).map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {formCopy.labels.price.replace("{unit}", form.watch("quantityUnit") || "kg")}
                </label>
                <Input
                  type="number"
                  placeholder={formCopy.placeholders.price}
                  {...form.register("priceReference", {
                    setValueAs: (v) => (v ? Number(v) : undefined),
                  })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {formCopy.labels.description}
              </label>
              <Textarea
                placeholder={formCopy.placeholders.description}
                rows={4}
                className="resize-none"
                {...form.register("description")}
              />
            </div>
          </div>
        </CardContent>
      </ElevatedCard>

      <div className="flex justify-end gap-2">
        <Button asChild variant="ghost">
          <Link href={ROUTES.marketplace}>{formCopy.cancel}</Link>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || createBuyRequest.isPending}
          className="gap-1.5 font-semibold"
        >
          {isSubmitting || createBuyRequest.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          {formCopy.save}
        </Button>
      </div>
    </GuardedForm>
  );
}

interface MarketplaceDetailShellProps {
  listingId: string;
  locale?: AppLocale;
}

export function MarketplaceDetailShell({
  listingId,
  locale = getClientLocale(),
}: MarketplaceDetailShellProps) {
  const copy = getMarketplaceCopy(locale);
  const detailCopy = copy.detail;
  const { data: apiTradePost } = useTradePostById(listingId);
  const previewListing = findPreviewListing(listingId);

  const listing: MarketplaceListing | undefined = useMemo(() => {
    if (apiTradePost) {
      const rawType = String(
        apiTradePost.tradeType ??
          (apiTradePost as Record<string, unknown>).trade_type ??
          (apiTradePost as Record<string, unknown>).kind ??
          (apiTradePost as Record<string, unknown>).type ??
          "",
      ).toLowerCase();
      const kind = rawType === "buy" ? "buy" : "sell";
      const orgName =
        apiTradePost.poster?.displayName ||
        apiTradePost.poster?.username ||
        detailCopy.memberDefault;
      const priceLabel = apiTradePost.priceReference
        ? `${apiTradePost.priceReference.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} VNĐ/${apiTradePost.quantityUnit || "kg"}`
        : detailCopy.negotiable;
      return {
        id: apiTradePost.id,
        kind,
        title: apiTradePost.title,
        productName:
          apiTradePost.category?.nameVi ||
          apiTradePost.category?.nameEn ||
          detailCopy.defaultProduct,
        quantity: apiTradePost.quantity,
        unit: apiTradePost.quantityUnit || "kg",
        provinceCode: apiTradePost.provinceCode ? String(apiTradePost.provinceCode) : "",
        priceLabel,
        certifications: apiTradePost.certRequirements || [],
        orgName,
        orgVerified: true,
        postedAt: apiTradePost.createdAt
          ? String(apiTradePost.createdAt)
          : new Date().toISOString(),
        description: apiTradePost.description || undefined,
      };
    }
    return previewListing;
  }, [apiTradePost, previewListing, detailCopy, locale]);

  const dateLocale = toIntlLocale(locale);
  const { data: provinces } = useProvinces();
  const provinceName = provinces?.find(
    (p) => String(p.code) === String(listing?.provinceCode),
  )?.name;

  if (!listing) {
    return (
      <div className="w-full space-y-4">
        <ElevatedCard>
          <CardContent className="p-4 md:p-5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {detailCopy.title}
            </h1>
          </CardContent>
        </ElevatedCard>
        <ElevatedCard>
          <CardContent className="p-6 text-sm text-muted-foreground">—</CardContent>
        </ElevatedCard>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <ElevatedCard>
        <CardContent className="space-y-2 p-4 md:p-5">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
              listing.kind === "sell"
                ? "bg-secondary-50 text-secondary-700"
                : "bg-primary/10 text-primary",
            )}
          >
            {copy.kind[listing.kind]}
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{listing.title}</h1>
          <p className="text-sm text-muted-foreground">
            {detailCopy.posted}: {new Date(listing.postedAt).toLocaleDateString(dateLocale)}
          </p>
        </CardContent>
      </ElevatedCard>

      <ElevatedCard>
        <CardContent className="space-y-4 p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-foreground">
              {detailCopy.org}: {listing.orgName}
            </p>
            {listing.orgVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <BadgeCheck className="size-3.5" aria-hidden />
                {copy.card.verified}
              </span>
            )}
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">{copy.card.quantity}</dt>
              <dd className="font-medium text-foreground">
                {listing.quantity} {listing.unit}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{copy.card.province}</dt>
              <dd className="font-medium text-foreground">{provinceName || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{copy.card.price}</dt>
              <dd className="font-medium text-foreground">
                {listing.priceLabel || "Thương lượng"}
              </dd>
            </div>
          </dl>

          {listing.certifications && listing.certifications.length > 0 && (
            <div>
              <p className="mb-1.5 text-sm font-medium text-foreground">
                {detailCopy.certifications}
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {listing.certifications.map((c) => (
                  <li
                    key={c}
                    className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-xs font-medium"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {listing.description && (
            <div>
              <p className="mb-1 text-sm font-medium text-foreground">{detailCopy.description}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
            </div>
          )}
        </CardContent>
      </ElevatedCard>

      <ElevatedCard className="border-primary/15">
        <CardContent className="space-y-3 p-4 md:p-5">
          <h2 className="text-sm font-semibold text-foreground">{detailCopy.connectTitle}</h2>
          <p className="text-sm text-muted-foreground">{detailCopy.connectNote}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild className="gap-1.5">
              <Link href={ROUTES.chat}>
                <MessageCircle className="size-4" />
                {detailCopy.chat}
              </Link>
            </Button>
            {apiTradePost?.poster?.id ? (
              <>
                <SendQuotationDialog
                  receiverUserId={apiTradePost.poster.id}
                  tradePostId={listing.id}
                  locale={locale}
                  trigger={
                    <Button variant="outline" className="gap-1.5 font-semibold">
                      <Send className="size-4" />
                      {detailCopy.sendQuote}
                    </Button>
                  }
                />
                <SupplierSaveButton supplierId={apiTradePost.poster.id} locale={locale} />
              </>
            ) : (
              <Button variant="outline" disabled className="gap-1.5 font-semibold">
                <Send className="size-4" />
                {detailCopy.sendQuote}
              </Button>
            )}
          </div>
        </CardContent>
      </ElevatedCard>

      {apiTradePost?.poster?.id && (
        <SupplierReviewSummaryCard
          supplierId={apiTradePost.poster.id}
          supplierName={listing.orgName}
          locale={locale}
        />
      )}
    </div>
  );
}
