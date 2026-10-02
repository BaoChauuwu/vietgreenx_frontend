import type { Metadata } from "next";

import { OrgsDirectoryScreen } from "@/widgets/org-dashboard/OrgsDirectoryScreen";
import { ORGS_DIRECTORY_COPY } from "@/features/organization/orgs-directory.copy";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale();
  const t = ORGS_DIRECTORY_COPY[locale];

  return {
    title: `${t.title} | VietGreenX`,
    description: t.subtitle,
  };
}

export default function OrgsDirectoryPage() {
  return <OrgsDirectoryScreen locale={getRequestLocale()} />;
}
