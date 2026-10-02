import type { Metadata } from "next";

import { BuyRequestCreateScreen } from "@/widgets/marketplace";
import { AuthWrapper, MARKETPLACE_BUY_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Đăng yêu cầu mua | VietGreenX" };

export default function MarketplaceBuyCreatePage() {
  return (
    <AuthWrapper requiredRoles={MARKETPLACE_BUY_ROLES}>
      <BuyRequestCreateScreen locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
