import { createService } from "@/shared/api/create-service";
import { categoryListResponseSchema, type CategoryListResponse } from "@/entities/category";

const http = createService("/categories");

export const categoryClientService = {
  findAll(limit = 100) {
    return http.get<CategoryListResponse>(
      "",
      { params: { limit } },
      { schema: categoryListResponseSchema },
    );
  },
};
