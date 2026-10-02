import type { Metadata } from "next";

import { GreenProfileLogScreen } from "@/widgets/green-profile";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = { title: "Nhật ký sản xuất | VietGreenX" };

export default function ProductionLogPage({ params }: PageProps) {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <GreenProfileLogScreen greenProfileId={params.id} locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
