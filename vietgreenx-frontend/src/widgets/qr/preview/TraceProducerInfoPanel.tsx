"use client";

import { CheckCircle2, Phone, MapPin } from "lucide-react";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent, CardHeader } from "@/shared/ui/card";
import type { TraceResponse } from "@/entities/trace";
import type { PublicGreenProfile } from "@/entities/green-profile";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getTraceCopy } from "@/features/traceability";
import { useProvinces, useWardsByProvince } from "@/entities/location/api/location.queries";

interface Props {
  producerName: string;
  product: TraceResponse["product"];
  producerProfile?: PublicGreenProfile | null;
  locale?: AppLocale;
}

export function TraceProducerInfoPanel({
  producerName,
  product,
  producerProfile,
  locale = getClientLocale(),
}: Props) {
  const copy = getTraceCopy(locale).preview.producer;
  const safeName = producerName || "GreenLife";
  const initials = safeName.substring(0, 2).toUpperCase();

  const targetProvinceCode = producerProfile?.provinceCode || product?.provinceCode;
  const targetWardCode = producerProfile?.wardCode || product?.wardCode;

  const { data: provinces } = useProvinces();
  const { data: wards } = useWardsByProvince(
    targetProvinceCode ? Number(targetProvinceCode) : undefined,
  );

  const provinceName = provinces?.find((p) => String(p.code) === String(targetProvinceCode))?.name;
  const wardName = wards?.find((w) => String(w.code) === String(targetWardCode))?.name;

  const localZoneName = wardName;
  const location = [localZoneName, provinceName].filter(Boolean).join(", ");

  return (
    <ElevatedCard className="mt-6 overflow-hidden rounded-2xl border-none bg-white shadow-sm">
      <CardHeader className="px-5 pb-3 pt-5">
        <h3 className="text-base font-bold text-slate-800">{copy.title}</h3>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Producer Info */}
          <div className="rounded-xl border border-slate-100/60 bg-[#f8fafc] p-5">
            <h4 className="mb-3 text-[13px] font-bold text-slate-800">{copy.producerLabel}</h4>
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl font-bold text-primary shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-1.5 truncate text-sm font-bold text-slate-800">
                  {producerName}
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                </div>
                <p className="flex items-center gap-1.5 truncate text-[13px] text-slate-500">
                  <MapPin className="size-3.5 shrink-0" /> {location || copy.locationUpdating}
                </p>
                <p className="flex items-center gap-1.5 truncate text-[13px] text-slate-500">
                  <Phone className="size-3.5 shrink-0" />{" "}
                  {producerProfile?.phone || copy.phoneNotUpdated}
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                    <CheckCircle2 className="size-3" />
                    {copy.verified}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Production Info */}
          <div className="flex flex-col justify-center rounded-xl border border-slate-100/60 bg-[#f8fafc] p-5">
            <h4 className="mb-3 text-[13px] font-bold text-slate-800">
              {copy.productionInfoTitle}
            </h4>
            <div className="space-y-2.5 text-[13px]">
              <p className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">{copy.mainProduct}</span>
                <span className="font-semibold text-slate-800">{product.name}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-500">{copy.area}</span>
                <span className="font-semibold text-slate-800">
                  {producerProfile?.farmAreaHa
                    ? `${producerProfile.farmAreaHa} ha`
                    : copy.areaUpdating}
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
