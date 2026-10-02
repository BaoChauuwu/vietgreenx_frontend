import type { Metadata } from "next";

import { MarketplaceScreen } from "@/widgets/marketplace";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = {
  title: "Chợ nông sản | VietGreenX",
  description: "Kết nối người mua và người bán nông sản sạch",
};

export default function MarketplacePage() {
  return <MarketplaceScreen locale={getRequestLocale()} />;
}
