"use client";

import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent, CardHeader } from "@/shared/ui/card";
import type { TraceResponse } from "@/entities/trace";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getTraceCopy } from "@/features/traceability";

interface Props {
  certifications: TraceResponse["certifications"];
  locale?: AppLocale;
}

export function TraceCertificationsPanel({
  certifications,
  locale = getClientLocale(),
}: Props) {
  const copy = getTraceCopy(locale).preview.certifications;
  if (!certifications || certifications.length === 0) return null;

  return (
    <ElevatedCard className="mt-6 overflow-hidden rounded-2xl border-none bg-white shadow-sm">
      <CardHeader className="px-5 pb-3 pt-5">
        <h3 className="text-base font-bold text-slate-800">{copy.title}</h3>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex snap-x gap-4 overflow-x-auto">
          {certifications.map((cert, i) => {
            const certText = cert?.certType || copy.fallbackType;
            const isIso = certText.toLowerCase().includes("iso");
            const isVietgap = certText.toLowerCase().includes("vietgap");
            const isOrg =
              certText.toLowerCase().includes("hữu cơ") ||
              certText.toLowerCase().includes("organic");

            let badgeText = "CERT";
            let bgClass = "bg-[#f8fafc] border-slate-200";
            let iconBg = "bg-emerald-600";

            if (isVietgap) {
              badgeText = "VG";
              bgClass = "bg-[#eef8f3] border-emerald-100/50";
              iconBg = "bg-emerald-600";
            } else if (isOrg) {
              badgeText = "ORG";
              bgClass = "bg-[#eef8f3] border-emerald-100/50";
              iconBg = "bg-emerald-500";
            } else if (isIso) {
              badgeText = "ISO";
              bgClass = "bg-orange-50 border-orange-100";
              iconBg = "bg-orange-500";
            }

            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl border p-4 ${bgClass} w-72 shrink-0 snap-start`}
              >
                <div
                  className={`size-10 shrink-0 ${iconBg} flex items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm`}
                >
                  {badgeText}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[13px] font-bold text-emerald-700">{cert.certType}</h4>
                  <p className="w-48 truncate text-[11px] leading-tight text-slate-500">
                    {cert.issuingAuthority || copy.fallbackAuthority}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    HHL:{" "}
                    {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString("vi-VN") : "--"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
