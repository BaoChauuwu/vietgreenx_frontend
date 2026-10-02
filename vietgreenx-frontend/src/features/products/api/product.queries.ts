"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Product } from "@/entities/product";
import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import type { CreateProductInput, UpdateProductInput } from "../model/product-input.schema";
import { getProductsCopy } from "../products.constants";
import { productService } from "./product.service";

const PRODUCT_STALE_MS = 60_000;
const POST_TAG_PRODUCT_PAGE_SIZE = 50;
const POST_TAG_PRODUCT_MAX_PAGES = 10;

export const productKeys = {
  all: ["products"] as const,
  list: (page: number) => [...productKeys.all, "list", page] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
  forPostTags: () => [...productKeys.all, "post-tags"] as const,
};

async function listActiveProductsForPostTags(): Promise<Product[]> {
  const active: Product[] = [];
  let page = 1;
  let totalPage = 1;

  while (page <= totalPage && page <= POST_TAG_PRODUCT_MAX_PAGES) {
    const result = await productService.list(page, POST_TAG_PRODUCT_PAGE_SIZE);
    totalPage = result.totalPage;
    active.push(...result.items.filter((item) => item.status === "active"));
    page += 1;
  }

  return active;
}

export function useMyProductsForPostTags() {
  const { user } = useUser();

  return useQuery({
    queryKey: productKeys.forPostTags(),
    enabled: Boolean(user?.id),
    queryFn: listActiveProductsForPostTags,
    staleTime: PRODUCT_STALE_MS,
    retry: false,
  });
}

export function useProducts(page = 1, limit = 20) {
  const { user } = useUser();

  return useQuery({
    queryKey: productKeys.list(page),
    queryFn: () => productService.list(page, limit),
    staleTime: PRODUCT_STALE_MS,
    enabled: Boolean(user?.id),
  });
}

export function useProduct(productId: string) {
  const { user } = useUser();

  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productService.byId(productId),
    enabled: Boolean(user?.id) && Boolean(productId),
    staleTime: PRODUCT_STALE_MS,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  const toast = getProductsCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: (input: CreateProductInput) => productService.create(input),
    onSuccess: () => {
      toastService.success(toast.createSuccess);
      void qc.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: () => {
      toastService.error(toast.createError);
    },
  });
}

export function useUpdateProduct(productId: string) {
  const qc = useQueryClient();
  const toast = getProductsCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: (input: UpdateProductInput) => productService.update(productId, input),
    onSuccess: () => {
      toastService.success(toast.updateSuccess);
      void qc.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: () => {
      toastService.error(toast.updateError);
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  const toast = getProductsCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: (productId: string) => productService.archive(productId),
    onSuccess: () => {
      toastService.success(toast.deleteSuccess);
      void qc.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: () => {
      toastService.error(toast.deleteError);
    },
  });
}
