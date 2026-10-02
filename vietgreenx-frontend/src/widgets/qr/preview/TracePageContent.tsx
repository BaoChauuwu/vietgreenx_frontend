import { notFound } from "next/navigation";
import { JsonLd } from "@/shared/seo";
import { fetchTraceData, fetchPublicGreenProfileData } from "@/features/traceability";
import { TracePreviewView } from "./TracePreviewView";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export async function TracePageContent({ token }: { token: string }) {
  const locale = getRequestLocale();
  const data = await fetchTraceData(token);
  if (!data) notFound();

  const producerData = data.producerSlug
    ? await fetchPublicGreenProfileData(data.producerSlug)
    : null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: data.product.name,
          manufacturer: {
            "@type": "Organization",
            name: producerData?.profileName || data.producerSlug || "VietGreenX",
          },
        }}
      />
      <TracePreviewView data={data} producerProfile={producerData} locale={locale} />
    </>
  );
}
