import type { Metadata } from "next";

import { GreenProfileEditScreen } from "@/widgets/green-profile";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = { title: "Chỉnh sửa hồ sơ xanh | VietGreenX" };

export default function GreenProfileEditPage({ params }: PageProps) {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <GreenProfileEditScreen greenProfileId={params.id} locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
