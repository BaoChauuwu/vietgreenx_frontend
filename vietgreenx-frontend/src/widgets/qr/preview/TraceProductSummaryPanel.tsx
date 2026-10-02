/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { CheckCircle2, MapPin, Calendar, QrCode, Sprout } from "lucide-react";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent } from "@/shared/ui/card";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import type { TraceResponse } from "@/entities/trace";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getTraceCopy } from "@/features/traceability";
import { useProvinces, useWardsByProvince } from "@/entities/location/api/location.queries";

interface Props {
  product: TraceResponse["product"];
  batch: TraceResponse["batch"];
  certifications: TraceResponse["certifications"];
  farmPhotos: string[];
  locale?: AppLocale;
}

export function TraceProductSummaryPanel({
  product,
  batch,
  certifications,
  farmPhotos,
  locale = getClientLocale(),
}: Props) {
  const copy = getTraceCopy(locale).preview.summary;
  const [imgError, setImgError] = useState(false);

  const certList = Array.isArray(certifications) ? certifications : [];
  const hasVietgap = certList.some((c) => (c?.certType || "").toLowerCase().includes("vietgap"));
  const hasOrganic = certList.some(
    (c) =>
      (c?.certType || "").toLowerCase().includes("organic") ||
      (c?.certType || "").toLowerCase().includes("hữu cơ"),
  );

  const photoMedias = product?.photoMedias || [];
  const rawCover =
    photoMedias[0]?.cdnUrl ||
    photoMedias[0]?.url ||
    product?.photoMediaIds?.[0] ||
    (farmPhotos && farmPhotos.length > 0 ? farmPhotos[0] : null);

  const resolved = rawCover ? resolveMediaUrl(rawCover) : undefined;
  const coverImage =
    resolved ||
    (rawCover &&
    (rawCover.startsWith("http://") || rawCover.startsWith("https://") || rawCover.startsWith("/"))
      ? rawCover
      : "https://images.unsplash.com/photo-1573246123716-6b1782bfc492?q=80&w=600&auto=format&fit=crop");

  const { data: provinces } = useProvinces();
  const { data: wards } = useWardsByProvince(
    product.provinceCode ? Number(product.provinceCode) : undefined,
  );

  const provinceName = provinces?.find(
    (p) => String(p.code) === String(product.provinceCode),
  )?.name;
  const wardName = wards?.find((w) => String(w.code) === String(product.wardCode))?.name;

  const localZoneName = wardName;

  const location = [product?.productionLocation, localZoneName, provinceName]
    .filter(Boolean)
    .join(", ");

  return (
    <ElevatedCard className="overflow-hidden rounded-2xl border-none bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-12">
          <div className="relative h-48 min-h-[180px] overflow-hidden rounded-xl bg-slate-100 md:col-span-4 md:h-full">
            {!imgError && coverImage ? (
              <>
                <img
                  src={coverImage}
                  alt={product?.name || copy.imgAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-500/10 via-emerald-600/20 to-primary/30 p-4 text-center">
                <Sprout className="mb-2 size-12 text-primary/70" />
                <span className="text-sm font-semibold text-slate-700">{product?.name}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between space-y-4 md:col-span-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold leading-tight text-slate-800">{product.name}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  <CheckCircle2 className="size-3" />
                  {copy.verified}
                </span>
                {hasVietgap && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-600">
                    <CheckCircle2 className="size-3" />
                    VietGAP
                  </span>
                )}
                {hasOrganic && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-bold text-primary">
                    <CheckCircle2 className="size-3" />
                    {copy.organic}
                  </span>
                )}
                {localZoneName || provinceName ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-bold text-primary">
                    <MapPin className="size-3" />
                    {localZoneName ? `${localZoneName}, ` : ""}
                    {provinceName}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-auto grid grid-cols-1 gap-3 text-sm font-medium text-slate-700 sm:grid-cols-2">
              <div className="flex flex-col rounded-xl border border-transparent bg-primary/5 px-4 py-3">
                <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary/70">
                  <QrCode className="size-3.5" /> {copy.qrCodeLabel}
                </span>
                <span className="font-semibold text-slate-800">
                  {batch?.batchCode || copy.noCode}
                </span>
              </div>
              <div className="flex flex-col rounded-xl border border-transparent bg-primary/5 px-4 py-3">
                <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary/70">
                  <Calendar className="size-3.5" /> {copy.harvestDateLabel}
                </span>
                <span className="font-semibold text-slate-800">
                  {batch?.harvestDate || product.harvestDate || copy.updating}
                </span>
              </div>
              <div className="flex flex-col rounded-xl border border-transparent bg-primary/5 px-4 py-3 sm:col-span-2">
                <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary/70">
                  <MapPin className="size-3.5" /> {copy.addressLabel}
                </span>
                <span className="font-semibold text-slate-800">{location || copy.updating}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
