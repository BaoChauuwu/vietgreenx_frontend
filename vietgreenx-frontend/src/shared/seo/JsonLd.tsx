// src/shared/seo/JsonLd.tsx
// -----------------------------------------------------------------------------
//
//
//   <JsonLd data={buildOrganizationSchema(org)} />
// -----------------------------------------------------------------------------
import type { WithContext, Thing } from "schema-dts";

interface JsonLdProps {
  data: WithContext<Thing> | WithContext<Thing>[];
}

export function JsonLd({ data }: JsonLdProps) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
