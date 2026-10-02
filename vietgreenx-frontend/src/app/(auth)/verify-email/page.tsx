import { Suspense } from "react";

import { VerifyEmailForm } from "@/features/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm locale={getRequestLocale()} />
    </Suspense>
  );
}
