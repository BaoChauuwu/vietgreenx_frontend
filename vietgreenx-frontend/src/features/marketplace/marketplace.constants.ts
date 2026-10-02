import type { AppLocale } from "@/shared/i18n/locale";

import type { MarketplaceListing, MarketplaceTab } from "./marketplace.types";

export const MARKETPLACE_TABS: MarketplaceTab[] = ["all", "sell", "buy"];

const MARKETPLACE_COPY = {
  vi: {
    hub: {
      title: "Chợ nông sản",
      subtitle: "Kết nối B2B — đăng bán, đăng mua, trao đổi báo giá qua chat.",
      postSell: "Đăng bán",
      postBuy: "Đăng mua",
      emptyTitle: "Chưa có tin phù hợp",
      emptyDescription: "Thử đổi bộ lọc hoặc đăng tin bán / yêu cầu mua mới.",
      layoutNote: "Dữ liệu mẫu — layout preview, chưa kết nối API.",
    },
    tabs: {
      all: "Tất cả",
      sell: "Đang bán",
      buy: "Cần mua",
    },
    kind: {
      sell: "Đăng bán",
      buy: "Cần mua",
    },
    card: {
      quantity: "Số lượng",
      province: "Khu vực",
      price: "Giá",
      deadline: "Hạn",
      verified: "Đã xác minh",
      viewDetail: "Xem chi tiết",
    },
    sellForm: {
      createTitle: "Đăng tin bán",
      subtitle: "Kết nối người mua B2B — không thanh toán trên nền tảng.",
      comingSoon: "Form đầy đủ sẽ được kết nối API ở sprint tiếp theo.",
      labels: {
        title: "Tên bài đăng bán nông sản*",
        category: "Danh mục nông sản*",
        province: "Khu vực (Tỉnh / Thành phố)",
        quantity: "Số lượng bán*",
        price: "Đơn giá tham khảo (VNĐ/{unit})",
        description: "Mô tả nông sản / Phương thức vận chuyển",
      },
      placeholders: {
        title: "VD: Cần bán 10 tấn Dưa hấu tươi tại ruộng",
        categoryLoading: "Đang tải danh mục...",
        provinceSelect: "-- Chọn Tỉnh / Thành phố --",
        quantity: "VD: 500",
        price: "Để trống nếu thương lượng",
        description:
          "Mô tả về tiêu chuẩn chất lượng (VietGAP/Hữu cơ), thời gian thu hoạch, địa điểm...",
      },
      fields: {
        product: "Sản phẩm",
        quantity: "Số lượng",
        unit: "Đơn vị",
        price: "Giá tham khảo",
        province: "Tỉnh / thành",
        description: "Mô tả",
        duration: "Thời hạn đăng (ngày)",
      },
      save: "Đăng tin",
      cancel: "Huỷ",
    },
    buyForm: {
      createTitle: "Đăng yêu cầu mua",
      subtitle: "Tìm nguồn hàng có chứng nhận — nhận báo giá qua chat.",
      comingSoon: "Form đầy đủ sẽ được kết nối API ở sprint tiếp theo.",
      labels: {
        title: "Tên bài thu mua nông sản*",
        category: "Danh mục nông sản*",
        province: "Khu vực ưu tiên (Tỉnh / Thành phố)",
        quantity: "Số lượng cần mua*",
        price: "Đơn giá thu mua tham khảo (VNĐ/{unit})",
        description: "Yêu cầu tiêu chuẩn / Quy cách đóng gói",
      },
      placeholders: {
        title: "VD: Cần thu mua 20 tấn Dưa hấu xuất khẩu",
        categoryLoading: "Đang tải danh mục...",
        provinceSelect: "-- Chọn Tỉnh / Thành phố --",
        quantity: "VD: 1000",
        price: "Để trống nếu thương lượng",
        description:
          "Yêu cầu chứng nhận (VietGAP/GlobalGAP), kích thước trái, tiêu chuẩn xuất khẩu...",
      },
      fields: {
        product: "Sản phẩm cần mua",
        quantity: "Số lượng",
        unit: "Đơn vị",
        certRequirements: "Yêu cầu chứng nhận",
        province: "Tỉnh ưu tiên",
        price: "Ngân sách tham khảo",
        deadline: "Hạn cần hàng",
        description: "Ghi chú thêm",
      },
      save: "Đăng yêu cầu",
      cancel: "Huỷ",
    },
    detail: {
      title: "Chi tiết giao dịch",
      posted: "Đăng ngày",
      org: "Đơn vị",
      certifications: "Chứng nhận",
      description: "Mô tả",
      connectTitle: "Kết nối B2B",
      connectNote: "Trao đổi và báo giá qua chat — không thanh toán trên VietGreenX.",
      chat: "Nhắn tin",
      sendQuote: "Gửi báo giá",
      trace: "Xem truy xuất",
      memberDefault: "Thành viên VietGreenX",
      negotiable: "Thương lượng",
      defaultProduct: "Nông sản",
    },
  },
  en: {
    hub: {
      title: "Marketplace",
      subtitle: "B2B connect — post sell offers, buy requests, and negotiate via chat.",
      postSell: "Post sell offer",
      postBuy: "Post buy request",
      emptyTitle: "No matching listings",
      emptyDescription: "Try another filter or post a new sell / buy listing.",
      layoutNote: "Sample data — layout preview, API not connected yet.",
    },
    tabs: {
      all: "All",
      sell: "Selling",
      buy: "Buying",
    },
    kind: {
      sell: "Sell offer",
      buy: "Buy request",
    },
    card: {
      quantity: "Quantity",
      province: "Region",
      price: "Price",
      deadline: "Deadline",
      verified: "Verified",
      viewDetail: "View details",
    },
    sellForm: {
      createTitle: "Post sell offer",
      subtitle: "Connect with B2B buyers — no checkout on platform.",
      comingSoon: "Full form will connect to API in the next sprint.",
      labels: {
        title: "Agricultural sell offer title*",
        category: "Category*",
        province: "Region (Province / City)",
        quantity: "Sell quantity*",
        price: "Reference unit price (VND/{unit})",
        description: "Produce description / Shipping method",
      },
      placeholders: {
        title: "e.g. Selling 10 tons of fresh Watermelon at farm",
        categoryLoading: "Loading categories...",
        provinceSelect: "-- Select Province / City --",
        quantity: "e.g. 500",
        price: "Leave blank if negotiable",
        description:
          "Description of quality standards (VietGAP/Organic), harvest time, location...",
      },
      fields: {
        product: "Product",
        quantity: "Quantity",
        unit: "Unit",
        price: "Reference price",
        province: "Province",
        description: "Description",
        duration: "Listing duration (days)",
      },
      save: "Post listing",
      cancel: "Cancel",
    },
    buyForm: {
      createTitle: "Post buy request",
      subtitle: "Find certified supply — receive quotes via chat.",
      comingSoon: "Full form will connect to API in the next sprint.",
      labels: {
        title: "Agricultural buy request title*",
        category: "Category*",
        province: "Preferred region (Province / City)",
        quantity: "Quantity needed*",
        price: "Reference buying price (VND/{unit})",
        description: "Quality requirements / Packaging specs",
      },
      placeholders: {
        title: "e.g. Buying 20 tons of export Watermelon",
        categoryLoading: "Loading categories...",
        provinceSelect: "-- Select Province / City --",
        quantity: "e.g. 1000",
        price: "Leave blank if negotiable",
        description:
          "Certification requirements (VietGAP/GlobalGAP), fruit size, export standards...",
      },
      fields: {
        product: "Product needed",
        quantity: "Quantity",
        unit: "Unit",
        certRequirements: "Certification requirements",
        province: "Preferred province",
        price: "Budget reference",
        deadline: "Needed by",
        description: "Additional notes",
      },
      save: "Post request",
      cancel: "Cancel",
    },
    detail: {
      title: "Trade listing",
      posted: "Posted",
      org: "Organization",
      certifications: "Certifications",
      description: "Description",
      connectTitle: "B2B connect",
      connectNote: "Negotiate and quote via chat — no payment on VietGreenX.",
      chat: "Message",
      sendQuote: "Send quote",
      trace: "View trace",
      memberDefault: "VietGreenX Member",
      negotiable: "Negotiable",
      defaultProduct: "Produce",
    },
  },
} as const;

