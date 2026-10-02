import { createService } from "@/shared/api/create-service";

import { userSearchResponseSchema, type UserSearchResponse } from "../model/user-search.schema";

const http = createService("/users");

export const userSearchService = {
  search(q: string, limit = 10): Promise<UserSearchResponse> {
    return http.get<UserSearchResponse>(
      "/search",
      { params: { q, limit } },
      { schema: userSearchResponseSchema },
    );
  },
};
