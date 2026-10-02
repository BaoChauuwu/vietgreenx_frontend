import type { Metadata } from "next";

import { ProductListScreen } from "@/widgets/product-dashboard";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Sản phẩm của tôi | VietGreenX" };

export default function ProductsPage() {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <ProductListScreen locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
