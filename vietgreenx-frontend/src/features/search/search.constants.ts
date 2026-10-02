import type { AppLocale } from "@/shared/i18n/locale";
import { ROUTES } from "@/shared/routing";
import type { SearchResultItem, SearchTab } from "./search.types";

export const SEARCH_TABS: SearchTab[] = ["all", "user", "org", "product", "post"];

const SEARCH_COPY = {
  vi: {
    title: "Bộ lọc tìm kiếm",
    subtitle: "Theo chuẩn VietGreenX",
    keywordPrefix: "Từ khóa:",
    categoryHeader: "Danh mục",
    placeholder: "Tìm người dùng, tổ chức, sản phẩm, bài viết...",
    submit: "Tìm",
    layoutNote: "Kết quả mẫu — layout preview, chưa kết nối API.",
    emptyQuery: "Nhập từ khóa để bắt đầu tìm kiếm.",
    emptyResults: "Không có kết quả phù hợp",
    emptyResultsHint: "Thử từ khóa khác hoặc đổi bộ lọc.",
    kind: {
      user: "Người dùng",
      org: "Tổ chức",
      product: "Sản phẩm",
      post: "Bài viết",
    },
    tabs: {
      all: "Tất cả",
      posts: "Bài viết",
      users: "Mọi người / Người bán",
      products: "Sản phẩm / Nông sản",
      user: "Người dùng",
      org: "Tổ chức",
      product: "Sản phẩm",
      post: "Bài viết",
    },
    sections: {
      usersTitle: "Mọi người & Người bán",
      usersSubtitle: "Tài khoản cá nhân, hợp tác xã & nhà nông",
      postsTitle: "Bài viết liên quan",
      postsSubtitle: "Cập nhật từ cộng đồng nông sản xanh",
      productsTitle: "Sản phẩm & Nông sản",
      productsSubtitle: "Sản phẩm có nguồn gốc từ vườn",
    },
    actions: {
      seeAll: "Xem tất cả",
      seeMorePosts: "Xem thêm bài viết",
      seeMoreProducts: "Xem thêm sản phẩm",
      viewProfile: "Xem",
      viewProduct: "Xem sản phẩm",
      loadMorePosts: "Tải thêm bài viết",
      loadMoreUsers: "Tải thêm tài khoản",
      loadMoreProducts: "Tải thêm sản phẩm",
    },
    status: {
      active: "Đang bán",
      product: "Nông sản",
      verified: "Đã xác minh",
      originTransparent: "Nguồn gốc minh bạch",
      brand: "Nông sản Việt GreenX",
    },
    empty: {
      initialTitle: "Nhập từ khóa để bắt đầu tìm kiếm",
      initialDescription:
        "Tìm kiếm bài viết, người bán, hợp tác xã hoặc nông sản xanh trên hệ thống VietGreenX.",
      noResultsTitle: "Không tìm thấy kết quả",
      noResultsQuery: (q: string) => `Không thấy thông tin phù hợp với từ khóa "${q}".`,
      noPosts: (q: string) => `Không tìm thấy bài viết nào phù hợp với "${q}".`,
      noUsers: (q: string) => `Không tìm thấy người dùng hoặc người bán phù hợp với "${q}".`,
      noProducts: (q: string) => `Không tìm thấy sản phẩm nào phù hợp với "${q}".`,
      errorTitle: "Không thể tải kết quả",
      errorDescription: "Đã xảy ra lỗi khi kết nối máy chủ. Vui lòng thử lại.",
    },
    rail: {
      title: "Khám phá nhanh",
      marketplace: "Chợ nông sản",
      greenProfile: "Hồ sơ xanh",
    },
  },
  en: {
    title: "Search Filters",
    subtitle: "Powered by VietGreenX",
    keywordPrefix: "Keyword:",
    categoryHeader: "Category",
    placeholder: "Search users, organizations, products, posts...",
    submit: "Search",
    layoutNote: "Sample results — layout preview, API not connected yet.",
    emptyQuery: "Enter a keyword to start searching.",
    emptyResults: "No matching results",
    emptyResultsHint: "Try another keyword or filter.",
    kind: {
      user: "User",
      org: "Organization",
      product: "Product",
      post: "Post",
    },
    tabs: {
      all: "All",
      posts: "Posts",
      users: "People / Sellers",
      products: "Products / Produce",
      user: "Users",
      org: "Organizations",
      product: "Products",
      post: "Posts",
    },
    sections: {
      usersTitle: "People & Sellers",
      usersSubtitle: "Personal accounts, cooperatives & farmers",
      postsTitle: "Related Posts",
      postsSubtitle: "Updates from the green ag community",
      productsTitle: "Products & Produce",
      productsSubtitle: "Farm-sourced agricultural products",
    },
    actions: {
      seeAll: "See all",
      seeMorePosts: "See more posts",
      seeMoreProducts: "See more products",
      viewProfile: "View profile",
      viewProduct: "View product",
      loadMorePosts: "Load more posts",
      loadMoreUsers: "Load more accounts",
      loadMoreProducts: "Load more products",
    },
    status: {
      active: "Active",
      product: "Produce",
      verified: "Verified",
      originTransparent: "Clear origin",
      brand: "VietGreenX Agriculture",
    },
    empty: {
      initialTitle: "Enter keyword to search",
      initialDescription: "Search posts, sellers, cooperatives or produce on VietGreenX.",
      noResultsTitle: "No results found",
      noResultsQuery: (q: string) => `No matching information found for "${q}".`,
      noPosts: (q: string) => `No posts found matching "${q}".`,
      noUsers: (q: string) => `No users or sellers found matching "${q}".`,
      noProducts: (q: string) => `No products found matching "${q}".`,
      errorTitle: "Could not load results",
      errorDescription: "An error occurred connecting to the server. Please try again.",
    },
    rail: {
      title: "Quick explore",
      marketplace: "Marketplace",
      greenProfile: "Green profile",
    },
  },
} as const;

export const LAYOUT_PREVIEW_SEARCH_RESULTS: SearchResultItem[] = [
  {
    id: "user-1",
    kind: "user",
    title: "Nguyễn Văn An",
    subtitle: "Người bán · An Giang",
    href: ROUTES.userProfile("nguyen-van-an"),
  },
  {
    id: "org-1",
    kind: "org",
    title: "HTX Nông nghiệp Xanh An",
    subtitle: "Hợp tác xã · Đã xác minh",
    href: ROUTES.publicOrg("htx-xanh-an"),
  },
  {
    id: "product-1",
    kind: "product",
    title: "Lúa ST25 hữu cơ",
    subtitle: "Sản phẩm · 20 tấn",
    href: ROUTES.productDetail("demo-sell-1"),
  },
  {
    id: "post-1",
    kind: "post",
    title: "Thu hoạch vụ Đông Xuân — ảnh thực tế vườn",
    subtitle: "Bài viết · 2 ngày trước",
    href: ROUTES.post("demo-post-1"),
  },
];

export function getSearchCopy(locale: AppLocale) {
  return SEARCH_COPY[locale] ?? SEARCH_COPY.vi;
}

export function filterSearchResults(
  items: SearchResultItem[],
  tab: SearchTab,
  query: string,
): SearchResultItem[] {
  const normalized = query.trim().toLowerCase();
  let filtered = tab === "all" ? items : items.filter((item) => item.kind === tab);

  if (normalized) {
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.subtitle?.toLowerCase().includes(normalized),
    );
  }

  return filtered;
}
