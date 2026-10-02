import type { Metadata } from "next";

import { SellOfferCreateScreen } from "@/widgets/marketplace";
import { AuthWrapper, MARKETPLACE_SELL_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Đăng bán | VietGreenX" };

export default function MarketplaceSellCreatePage() {
  return (
    <AuthWrapper requiredRoles={MARKETPLACE_SELL_ROLES}>
      <SellOfferCreateScreen locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
