import { request } from "@/shared/api/api";
import { parseApiResponse } from "@/shared/api/create-service";
import {
  globalSearchOverviewSchema,
  searchPostsResultSchema,
  searchProductsResultSchema,
  searchUsersResultSchema,
  type GlobalSearchOverview,
  type SearchPostsResult,
  type SearchProductsResult,
  type SearchType,
  type SearchUsersResult,
} from "../model/search.schema";

export interface GlobalSearchQueryParams {
  q: string;
  type?: SearchType;
  cursor?: string;
  limit?: number;
}

export const searchService = {
  getOverview: (q: string): Promise<GlobalSearchOverview> =>
    request<unknown>({
      method: "GET",
      url: "/search",
      params: { q },
    }).then((data) => parseApiResponse(data, globalSearchOverviewSchema)),

  searchUsers: (params: {
    q: string;
    cursor?: string;
    limit?: number;
  }): Promise<SearchUsersResult> =>
    request<unknown>({
      method: "GET",
      url: "/search",
      params: { ...params, type: "users" },
    }).then((data) => parseApiResponse(data, searchUsersResultSchema)),

  searchPosts: (params: {
    q: string;
    cursor?: string;
    limit?: number;
  }): Promise<SearchPostsResult> =>
    request<unknown>({
      method: "GET",
      url: "/search",
      params: { ...params, type: "posts" },
    }).then((data) => parseApiResponse(data, searchPostsResultSchema)),

  searchProducts: (params: {
    q: string;
    cursor?: string;
    limit?: number;
  }): Promise<SearchProductsResult> =>
    request<unknown>({
      method: "GET",
      url: "/search",
      params: { ...params, type: "products" },
    }).then((data) => parseApiResponse(data, searchProductsResultSchema)),
};
