import type { Metadata } from "next";

import { fetchTraceData } from "@/features/traceability";
import { TracePageContent } from "@/widgets/qr/preview";
import { buildMetadata } from "@/shared/seo";

interface PageProps {
  params: { token: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await fetchTraceData(params.token);
  if (!data) {
    return buildMetadata({
      title: "Không tìm thấy sản phẩm",
      path: `/trace/${params.token}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${data.product.name} — ${data.producerSlug || "VietGreenX"}`,
    description: `Truy xuất nguồn gốc: ${data.product.provinceCode} — Thu hoạch ${data.product.harvestDate || data.batch?.harvestDate || ""}`,
    path: `/trace/${params.token}`,
    image: data.farmPhotos?.[0],
    type: "website",
  });
}

export default function TracePage({ params }: PageProps) {
  return <TracePageContent token={params.token} />;
}
