import type { Metadata } from "next";

import { BatchDetailScreen } from "@/widgets/batch-dashboard";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = { title: "Chi tiết lô hàng | VietGreenX" };

export default function BatchDetailPage({ params }: PageProps) {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <BatchDetailScreen batchId={params.id} locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
