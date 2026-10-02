"use client";

import { useMemo, useState } from "react";

import type { CropSeason } from "@/entities/crop-season";
import type { GreenProfile } from "@/entities/green-profile";
import {
  CropSeasonCreateDialog,
  CropSeasonEditDialog,
  CropSeasonListShell,
  useCropSeasons,
} from "@/features/crop-season";
import { useProducts } from "@/features/products";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

interface GreenProfileSeasonsPanelProps {
  profile: GreenProfile;
  locale?: AppLocale;
}

export function GreenProfileSeasonsPanel({
  profile,
  locale = getClientLocale(),
}: GreenProfileSeasonsPanelProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<CropSeason | null>(null);
  const [page, setPage] = useState(1);
  const { data: seasons, isLoading, isError } = useCropSeasons(page, 10, profile.id);
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 100);

  const productOptions = useMemo(
    () =>
      (productsData?.items ?? []).map((product) => ({
        id: product.id,
        label: product.name,
      })),
    [productsData?.items],
  );

  return (
    <>
      <CropSeasonCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        greenProfileId={profile.id}
        locale={locale}
        productOptions={productOptions}
        productsLoading={productsLoading}
      />
      <CropSeasonEditDialog
        open={Boolean(editingSeason)}
        onOpenChange={(open) => {
          if (!open) setEditingSeason(null);
        }}
        season={editingSeason}
        locale={locale}
        productOptions={productOptions}
        productsLoading={productsLoading}
      />
      <CropSeasonListShell
        locale={locale}
        seasons={seasons}
        isLoading={isLoading}
        isError={isError}
        onAddClick={() => setCreateOpen(true)}
        onEditClick={setEditingSeason}
        page={page}
        onPageChange={setPage}
        unstyled
      />
    </>
  );
}
