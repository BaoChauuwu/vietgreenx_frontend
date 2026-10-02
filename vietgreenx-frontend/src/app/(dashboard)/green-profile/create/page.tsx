import type { Metadata } from "next";

import { GreenProfileCreateScreen } from "@/widgets/green-profile";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Tạo hồ sơ xanh | VietGreenX" };

export default function GreenProfileCreatePage() {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <GreenProfileCreateScreen locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
