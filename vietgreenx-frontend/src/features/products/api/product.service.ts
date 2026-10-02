import { createService } from "@/shared/api/create-service";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import {
  productListSchema,
  productSchema,
  type Product,
  type ProductList,
} from "@/entities/product";

import {
  archiveProductInputSchema,
  createCreateProductInputSchema,
  createUpdateProductInputSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "../model/product-input.schema";

const http = createService("/products");

export const productService = {
  /** GET /products — paginated products for the authenticated seller/org. */
  list(page = 1, limit = 20): Promise<ProductList> {
    return http.get<ProductList>("", { params: { page, limit } }, { schema: productListSchema });
  },

  byId(id: string): Promise<Product> {
    return http.get<Product>(`/${id}`, undefined, { schema: productSchema });
  },

  create(input: CreateProductInput): Promise<Product> {
    const payload = createCreateProductInputSchema(getClientLocale()).parse(input);
    return http.post<Product>("", payload, { schema: productSchema });
  },

  update(id: string, input: UpdateProductInput): Promise<Product> {
    const payload = createUpdateProductInputSchema(getClientLocale()).parse(input);
    return http.patch<Product>(`/${id}`, payload, { schema: productSchema });
  },

  archive(id: string): Promise<Product> {
    const payload = archiveProductInputSchema.parse({ status: "archived" });
    return http.patch<Product>(`/${id}`, payload, { schema: productSchema });
  },
};
