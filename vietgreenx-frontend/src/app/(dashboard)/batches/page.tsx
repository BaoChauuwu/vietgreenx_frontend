import type { Metadata } from "next";

import { Suspense } from "react";
import { BatchListScreen } from "@/widgets/batch-dashboard";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Lô hàng | VietGreenX" };

export default function BatchesPage() {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Đang tải...</div>}>
        <BatchListScreen locale={getRequestLocale()} />
      </Suspense>
    </AuthWrapper>
  );
}
