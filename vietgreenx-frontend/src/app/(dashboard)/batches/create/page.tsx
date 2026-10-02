import type { Metadata } from "next";

import { BatchCreateScreen } from "@/widgets/batch-dashboard";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Tạo lô hàng | VietGreenX" };

export default function BatchCreatePage() {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <BatchCreateScreen locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
