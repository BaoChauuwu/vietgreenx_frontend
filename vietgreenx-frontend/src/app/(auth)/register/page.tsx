import { Suspense } from "react";

import { RegisterForm } from "@/features/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm locale={getRequestLocale()} />
    </Suspense>
  );
}