/** Layout preview only — replace with API in marketplace.queries.ts */
export const LAYOUT_PREVIEW_LISTINGS: MarketplaceListing[] = [
  {
    id: "demo-sell-1",
    kind: "sell",
    title: "Lúa ST25 hữu cơ — vụ Đông Xuân",
    productName: "Lúa ST25",
    quantity: 20,
    unit: "tấn",
    provinceCode: "An Giang",
    priceLabel: "Thương lượng",
    certifications: ["VietGAP", "Hữu cơ"],
    orgName: "HTX Nông nghiệp Xanh An",
    orgVerified: true,
    postedAt: "2026-06-01T08:00:00.000Z",
    description: "Lúa tươi thu hoạch tuần trước, đạt chuẩn xuất khẩu EU.",
  },
  {
    id: "demo-buy-1",
    kind: "buy",
    title: "Cần mua sầu riêng Ri6 cấp đông",
    productName: "Sầu riêng Ri6",
    quantity: 5,
    unit: "tấn/tháng",
    provinceCode: "TP. Hồ Chí Minh",
    priceLabel: "Theo báo giá",
    certifications: ["GlobalGAP"],
    orgName: "Công ty TNHH Thực phẩm Xanh",
    orgVerified: true,
    postedAt: "2026-06-02T10:30:00.000Z",
    deadline: "2026-07-15",
    description: "Cần nguồn ổn định 6 tháng, có QR truy xuất.",
  },
  {
    id: "demo-sell-2",
    kind: "sell",
    title: "Cà phê Robusta sơ chế ướt",
    productName: "Cà phê Robusta",
    quantity: 3,
    unit: "tấn",
    provinceCode: "Đắk Lắk",
    priceLabel: "58.000đ/kg",
    certifications: ["4C"],
    orgName: "Hộ NT Nguyễn Văn B",
    orgVerified: false,
    postedAt: "2026-06-03T14:00:00.000Z",
  },
];

export function getMarketplaceCopy(locale: AppLocale) {
  return MARKETPLACE_COPY[locale] ?? MARKETPLACE_COPY.vi;
}

export function filterListingsByTab(
  listings: MarketplaceListing[],
  tab: MarketplaceTab,
): MarketplaceListing[] {
  if (tab === "all") return listings;
  return listings.filter((item) => item.kind === tab);
}
