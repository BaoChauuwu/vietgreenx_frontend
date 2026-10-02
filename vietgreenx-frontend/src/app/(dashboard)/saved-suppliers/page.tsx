import type { Metadata } from "next";

import { SavedSuppliersScreen } from "@/widgets/supplier/SavedSuppliersScreen";
import { getSupplierCopy } from "@/features/supplier";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale();
  const t = getSupplierCopy(locale);

  return {
    title: `${t.savedTitle} | VietGreenX`,
    description: t.savedSubtitle,
  };
}

export default function SavedSuppliersPage() {
  return <SavedSuppliersScreen locale={getRequestLocale()} />;
}
