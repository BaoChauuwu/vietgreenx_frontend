import { Suspense } from "react";
import type { Metadata } from "next";

import { ResetPasswordForm } from "@/features/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Đặt lại mật khẩu | VietGreenX" };

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm locale={getRequestLocale()} />
    </Suspense>
  );
}
