import { Suspense } from "react";

import { LoginForm } from "@/features/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm locale={getRequestLocale()} />
    </Suspense>
  );
}
