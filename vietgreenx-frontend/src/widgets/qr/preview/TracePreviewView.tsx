"use client";

import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import type { PublicGreenProfile } from "@/entities/green-profile";
import type {
  TraceResponse,
  TraceProductMedia,
  TraceReviewSummary,
  TraceVerificationStatus,
} from "@/entities/trace";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getTraceCopy } from "@/features/traceability";
import { ShieldCheck } from "lucide-react";

// Direct imports to break the circular dependency (index.ts re-exports this file)
import { TraceProductSummaryPanel } from "./TraceProductSummaryPanel";
import { TraceBlockchainHashPanel } from "./TraceBlockchainHashPanel";
import { TraceProducerInfoPanel } from "./TraceProducerInfoPanel";
import { TraceTimelinePanel } from "./TraceTimelinePanel";
import { TracePhotosPanel } from "./TracePhotosPanel";
import { TraceCertificationsPanel } from "./TraceCertificationsPanel";
import { TraceReviewsPanel } from "./TraceReviewsPanel";
import { TraceContactSidebar } from "./TraceContactSidebar";

interface TracePreviewViewProps {
  data?: TraceResponse | Record<string, unknown>;
  producerProfile?: PublicGreenProfile | null;
  headerNode?: React.ReactNode;
  locale?: AppLocale;
}

