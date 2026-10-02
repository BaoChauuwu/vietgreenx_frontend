import type { Metadata } from "next";

import { Suspense } from "react";
import { QRScreen } from "@/widgets/qr";
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Quản lý mã QR | VietGreenX" };

export default function QRPage() {
  return (
    <AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
      <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Đang tải...</div>}>
        <QRScreen locale={getRequestLocale()} />
      </Suspense>
    </AuthWrapper>
  );
}
