import type { AppLocale } from "@/shared/i18n/locale";

export type PricingPlanId = "free" | "seller" | "coop_enterprise";

export interface PricingPlan {
  id: PricingPlanId;
  priceLabel: string;
  periodLabel?: string;
  highlighted?: boolean;
  features: string[];
}

const PRICING_COPY = {
  vi: {
    title: "Gói dịch vụ",
    subtitle: "Chọn gói phù hợp — nâng cấp thanh toán sẽ bật ở phase tiếp theo.",
    layoutNote: "Layout preview — nút nâng cấp chưa kết nối cổng thanh toán.",
    upgrade: "Nâng cấp ngay",
    current: "Gói hiện tại",
    comingSoon: "Sắp có",
    loading: "Đang tải danh sách gói dịch vụ từ hệ thống...",
    priceFree: "Miễn phí",
    perMonth: "/ tháng",
    perYear: "/ năm",
    yearlyPricePrefix: "Theo năm:",
    qrLimitLabel: "Định mức quét QR:",
    productLimitLabel: "Định mức sản phẩm:",
    tradePostAllowedLabel: "Giao dịch B2B:",
    unlimited: "Không giới hạn",
    allowed: "Cho phép",
    notSupported: "Không hỗ trợ",
    unitQr: "QR",
    unitProduct: "SP",
    popularBadge: "Phổ biến nhất",
    pills: ["✨ QR truy xuất nguồn gốc", "🚀 Tối ưu bán hàng B2B", "🛡️ Ưu tiên hiển thị"],
    planBadges: {
      free: "MIỄN PHÍ",
      seller: "SELLER",
      coop_enterprise: "HTX & DOANH NGHIỆP",
    },
    rail: {
      title: "HTX & doanh nghiệp",
      org: "Quản lý tổ chức",
    },
    plans: {
      free: {
        name: "Gói Free",
        description: "Khám phá cộng đồng và truy xuất thông tin cơ bản.",
        priceLabel: "0đ",
        periodLabel: "/ tháng",
        features: ["Bảng tin & hồ sơ cá nhân", "Quét QR truy xuất công khai", "Tìm kiếm cơ bản"],
      },
      seller: {
        name: "Gói Seller",
        description: "Dành cho hộ sản xuất, nông trại và người bán hàng.",
        priceLabel: "199.000đ",
        periodLabel: "/ tháng",
        features: [
          "Hồ sơ xanh & nhật ký sản xuất",
          "Sản phẩm, lô hàng & mã QR",
          "Đăng tin chợ thương mại B2B",
          "Hạn mức QR cơ bản",
        ],
      },
      coop_enterprise: {
        name: "Gói HTX & Doanh nghiệp",
        description: "Quản lý tổ chức, thành viên và giao dịch B2B quy mô.",
        priceLabel: "499.000đ",
        periodLabel: "/ tháng",
        features: [
          "Tất cả tính năng của gói Seller",
          "Quản lý thành viên tổ chức",
          "Đăng yêu cầu mua sỉ B2B",
          "Hạn mức QR mở rộng",
          "Ưu tiên hiển thị sản phẩm trên chợ",
        ],
      },
    },
  },
  en: {
    title: "Subscription Plans",
    subtitle: "Choose the right plan — payment upgrade unlocks in a future phase.",
    layoutNote: "Layout preview — upgrade buttons are not connected to payments yet.",
    upgrade: "Upgrade Now",
    current: "Current plan",
    comingSoon: "Coming soon",
    loading: "Loading subscription plans from system...",
    priceFree: "Free",
    perMonth: "/ month",
    perYear: "/ year",
    yearlyPricePrefix: "Annual:",
    qrLimitLabel: "QR Scan Limit:",
    productLimitLabel: "Product Limit:",
    tradePostAllowedLabel: "B2B Trade:",
    unlimited: "Unlimited",
    allowed: "Allowed",
    notSupported: "Not supported",
    unitQr: "scans",
    unitProduct: "items",
    popularBadge: "Most Popular",
    pills: ["✨ Public QR Traceability", "🚀 B2B Trade Boost", "🛡️ Marketplace Priority"],
    planBadges: {
      free: "FREE",
      seller: "SELLER",
      coop_enterprise: "CO-OP & ENTERPRISE",
    },
    rail: {
      title: "Coops & enterprise",
      org: "Manage organization",
    },
    plans: {
      free: {
        name: "Free Plan",
        description: "Explore the community and public traceability.",
        priceLabel: "$0",
        periodLabel: "/ month",
        features: ["Feed & personal profile", "Public QR trace scanning", "Basic search"],
      },
      seller: {
        name: "Seller Plan",
        description: "For agricultural producers, farms, and sellers.",
        priceLabel: "$8",
        periodLabel: "/ month",
        features: [
          "Green profile & production logs",
          "Products, batches & QR codes",
          "B2B marketplace listings",
          "Basic QR quota",
        ],
      },
      coop_enterprise: {
        name: "Co-op & Enterprise",
        description: "Organization, member management, and B2B trade.",
        priceLabel: "$19",
        periodLabel: "/ month",
        features: [
          "Everything in Seller plan",
          "Organization member management",
          "B2B wholesale buy requests",
          "Extended QR quota",
          "Priority marketplace visibility",
        ],
      },
    },
  },
} as const;

export const PRICING_PLAN_IDS: PricingPlanId[] = ["free", "seller", "coop_enterprise"];

export function normalizePlanId(plan?: string | null): PricingPlanId | null {
  if (!plan) return null;
  const p = plan.toLowerCase();
  if (p === "free") return "free";
  if (p === "seller") return "seller";
  if (p.includes("coop") || p.includes("cooperative") || p.includes("enterprise"))
    return "coop_enterprise";
  console.warn(`[normalizePlanId] Unrecognized plan ID "${plan}".`);
  return null;
}

export function getPricingCopy(locale: AppLocale) {
  return PRICING_COPY[locale] ?? PRICING_COPY.vi;
}

export function getPricingPlans(locale: AppLocale): (PricingPlan & {
  name: string;
  description: string;
})[] {
  const copy = getPricingCopy(locale);
  return PRICING_PLAN_IDS.map((id) => ({
    id,
    name: copy.plans[id].name,
    description: copy.plans[id].description,
    priceLabel: copy.plans[id].priceLabel,
    periodLabel: copy.plans[id].periodLabel,
    features: [...copy.plans[id].features],
    highlighted: id === "seller",
  }));
}
