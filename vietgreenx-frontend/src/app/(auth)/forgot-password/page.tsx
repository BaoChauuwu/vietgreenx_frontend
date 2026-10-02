import { Suspense } from "react";
import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/features/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Quên mật khẩu | VietGreenX" };

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm locale={getRequestLocale()} />
    </Suspense>
  );
}
