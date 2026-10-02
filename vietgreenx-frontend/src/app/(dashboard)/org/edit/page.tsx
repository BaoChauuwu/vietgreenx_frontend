import type { Metadata } from "next";

import { OrgEditScreen } from "@/widgets/org-dashboard";
import { AuthWrapper, ORG_EDIT_ROLES } from "@/shared/auth";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Chỉnh sửa tổ chức | VietGreenX" };

export default function OrgEditPage() {
  return (
    <AuthWrapper requiredRoles={ORG_EDIT_ROLES}>
      <OrgEditScreen locale={getRequestLocale()} />
    </AuthWrapper>
  );
}
