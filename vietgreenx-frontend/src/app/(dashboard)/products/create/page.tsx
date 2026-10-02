import type { Metadata } from "next";

import { ProductCreateScreen } from "@/widgets/product-dashboard";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Thêm sản phẩm | VietGreenX" };

export default function ProductCreatePage() {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <ProductCreateScreen locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
