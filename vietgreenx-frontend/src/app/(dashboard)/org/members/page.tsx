import type { Metadata } from "next";

import { OrgMembersScreen } from "@/widgets/org-dashboard";
import { AuthWrapper, ORG_DASHBOARD_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Thành viên tổ chức | VietGreenX" };

export default function MembersPage() {
  return (
    <AuthWrapper requiredRoles={ORG_DASHBOARD_ROLES}>
      <OrgMembersScreen locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
