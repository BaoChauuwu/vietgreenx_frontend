export {
  globalSearchOverviewSchema,
  searchPostsResultSchema,
  searchProductsResultSchema,
  searchTypeSchema,
  searchUsersResultSchema,
} from "./model/search.schema";

export type {
  GlobalSearchOverview,
  SearchPostsResult,
  SearchProductsResult,
  SearchType,
  SearchUsersResult,
  UserSearchItem,
} from "./model/search.schema";

export { searchService } from "./api/search.service";
export {
  searchQueryKeys,
  useGlobalSearchOverview,
  useSearchPostsInfinite,
  useSearchProductsInfinite,
  useSearchUsersInfinite,
} from "./api/search.queries";

export {
  getSearchCopy,
  SEARCH_TABS,
  LAYOUT_PREVIEW_SEARCH_RESULTS,
  filterSearchResults,
} from "./search.constants";
