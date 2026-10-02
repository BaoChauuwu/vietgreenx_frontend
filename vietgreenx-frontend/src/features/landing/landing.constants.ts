import type { AppLocale } from "@/shared/i18n/locale";
import { ROUTES } from "@/shared/routing";

type ProofAccent = "primary" | "secondary" | "tertiary";

const LANDING_COPY = {
  vi: {
    auth: {
      login: "Đăng nhập",
      signUp: "Đăng ký",
    },
    beta: {
      label: "Beta",
      hint: "Phiên bản thử nghiệm",
    },
    navItems: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Truy xuất", href: "/traceability" },
      { label: "Cộng đồng", href: "/community" },
      { label: "Giới thiệu", href: "/about" },
    ],
    mobileMenu: {
      title: "Menu",
      openAriaLabel: "Mở menu",
      closeAriaLabel: "Đóng menu",
    },
    hero: {
      badge: "TRUY XUẤT QR • HỒ SƠ XANH",
      titleLines: ["Mạng xã hội nông nghiệp VietGreenX"],
      description:
        "Kết nối nông dân, HTX và người mua trên một bảng tin nông nghiệp — kèm truy xuất QR và hồ sơ xanh minh bạch.",
      primaryCta: { label: "Đăng nhập", href: ROUTES.login },
      secondaryCta: { label: "Tạo tài khoản miễn phí", href: ROUTES.register },
      proofStrip: [
        {
          key: "Cộng đồng",
          detail: "Bảng tin và kết nối theo vai trò",
          accent: "primary" as ProofAccent,
        },
        { key: "QR", detail: "Truy xuất lô hàng và sản phẩm", accent: "secondary" as ProofAccent },
        {
          key: "Hồ sơ xanh",
          detail: "Tiêu chuẩn và chứng nhận rõ ràng",
          accent: "tertiary" as ProofAccent,
        },
      ],
      publicStats: {
        users: "Thành viên",
        scans: "Lượt quét QR",
      },
    },
    footer: {
      brandNote:
        "Mạng xã hội nông nghiệp — bảng tin, truy xuất QR và hồ sơ xanh minh bạch cho nông dân, HTX và người mua.",
      newsletterHint: "Nhận tin cập nhật tính năng và cộng đồng VietGreenX.",
      emailPlaceholder: "Email của bạn",
      submitAriaLabel: "Đăng ký nhận tin",
      copyright: "© 2026 VietGreenX. Kết nối nông nghiệp xanh Việt Nam.",
    },
    localeLabel: "Ngôn ngữ",
    headerDropdown: {
      explore: "Khám phá",
      systemResources: "Tài nguyên hệ thống",
      legal: {
        title: "Pháp lý & Chính sách",
        description: "Các quy định, điều khoản dịch vụ và chính sách bảo mật.",
      },
    },
  },
  en: {
    auth: {
      login: "Log in",
      signUp: "Sign up",
    },
    beta: {
      label: "Beta",
      hint: "Early access",
    },
    navItems: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Traceability", href: "/traceability" },
      { label: "Community", href: "/community" },
      { label: "About Us", href: "/about" },
    ],
    mobileMenu: {
      title: "Menu",
      openAriaLabel: "Open menu",
      closeAriaLabel: "Close menu",
    },
    hero: {
      badge: "QR TRACE • GREEN PROFILE",
      titleLines: ["VietGreenX agriculture social network"],
      description:
        "Connect farmers, cooperatives, and buyers on one agriculture feed — with QR traceability and transparent green profiles.",
      primaryCta: { label: "Log in", href: ROUTES.login },
      secondaryCta: { label: "Create free account", href: ROUTES.register },
      proofStrip: [
        {
          key: "Community",
          detail: "Role-based feed and connections",
          accent: "primary" as ProofAccent,
        },
        { key: "QR", detail: "Batch and product traceability", accent: "secondary" as ProofAccent },
        {
          key: "Green profile",
          detail: "Clear standards and certifications",
          accent: "tertiary" as ProofAccent,
        },
      ],
      publicStats: {
        users: "Members",
        scans: "QR scans",
      },
    },
    footer: {
      brandNote:
        "Agriculture social network — feed, QR traceability, and transparent green profiles for farmers, cooperatives, and buyers.",
      newsletterHint: "Get product updates and community news from VietGreenX.",
      emailPlaceholder: "Your email",
      submitAriaLabel: "Subscribe",
      copyright: "© 2026 VietGreenX. Connecting Vietnam's green agriculture community.",
    },
    localeLabel: "Language",
    headerDropdown: {
      explore: "Explore",
      systemResources: "System Resources",
      legal: {
        title: "Legal & Policies",
        description: "Regulations, terms of service and privacy policy.",
      },
    },
  },
} as const;

export function getLandingCopy(locale: AppLocale) {
  return LANDING_COPY[locale] ?? LANDING_COPY.vi;
}

export type { ProofAccent };
