"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, Leaf, MapPin, ScanLine } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import type { PublicTraceData } from "../trace.constants";
import { getTraceCopy } from "../trace.constants";

interface PublicTraceScreenProps {
  data: PublicTraceData | Record<string, unknown>;
  producerProfile?: Record<string, unknown>;
  locale?: AppLocale;
}

export function PublicTraceScreen({
  data,
  producerProfile,
  locale = getClientLocale(),
}: PublicTraceScreenProps) {
  const copy = getTraceCopy(locale).public;
  const d = data as Record<string, unknown>;
  const prod = d.product as Record<string, unknown> | undefined;
  const batch = d.batch as Record<string, unknown> | undefined;

  const imageUrl = (d.imageUrl as string) || (d.farmPhotos as string[])?.[0];
  const productName = (d.productName as string) || (prod?.name as string) || copy.fallbackProductName;
  const producerName =
    (producerProfile?.profileName as string) ||
    (d.producerName as string) ||
    (d.producerSlug as string) ||
    "VietGreenX";
  const province = (d.province as string) || (prod?.province as string) || copy.notUpdated;
  const harvestDate =
    (d.harvestDate as string) ||
    (prod?.harvestDate as string) ||
    (batch?.harvestDate as string) ||
    copy.notUpdated;
  const certifications = (d.certifications as unknown[]) || [];
  const milestones = (d.milestones as { milestone?: string; logs?: unknown[] }[]) || [];

  return (
    <main className="min-h-[100dvh] bg-background">
      <div className="mx-auto w-full max-w-lg">
        <div className="relative aspect-[4/3] w-full bg-muted/40">
          {imageUrl ? (
            <Image src={resolveMediaUrl(imageUrl) ?? imageUrl} alt="" fill className="object-cover" priority sizes="480px" />
          ) : (
            <div className="flex size-full items-center justify-center text-primary/40">
              <Leaf className="size-16" />
            </div>
          )}
        </div>

        <div className="space-y-4 px-4 py-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{productName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy.producer}: {producerName}
            </p>
          </div>

          <ElevatedCard>
            <CardContent className="space-y-3 p-4 text-sm">
              <p className="flex items-center gap-2 text-foreground/90">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
                <span>
                  <span className="text-muted-foreground">{copy.region}: </span>
                  {province}
                </span>
              </p>
              <p className="text-foreground/90">
                <span className="text-muted-foreground">{copy.harvest}: </span>
                {harvestDate}
              </p>
              {d.scanCount != null && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <ScanLine className="size-4" aria-hidden />
                  {copy.scanCount}: {String(d.scanCount)}
                </p>
              )}
            </CardContent>
          </ElevatedCard>

          {certifications.length > 0 && (
            <ElevatedCard>
              <CardContent className="p-4">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Award className="size-4 text-secondary-600" />
                  {copy.certifications}
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {certifications.map((cert: unknown, idx: number) => {
                    const certObj = cert as Record<string, unknown> | undefined;
                    const certName =
                      typeof cert === "string"
                        ? cert
                        : (certObj?.certType as string) || copy.fallbackCertType;
                    return (
                      <li
                        key={idx}
                        className="rounded-full border border-primary/20 bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary"
                      >
                        {certName}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </ElevatedCard>
          )}

          <ElevatedCard>
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold text-foreground">{copy.logSummary}</h2>
              {milestones.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {milestones.map((m: { milestone?: string; logs?: unknown[] }, idx: number) => (
                    <li key={idx} className="flex justify-between border-b pb-1 last:border-none">
                      <span className="font-medium text-foreground">{m.milestone}</span>
                      <span>{copy.logCount(m.logs?.length ?? 0)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">—</p>
              )}
            </CardContent>
          </ElevatedCard>

          <div className="flex flex-col gap-2 pt-2">
            <Button className="w-full">{copy.contact}</Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">{copy.fullProfile}</Link>
            </Button>
          </div>

          <p className="pt-4 text-center text-xs text-muted-foreground">{copy.poweredBy}</p>
        </div>
      </div>
    </main>
  );
}
