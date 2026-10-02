import type { Metadata } from "next";

import { GreenProfileScreen } from "@/widgets/green-profile";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Hồ sơ xanh | VietGreenX" };

export default function GreenProfilePage() {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <GreenProfileScreen locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
