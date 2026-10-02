// src/app/product/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  JsonLd,
  buildBreadcrumbSchema,
  buildMetadata,
  buildProductSchema,
  type ProductSeoInput,
} from "@/shared/seo";

interface PageProps {
  params: { id: string };
}

async function getProduct(id: string): Promise<ProductSeoInput | null> {
  // const res = await fetch(`${API}/products/${id}`, { next: { revalidate: 600 } });
  void id;
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await getProduct(params.id);
  if (!p)
    return buildMetadata({
      title: "Không tìm thấy sản phẩm",
      path: `/product/${params.id}`,
      noIndex: true,
    });

  return buildMetadata({
    title: p.name,
    description: p.description,
    path: `/product/${p.id}`,
    image: p.imageUrls?.[0],
    type: "website",
  });
}

export default async function ProductPage({ params }: PageProps) {
  const p = await getProduct(params.id);
  if (!p) notFound();

  return (
    <article>
      <JsonLd
        data={[
          buildProductSchema(p),
          buildBreadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Sản phẩm", path: "/product" },
            { name: p.name, path: `/product/${p.id}` },
          ]),
        ]}
      />
      <header>
        <h1>{p.name}</h1>
      </header>
      <section></section>
    </article>
  );
}
