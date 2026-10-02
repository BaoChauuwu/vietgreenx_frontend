"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { PostTagProductOption } from "../model/post-tag-product";

interface PostTagProductsContextValue {
  products: PostTagProductOption[];
  loading: boolean;
}

const PostTagProductsContext = createContext<PostTagProductsContextValue>({
  products: [],
  loading: false,
});

interface PostTagProductsProviderProps {
  products: PostTagProductOption[];
  loading?: boolean;
  children: ReactNode;
}

/** Widget layer supplies product options; posts UI reads via `usePostTagProducts`. */
export function PostTagProductsProvider({
  products,
  loading = false,
  children,
}: PostTagProductsProviderProps) {
  return (
    <PostTagProductsContext.Provider value={{ products, loading }}>
      {children}
    </PostTagProductsContext.Provider>
  );
}

export function usePostTagProducts() {
  return useContext(PostTagProductsContext);
}
