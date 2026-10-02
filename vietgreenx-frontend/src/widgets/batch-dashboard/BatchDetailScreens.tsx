"use client";

import {
  BatchDetailShell,
  BatchEditFormShell,
  BatchFormShell,
  getBatchesCopy,
  useBatchDetail,
} from "@/features/batches";
import { useCropSeasons } from "@/features/crop-season";
import { useProducts } from "@/features/products";
import {
  BatchQrActions,
  createBatchQrInput,
  useGenerateQr,
  useQrApiAvailable,
  useTraceTokenForBatch,
} from "@/features/traceability";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { BatchDetailQrRail, BatchesWorkflowRail } from "./BatchRails";

interface BatchCreateScreenProps {
  locale?: AppLocale;
}

export function BatchCreateScreen({ locale = getClientLocale() }: BatchCreateScreenProps) {
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 100);
  const { data: seasonsData, isLoading: seasonsLoading } = useCropSeasons(1, 100);

  const productOptions = (productsData?.items ?? []).map((product) => ({
    id: product.id,
    label: product.name,
    name: product.name,
    status: product.status,
  }));

  const cropSeasonOptions = (seasonsData?.items ?? [])
    .filter((season) => season.status !== "cancelled")
    .map((season) => ({
      id: season.id,
      label: `${season.seasonName} · ${season.cropType}`,
      productId: season.productId,
    }));

  return (
    <ModulePageShell width="work" rightRail={<BatchesWorkflowRail locale={locale} />}>
      <BatchFormShell
        locale={locale}
        productOptions={productOptions}
        productsLoading={productsLoading}
        cropSeasonOptions={cropSeasonOptions}
        cropSeasonsLoading={seasonsLoading}
      />
    </ModulePageShell>
  );
}

interface BatchDetailScreenProps {
  batchId: string;
  locale?: AppLocale;
}

export function BatchDetailScreen({ batchId, locale = getClientLocale() }: BatchDetailScreenProps) {
  const detailCopy = getBatchesCopy(locale).detail;
  const { data: batch } = useBatchDetail(batchId);
  const { data: productsData } = useProducts(1, 100);
  const productName = productsData?.items.find((product) => product.id === batch?.productId)?.name;
  const { data: traceToken } = useTraceTokenForBatch(batchId, Boolean(batch));
  const { isUnavailable: qrUnavailable } = useQrApiAvailable();
  const { mutateAsync: generateQr, isPending: isGeneratingQr } = useGenerateQr();

  const canGenerate = batch?.status === "created" && !traceToken && !qrUnavailable;

  const qrActions = (
    <BatchQrActions
      locale={locale}
      traceToken={traceToken}
      canGenerate={canGenerate}
      isGenerating={isGeneratingQr}
      qrUnavailable={qrUnavailable}
      onGenerate={() => void generateQr(createBatchQrInput(batchId))}
      generateLabel={detailCopy.generateQr}
    />
  );

  const qrDescription =
    traceToken || batch?.status !== "created" ? detailCopy.viewTrace : detailCopy.qrEmpty;

  return (
    <ModulePageShell
      width="work"
      contentClassName="space-y-4"
      rightRail={
        <BatchDetailQrRail locale={locale} description={qrDescription} qrActions={qrActions} />
      }
    >
      <BatchDetailShell
        batchId={batchId}
        locale={locale}
        traceToken={traceToken}
        qrActions={qrActions}
      />
      {batch ? (
        <BatchEditFormShell batch={batch} productName={productName} locale={locale} />
      ) : null}
    </ModulePageShell>
  );
}
