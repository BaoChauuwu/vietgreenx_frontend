import type { Metadata } from "next";

import { OrgDashboardScreen } from "@/widgets/org-dashboard";
import { AuthWrapper, ORG_DASHBOARD_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Tổ chức | VietGreenX" };

export default function OrgPage() {
  return (
    <AuthWrapper requiredRoles={ORG_DASHBOARD_ROLES}>
      <OrgDashboardScreen locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
