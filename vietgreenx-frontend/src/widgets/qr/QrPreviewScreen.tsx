import { TracePreviewView } from "./preview";
import type { TraceResponse } from "@/entities/trace";
import { fetchTraceData, fetchPublicGreenProfileData, getTraceCopy } from "@/features/traceability";
import type { AppLocale } from "@/shared/i18n/locale";

// Mock data to preview the UI in dashboard
const DEMO_TRACE_RESPONSE: TraceResponse = {
  token: "demo-token",
  targetType: "product",
  product: {
    id: "prod-1",
    categoryId: "cat-1",
    name: "Rau cải sạch",
    slug: "rau-cai-sach",
    description: "Rau cải trồng theo tiêu chuẩn an toàn",
    productionLocation: "Châu Thành",
    provinceCode: "71", // Bến Tre code
    districtCode: "715", // Châu Thành code
    harvestDate: "20/05/2026",
    priceReference: 25000,
    priceUnit: "kg",
    availableQuantity: 500,
    qualityStandards: ["VietGAP"],
    certificationIds: [],
    photoMediaIds: [],
    photoMedias: [],
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  producerSlug: "greenlife-farm",
  farmPhotos: [
    "https://images.unsplash.com/photo-1573246123716-6b1782bfc492?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=400&auto=format&fit=crop",
  ],
  batch: {
    id: "batch-1",
    productId: "prod-1",
    batchCode: "VGX-RAU-000123",
    harvestDate: "20/05/2026",
    manufactureDate: null,
    expiryDate: null,
    quantity: 1000,
    soldQuantity: 0,
    notes: null,
    status: "active",
  },
  milestones: [
    {
      milestone: "gieo hạt",
      logs: [
        {
          id: "log-1",
          logDate: new Date().toISOString(),
          activityType: "gieo hạt",
          inputMaterial: "Hạt giống F1",
          dosage: "100",
          dosageUnit: "gram",
          notes: "Gieo hạt vụ mới",
          weather: "Nắng nhẹ",
          pestStatus: null,
          estimatedYield: null,
          mediaIds: [],
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      milestone: "chăm sóc",
      logs: [
        {
          id: "log-2",
          logDate: new Date(Date.now() + 86400000).toISOString(), // +1 day
          activityType: "chăm sóc",
          inputMaterial: "Nước",
          dosage: "10",
          dosageUnit: "lít",
          notes: "Tưới nước buổi sáng",
          weather: "Nắng nhẹ",
          pestStatus: null,
          estimatedYield: null,
          mediaIds: [],
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ],
  certifications: [
    {
      certType: "VietGAP",
      certNumber: "VG-12345",
      issuingAuthority: "Cục Trồng Trọt",
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 31536000000).toISOString(), // +1 year
      documentUrl: undefined,
      validityStatus: "valid",
    },
  ],
};

interface QrPreviewScreenProps {
  token?: string;
  locale?: AppLocale;
}

export async function QrPreviewScreen({ token, locale }: QrPreviewScreenProps) {
  const resolvedLocale = locale ?? "vi";
  const qrCopy = getTraceCopy(resolvedLocale).qr;

  let dataToRender: TraceResponse = DEMO_TRACE_RESPONSE;
  let producerProfile = null;

  if (token) {
    const realData = await fetchTraceData(token);
    if (realData) {
      dataToRender = realData;
      if (realData.producerSlug) {
        producerProfile = await fetchPublicGreenProfileData(realData.producerSlug);
      }
    }
  }

  const headerNode = (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">
        {token ? qrCopy.previewTitleWithCode(token.split("-")[0] ?? token) : qrCopy.previewTitle}
      </h1>
      <p className="mt-2 text-slate-500">{qrCopy.previewSubtitle}</p>
    </div>
  );

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50">
      <TracePreviewView
        data={dataToRender}
        producerProfile={producerProfile}
        headerNode={headerNode}
        locale={resolvedLocale}
      />
    </div>
  );
}
