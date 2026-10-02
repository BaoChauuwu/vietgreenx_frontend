import type { Metadata } from "next";

import { PricingScreen } from "@/widgets/pricing";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = {
  title: "Gói dịch vụ | VietGreenX",
  description: "So sánh các gói Free, Seller, Hợp tác xã & Doanh nghiệp",
};

export default function PricingPage() {
  return <PricingScreen locale={getRequestLocale()} />;
}
