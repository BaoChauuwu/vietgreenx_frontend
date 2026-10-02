"use client";

import { useMemo, type ReactNode } from "react";

import { PostTagProductsProvider } from "@/features/posts";
import { useMyProductsForPostTags } from "@/features/products";

interface PostTagProductsScopeProps {
  children: ReactNode;
}

/** Compose products → posts at widget boundary (single fetch, no prop drilling). */
export function PostTagProductsScope({ children }: PostTagProductsScopeProps) {
  const { data = [], isLoading } = useMyProductsForPostTags();

  const products = useMemo(
    () => data.map((product) => ({ id: product.id, name: product.name })),
    [data],
  );

  return (
    <PostTagProductsProvider products={products} loading={isLoading}>
      {children}
    </PostTagProductsProvider>
  );
}
