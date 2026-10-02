import type { Metadata } from "next";

import { GreenProfileSeasonsScreen } from "@/widgets/green-profile";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = { title: "Quản lý mùa vụ | VietGreenX" };

export default function CropSeasonsPage({ params }: PageProps) {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <GreenProfileSeasonsScreen greenProfileId={params.id} locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
