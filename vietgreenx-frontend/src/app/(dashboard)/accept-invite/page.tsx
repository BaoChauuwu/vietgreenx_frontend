import { Suspense } from "react";
import type { Metadata } from "next";

import { AcceptInviteScreen } from "@/features/organization";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";
import { ModulePageShell } from "@/shared/ui/module-page-shell";

export const metadata: Metadata = { title: "Lời mời tổ chức | VietGreenX" };

export default function AcceptInvitePage() {
  return (
    <ModulePageShell width="form">
      <Suspense fallback={null}>
        <AcceptInviteScreen locale={getRequestLocale()} />
      </Suspense>
    </ModulePageShell>
  );
}
