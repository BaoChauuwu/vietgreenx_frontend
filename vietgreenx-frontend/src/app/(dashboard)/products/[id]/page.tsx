import type { Metadata } from "next";

import { ProductDetailScreen } from "@/widgets/product-dashboard";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = { title: "Chi tiết sản phẩm | VietGreenX" };

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <ProductDetailScreen productId={params.id} locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
