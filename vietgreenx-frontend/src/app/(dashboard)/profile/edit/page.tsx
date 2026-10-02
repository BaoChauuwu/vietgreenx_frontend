import type { Metadata } from "next";

import { ProfileEditForm } from "@/features/profile";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";
import { ModulePageShell } from "@/shared/ui/module-page-shell";

export const metadata: Metadata = { title: "Chỉnh sửa hồ sơ | VietGreenX" };

export default function ProfileEditPage() {
  const locale = getRequestLocale();

  return (
    <ModulePageShell width="form">
      <ProfileEditForm locale={locale} />
    </ModulePageShell>
  );
}
