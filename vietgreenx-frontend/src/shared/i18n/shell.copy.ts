import type { AppLocale } from "@/shared/i18n/locale";
import { ROUTES } from "@/shared/routing";

const SHELL_COPY = {
  vi: {
    topNav: {
      searchPlaceholder: "Tìm kiếm sản phẩm, người bán...",
      searchAriaLabel: "Tìm kiếm",
      messagesAriaLabel: "Tin nhắn",
      notificationsAriaLabel: "Thông báo",
      notificationsAriaLabelUnread: (count: number) => `${count} thông báo chưa đọc`,
      pricingAriaLabel: "Gói dịch vụ",
      centerAriaLabel: "Điều hướng chính",
    },
    feedColumn: {
      shortcutsTitle: "Lối tắt của bạn",
      shortcuts: [
        { href: ROUTES.marketplace, label: "Chợ nông sản" },
        { href: ROUTES.greenProfile, label: "Hồ sơ xanh" },
        { href: ROUTES.profileEdit, label: "Chỉnh sửa hồ sơ" },
        { href: ROUTES.chat, label: "Tin nhắn" },
      ],
      footer: [
        { href: ROUTES.legal, label: "Điều khoản" },
        { href: ROUTES.legal, label: "Quyền riêng tư" },
        { href: ROUTES.pricing, label: "Gói dịch vụ" },
      ],
    },
    bottomNav: {
      feed: "Bảng tin",
      marketplace: "Chợ",
      qr: "QR",
      notifications: "Thông báo",
      profile: "Hồ sơ",
    },
    sideNav: {
      ariaLabel: "Menu ứng dụng",
      feed: "Bảng tin",
      greenProfile: "Hồ sơ xanh",
      products: "Sản phẩm",
      productsMyList: "Sản phẩm của tôi",
      productsCreate: "Đăng bán sản phẩm",
      qr: "QR truy xuất",
      chat: "Tin nhắn",
      dashboard: "Tổ chức",
      notifications: "Thông báo",
      favorites: "Yêu thích",
      saved: "NCC đã lưu",
      settings: "Cài đặt",
      help: "Trợ giúp",
      marketplace: "Chợ nông sản",
      batches: "Mùa vụ",
      org: "Tổ chức",
      organizations: "Khám phá HTX",
      pricing: "Gói dịch vụ",
      quotations: "Quản lý báo giá",
      comingSoon: "Sắp ra mắt",
    },
    userMenu: {
      ariaLabel: "Menu tài khoản",
      profile: "Hồ sơ của tôi",
      editProfile: "Chỉnh sửa hồ sơ",
      pricing: "Gói dịch vụ",
      settings: "Cài đặt",
      logout: "Đăng xuất",
      loggingOut: "Đang đăng xuất...",
    },
  },
  en: {
    topNav: {
      searchPlaceholder: "Search...",
      searchAriaLabel: "Search",
      messagesAriaLabel: "Messages",
      notificationsAriaLabel: "Notifications",
      notificationsAriaLabelUnread: (count: number) => `${count} unread notifications`,
      pricingAriaLabel: "Pricing plans",
      centerAriaLabel: "Primary navigation",
    },
    feedColumn: {
      shortcutsTitle: "Your shortcuts",
      shortcuts: [
        { href: ROUTES.marketplace, label: "Marketplace" },
        { href: ROUTES.greenProfile, label: "Green profile" },
        { href: ROUTES.profileEdit, label: "Edit profile" },
        { href: ROUTES.chat, label: "Messages" },
      ],
      footer: [
        { href: ROUTES.legal, label: "Terms" },
        { href: ROUTES.legal, label: "Privacy" },
        { href: ROUTES.pricing, label: "Pricing" },
      ],
    },
    bottomNav: {
      feed: "Feed",
      marketplace: "Market",
      qr: "QR",
      notifications: "Alerts",
      profile: "Profile",
    },
    sideNav: {
      ariaLabel: "App menu",
      feed: "Feed",
      greenProfile: "Green profile",
      products: "Products",
      productsMyList: "My products",
      productsCreate: "Post product",
      qr: "QR traceability",
      chat: "Messages",
      dashboard: "Organization",
      notifications: "Notifications",
      favorites: "Favorites",
      saved: "Saved Suppliers",
      settings: "Settings",
      help: "Help",
      marketplace: "Marketplace",
      batches: "Batches",
      org: "Organization",
      organizations: "Explore Coops",
      pricing: "Pricing",
      quotations: "Quotations",
      comingSoon: "Coming soon",
    },
    userMenu: {
      ariaLabel: "Account menu",
      profile: "My profile",
      editProfile: "Edit profile",
      pricing: "Pricing plans",
      settings: "Settings",
      logout: "Log out",
      loggingOut: "Logging out...",
    },
  },
} as const;

export function getShellCopy(locale: AppLocale) {
  return SHELL_COPY[locale] ?? SHELL_COPY.vi;
}

export type ShellCopy = ReturnType<typeof getShellCopy>;
