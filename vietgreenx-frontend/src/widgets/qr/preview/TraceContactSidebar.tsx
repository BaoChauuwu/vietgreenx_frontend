"use client";

import { Phone, MessageCircle, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent, CardHeader } from "@/shared/ui/card";

import type { PublicGreenProfile } from "@/entities/green-profile";
import type { TraceResponse } from "@/entities/trace";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getTraceCopy, TraceQrDialog } from "@/features/traceability";
import { useProvinces, useWardsByProvince } from "@/entities/location/api/location.queries";

interface Props {
  producerSlug: string | null;
  producerProfile?: PublicGreenProfile | null;
  product?: TraceResponse["product"] | null;
  batchCode?: string | null;
  token?: string | null;
  locale?: AppLocale;
}

export function TraceContactSidebar({
  producerSlug,
  producerProfile,
  product,
  batchCode,
  token,
  locale = getClientLocale(),
}: Props) {
  const previewCopy = getTraceCopy(locale).preview;

  const rawProvinceCode = producerProfile?.provinceCode ?? product?.provinceCode;
  const targetProvinceNum =
    rawProvinceCode !== null && rawProvinceCode !== undefined && !isNaN(Number(rawProvinceCode))
      ? Number(rawProvinceCode)
      : undefined;

  const rawWardCode = producerProfile?.wardCode ?? product?.wardCode;
  const targetWardNum =
    rawWardCode !== null && rawWardCode !== undefined && !isNaN(Number(rawWardCode))
      ? Number(rawWardCode)
      : undefined;

  const { data: provinces } = useProvinces();
  const { data: wards } = useWardsByProvince(targetProvinceNum);

  const provinceName = provinces?.find((p) => p.code === targetProvinceNum)?.name;
  const wardName = wards?.find((w) => w.code === targetWardNum)?.name;

  const localZoneName = product?.productionLocation || wardName;

  const hasCoordinates =
    producerProfile?.latitude !== null &&
    producerProfile?.latitude !== undefined &&
    producerProfile?.longitude !== null &&
    producerProfile?.longitude !== undefined;

  const fullLocationQuery = [localZoneName, provinceName].filter(Boolean).join(", ");

  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${producerProfile!.latitude},${producerProfile!.longitude}`
    : fullLocationQuery
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullLocationQuery)}`
      : null;

  return (
    <div className="sticky top-6 space-y-3">
      {/* Contact Card */}
      <ElevatedCard className="overflow-hidden rounded-2xl border-none bg-white shadow-sm">
        <CardHeader className="px-5 pb-3 pt-5">
          <h3 className="text-[13px] font-bold text-slate-800">{previewCopy.contact.title}</h3>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <Phone className="size-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">
                  {previewCopy.contact.phone}
                </p>
                <p className="text-[13px] font-bold text-slate-800">
                  {producerProfile?.phone || previewCopy.contact.notUpdated}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="size-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">
                  {previewCopy.contact.chat}
                </p>
                <p className="text-[13px] font-bold text-slate-800">
                  {producerProfile?.website ||
                    producerProfile?.email ||
                    previewCopy.contact.notUpdated}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                <MapPin className="size-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">
                  {previewCopy.contact.address}
                </p>
                <p className="text-[13px] font-bold text-slate-800">
                  {[localZoneName, provinceName].filter(Boolean).join(", ") ||
                    previewCopy.contact.notUpdated}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-2">
            <Button className="w-full font-bold shadow-none">
              {previewCopy.contact.contactNow}
            </Button>
            <Button
              variant="outline"
              className="w-full border-primary/20 font-bold text-primary shadow-none hover:bg-primary/5"
            >
              {previewCopy.contact.message}
            </Button>
          </div>
        </CardContent>
      </ElevatedCard>

      {/* Map Card */}
      <ElevatedCard className="overflow-hidden rounded-2xl border-none bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between px-5 pb-3 pt-5">
          <h3 className="text-[13px] font-bold text-slate-800">{previewCopy.map.title}</h3>
          {googleMapsUrl ? (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
            >
              Google Maps
              <ExternalLink className="size-3" />
            </a>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-5">
          {googleMapsUrl ? (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-primary/5 transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="absolute inset-0 bg-primary/10 opacity-40 transition-opacity group-hover:opacity-60"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-1 text-primary transition-transform group-hover:scale-110">
                  <svg
                    width="24"
                    height="32"
                    viewBox="0 0 24 32"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37258 18.6274 0 12 0ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16Z" />
                  </svg>
                </div>
                <div className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                  {producerProfile?.profileName || provinceName || previewCopy.map.notUpdated}
                </div>
              </div>
              <div className="absolute bottom-2 right-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                {previewCopy.map.openMapHint}
              </div>
            </a>
          ) : (
            <div className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-primary/5">
              <div className="absolute inset-0 bg-primary/10 opacity-40"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-1 text-primary">
                  <svg
                    width="24"
                    height="32"
                    viewBox="0 0 24 32"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37258 18.6274 0 12 0ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16Z" />
                  </svg>
                </div>
                <div className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                  {producerProfile?.profileName || previewCopy.map.notUpdated}
                </div>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2 pt-1">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-[12px] font-bold text-slate-800">
                {provinceName || previewCopy.map.notUpdated}
              </p>
              <p className="text-[10px] text-slate-500">
                {localZoneName || previewCopy.map.notUpdated} •{" "}
                {producerProfile?.latitude !== null && producerProfile?.latitude !== undefined
                  ? `${producerProfile.latitude.toFixed(4)}°N`
                  : previewCopy.map.notUpdated}
                ,{" "}
                {producerProfile?.longitude !== null && producerProfile?.longitude !== undefined
                  ? `${producerProfile.longitude.toFixed(4)}°E`
                  : previewCopy.map.notUpdated}
              </p>
            </div>
          </div>
        </CardContent>
      </ElevatedCard>

      {/* QR Code Card */}
      <ElevatedCard className="overflow-hidden rounded-2xl border-none bg-white shadow-sm">
        <CardHeader className="px-5 pb-3 pt-5">
          <h3 className="text-[13px] font-bold text-slate-800">{previewCopy.qr.title}</h3>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-[#f8fafc] p-1.5">
              <svg viewBox="0 0 100 100" className="h-full w-full text-primary" fill="currentColor">
                <path d="M10 10h30v30h-30zM20 20h10v10h-10zM60 10h30v30h-30zM70 20h10v10h-10zM10 60h30v30h-30zM20 70h10v10h-10zM50 50h10v10h-10zM70 60h10v10h-10zM60 70h10v10h-10zM80 70h10v10h-10zM70 80h10v10h-10z" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-primary">
                {batchCode || producerSlug || previewCopy.qr.fallbackCode}
              </p>
              <p className="text-[11px] leading-tight text-slate-500">{previewCopy.qr.scanHint}</p>
              <TraceQrDialog
                token={token || batchCode || producerSlug || ""}
                trigger={
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 bg-primary/10 px-3 text-[10px] text-primary hover:bg-primary/20"
                  >
                    {previewCopy.qr.download}
                  </Button>
                }
              />
            </div>
          </div>
        </CardContent>
      </ElevatedCard>
    </div>
  );
}