export function TracePreviewView({
  data,
  producerProfile,
  headerNode,
  locale = getClientLocale(),
}: TracePreviewViewProps) {
  const copy = getTraceCopy(locale);
  const viewCopy = copy.preview;

  const d = (data || {}) as Record<string, unknown>;
  const prod = (d.product || {}) as Record<string, unknown>;
  const batch = (d.batch || null) as Record<string, unknown> | null;

  const hasRealData = Object.keys(d).length > 0 || !!d.token;

  const productObj = {
    id: (prod.id as string) || "prod-1",
    categoryId: (prod.categoryId as string) || "cat-1",
    name:
      (d.productName as string) ||
      (prod.name as string) ||
      (hasRealData ? viewCopy.defaults.traceProduct : viewCopy.defaults.demoProduct),
    slug: (prod.slug as string) || "rau-cai-sach",
    description:
      (prod.description as string) ||
      (hasRealData ? viewCopy.defaults.traceDescription : viewCopy.defaults.demoDescription),
    productionLocation:
      (prod.productionLocation as string) ||
      (d.productionLocation as string) ||
      (hasRealData ? "" : viewCopy.defaults.demoLocation),
    provinceCode:
      (prod.provinceCode as string) ||
      ("provinceCode" in d && d.provinceCode ? String(d.provinceCode) : ""),
    districtCode:
      (prod.districtCode as string) ||
      ("districtCode" in d && d.districtCode ? String(d.districtCode) : ""),
    harvestDate:
      (prod.harvestDate as string) ||
      (d.harvestDate as string) ||
      (batch?.harvestDate as string) ||
      (hasRealData ? viewCopy.contact.notUpdated : "20/05/2026"),
    priceReference: (prod.priceReference as number) ?? null,
    priceUnit: (prod.priceUnit as string) ?? null,
    availableQuantity: (prod.availableQuantity as number) ?? null,
    qualityStandards: (prod.qualityStandards as string[]) || (hasRealData ? [] : ["VietGAP"]),
    certificationIds: (prod.certificationIds as string[]) || [],
    photoMediaIds: (prod.photoMediaIds as string[]) || [],
    photoMedias: (prod.photoMedias as TraceProductMedia[]) || [],
    status: (prod.status as "draft" | "active" | "out_of_stock" | "archived") || "active",
    createdAt: (prod.createdAt as string) || new Date().toISOString(),
    updatedAt: (prod.updatedAt as string) || new Date().toISOString(),
  };

  const certifications =
    Array.isArray(d.certifications) && (d.certifications.length > 0 || hasRealData)
      ? (d.certifications as {
          certType: string;
          certNumber?: string;
          issuingAuthority?: string;
          issueDate?: string;
          expiryDate?: string;
          documentUrl?: string;
          validityStatus?: string;
        }[])
      : [
          {
            certType: "VietGAP",
            issuingAuthority: viewCopy.defaults.goodAgriPractice,
            expiryDate: "2025-12-31",
          },
          {
            certType: viewCopy.defaults.organicCert,
            issuingAuthority: viewCopy.defaults.internationalCert,
            expiryDate: "2025-06-15",
          },
          {
            certType: "ISO 22000:2018",
            issuingAuthority: viewCopy.defaults.foodSafety,
            expiryDate: "2025-09-22",
          },
        ];

  const rawPhotos =
    Array.isArray(d.farmPhotos) && (d.farmPhotos.length > 0 || hasRealData)
      ? (d.farmPhotos as string[])
      : typeof d.imageUrl === "string"
        ? [d.imageUrl]
        : [
            "https://images.unsplash.com/photo-1573246123716-6b1782bfc492?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1524486061537-8ad15938e1a3?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1592424005697-3f958742cc1e?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&auto=format&fit=crop",
          ];

  const farmPhotos = rawPhotos.map((url) => {
    if (!url)
      return "https://images.unsplash.com/photo-1573246123716-6b1782bfc492?q=80&w=600&auto=format&fit=crop";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) return url;
    return (
      resolveMediaUrl(url) ||
      "https://images.unsplash.com/photo-1573246123716-6b1782bfc492?q=80&w=600&auto=format&fit=crop"
    );
  });

  const milestones = Array.isArray(d.milestones)
    ? (d.milestones as {
        milestone: string;
        logs: { id: string; logDate: string; activityType: string }[];
      }[])
    : [];

  const producerName =
    (producerProfile?.profileName as string) ||
    (d.producerName as string) ||
    (d.producerSlug as string) ||
    (hasRealData ? viewCopy.producerFallback : viewCopy.defaults.demoFarmName);
  const producerSlug = (d.producerSlug as string) || (hasRealData ? null : "greenlife-farm");

  return (
    <div className="vgx-social-canvas min-h-[100dvh] py-8">
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        {headerNode && <div className="mb-8">{headerNode}</div>}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight text-slate-800">
              {viewCopy.pageTitle}
            </h1>
            <p className="text-sm font-medium text-slate-500">{viewCopy.pageSubtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Left / Main Column (Summary, Producer, Timeline, Photos, Certifications, Reviews) */}
          <div className="min-w-0 space-y-3 lg:col-span-2">
            <TraceProductSummaryPanel
              locale={locale}
              product={productObj}
              batch={
                batch as unknown as {
                  id: string;
                  productId: string;
                  batchCode: string;
                  harvestDate: string;
                  manufactureDate: string | null;
                  expiryDate: string | null;
                  quantity: number | null;
                  soldQuantity: number | null;
                  notes: string | null;
                  status: string;
                }
              }
              certifications={
                certifications as unknown as {
                  certType: string;
                  certNumber: string;
                  issuingAuthority: string;
                  issueDate: string;
                  expiryDate: string;
                  documentUrl: string;
                  validityStatus: string;
                }[]
              }
              farmPhotos={farmPhotos}
            />
            <TraceBlockchainHashPanel
              verificationStatus={d.verificationStatus as TraceVerificationStatus}
              locale={locale}
            />
            <TraceProducerInfoPanel
              locale={locale}
              producerName={producerName}
              product={productObj}
              producerProfile={producerProfile}
            />
            <TraceTimelinePanel
              milestones={
                milestones as unknown as {
                  milestone: string;
                  logs: {
                    id: string;
                    logDate: string;
                    activityType: string;
                    inputMaterial: string | null;
                    dosage: string | null;
                    dosageUnit: string | null;
                    notes: string | null;
                    weather: string | null;
                    pestStatus: string | null;
                    estimatedYield: number | null;
                    mediaIds: string[];
                    createdAt: string;
                  }[];
                }[]
              }
              locale={locale}
            />
            <TracePhotosPanel photos={farmPhotos} locale={locale} />
            <TraceCertificationsPanel
              locale={locale}
              certifications={
                certifications as unknown as {
                  certType: string;
                  certNumber: string;
                  issuingAuthority: string;
                  issueDate: string;
                  expiryDate: string;
                  documentUrl: string;
                  validityStatus: string;
                }[]
              }
            />
          </div>

          {/* Right Column (Sidebar with Contact Info, Location, QR Code) */}
          <div className="min-w-0 lg:col-span-1">
            <TraceContactSidebar
              producerSlug={producerSlug}
              producerProfile={producerProfile}
              product={d.product as TraceResponse["product"]}
              batchCode={(batch?.batchCode as string) || (d.token as string) || null}
              token={(d.token as string) || null}
              locale={locale}
            />
          </div>
        </div>

        <div className="mt-6">
          <TraceReviewsPanel
            token={(d.token as string) || (d.id as string) || ""}
            reviewsSummary={d.reviews as TraceReviewSummary}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
