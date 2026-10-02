import type { Metadata } from "next";

import { MarketplaceDetailScreen } from "@/widgets/marketplace";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = { title: "Chi tiết giao dịch | VietGreenX" };

export default function MarketplaceDetailPage({ params }: PageProps) {
  return <MarketplaceDetailScreen listingId={params.id} locale={getRequestLocale()} />;
}
