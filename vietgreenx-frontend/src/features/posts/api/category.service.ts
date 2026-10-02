import { createService } from "@/shared/api/create-service";

import { categoryListSchema, type CategoryList } from "../model/category.schema";

const http = createService("/categories");

export const categoryService = {
  /** GET /categories — agriculture catalog (post tagType: category). */
  list(page = 1, limit = 100): Promise<CategoryList> {
    return http.get<CategoryList>("", { params: { page, limit } }, { schema: categoryListSchema });
  },
};
