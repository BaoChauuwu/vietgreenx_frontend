import type { Metadata } from "next";
import { QuotationScreen } from "@/widgets/quotation";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";
import { QUOTATION_COPY } from "@/features/quotation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale();
  const t = QUOTATION_COPY[locale];

  return {
    title: `${t.title} | VietGreenX`,
    description: t.subtitle,
  };
}

export default function QuotationsPage() {
  return <QuotationScreen locale={getRequestLocale()} />;
}
