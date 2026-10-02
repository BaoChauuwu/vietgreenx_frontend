import type { AppLocale } from "@/shared/i18n/locale";

const PUBLIC_LAYOUT_COPY = {
  vi: {
    authStoryPanel: {
      alt: "VietGreenX — nông sản Việt",
      tagline1: "Nâng tầm Nông sản Việt",
      tagline2a: "Tích lũy",
      tagline2b: " giá trị xanh",
    },
    storyPanel: {
      label: "Vì sao VietGreenX",
      bullets: [
        {
          title: "Bảng tin",
          description: "Kết nối nông dân, HTX và người mua trong một cộng đồng nông nghiệp.",
        },
        {
          title: "QR truy xuất",
          description: "Quét mã để xem nguồn gốc lô hàng và thông tin sản phẩm minh bạch.",
        },
        {
          title: "Hồ sơ xanh",
          description: "Theo dõi tiêu chuẩn, chứng nhận và hành trình sản xuất bền vững.",
        },
      ],
      tagline: "Dữ liệu rõ ràng. Cộng đồng tin cậy.",
    },
  },
  en: {
    authStoryPanel: {
      alt: "VietGreenX — Vietnamese Agriculture",
      tagline1: "Elevating Vietnamese Agriculture",
      tagline2a: "Building",
      tagline2b: " Green Value",
    },
    storyPanel: {
      label: "Why VietGreenX",
      bullets: [
        {
          title: "Community feed",
          description: "Connect farmers, cooperatives, and buyers in one agriculture network.",
        },
        {
          title: "QR traceability",
          description: "Scan codes to view batch origins and transparent product data.",
        },
        {
          title: "Green profile",
          description: "Track standards, certifications, and sustainable production journeys.",
        },
      ],
      tagline: "Clear data. Trusted community.",
    },
  },
} as const;

export function getPublicLayoutCopy(locale: AppLocale) {
  return PUBLIC_LAYOUT_COPY[locale] ?? PUBLIC_LAYOUT_COPY.vi;
}
