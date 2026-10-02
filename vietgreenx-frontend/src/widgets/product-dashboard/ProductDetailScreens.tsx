"use client";

import { useMemo } from "react";

import { getCertificationCopy, useCertifications } from "@/features/certification";
import { useActiveGreenProfile } from "@/features/green-profile";
import { ProductDetailShell, ProductFormShell } from "@/features/products";
import { useAgricultureCategories } from "@/features/posts";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { ProductCreateRightRail, ProductDetailActionsRail } from "./ProductRails";

function useProductCategoryOptions(locale: AppLocale) {
  const { data: categories = [], isLoading } = useAgricultureCategories();
  const categoryOptions = categories.map((category) => ({
    id: category.id,
    label: locale === "vi" ? category.nameVi : category.nameEn,
  }));
  return { categoryOptions, categoriesLoading: isLoading };
}

function useProductCertificationOptions(locale: AppLocale) {
  const { data: profile } = useActiveGreenProfile();
  const { data: certifications = [] } = useCertifications(profile?.id ?? "", Boolean(profile?.id));
  const typeLabels = getCertificationCopy(locale).types;

  const certificationOptions = useMemo(
    () =>
      certifications
        .filter((cert) => cert.status === "approved" || cert.status === "valid")
        .map((cert) => ({
          id: cert.id,
          label: `${typeLabels[cert.certType] ?? cert.certType} · ${cert.issuingAuthority}`,
        })),
    [certifications, typeLabels],
  );

  return { certificationOptions };
}

interface ProductCreateScreenProps {
  locale?: AppLocale;
}

export function ProductCreateScreen({ locale = getClientLocale() }: ProductCreateScreenProps) {
  const { categoryOptions, categoriesLoading } = useProductCategoryOptions(locale);
  const { certificationOptions } = useProductCertificationOptions(locale);

  return (
    <ModulePageShell width="work" rightRail={<ProductCreateRightRail locale={locale} />}>
      <ProductFormShell
        mode="create"
        locale={locale}
        categoryOptions={categoryOptions}
        categoriesLoading={categoriesLoading}
        certificationOptions={certificationOptions}
      />
    </ModulePageShell>
  );
}

interface ProductDetailScreenProps {
  productId: string;
  locale?: AppLocale;
}

export function ProductDetailScreen({
  productId,
  locale = getClientLocale(),
}: ProductDetailScreenProps) {
  const { categoryOptions, categoriesLoading } = useProductCategoryOptions(locale);
  const { certificationOptions } = useProductCertificationOptions(locale);

  return (
    <ModulePageShell
      width="work"
      rightRail={<ProductDetailActionsRail locale={locale} productId={productId} />}
    >
      <ProductDetailShell
        productId={productId}
        locale={locale}
        categoryOptions={categoryOptions}
        categoriesLoading={categoriesLoading}
        certificationOptions={certificationOptions}
      />
    </ModulePageShell>
  );
}
