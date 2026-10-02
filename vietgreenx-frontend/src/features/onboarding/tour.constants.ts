import type { AppLocale } from "@/shared/i18n/locale";

const TOUR_COPY = {
  vi: {
    welcome: {
      title: "Chào mừng đến VietGreenX",
      description:
        "Vài bước ngắn để làm quen bảng tin, menu và hồ sơ — bạn có thể bỏ qua bất cứ lúc nào.",
    },
    composer: {
      title: "Đăng bài lên bảng tin",
      description: "Chia sẻ mùa vụ, ảnh vườn hoặc cập nhật cho cộng đồng nông nghiệp.",
    },
    marketplace: {
      title: "Chợ nông sản",
      description: "Kết nối người mua và người bán — tìm nông sản có nguồn gốc rõ ràng.",
    },
    greenProfile: {
      title: "Hồ sơ xanh",
      description: "Quản lý chuẩn sản xuất, mùa vụ và nhật ký canh tác cho trang trại hoặc HTX.",
    },
    qr: {
      title: "Mã QR truy xuất",
      description: "Tạo mã gắn lô hàng — khách quét để xem nguồn gốc minh bạch.",
    },
    products: {
      title: "Sản phẩm",
      description: "Đăng nông sản, liên kết với lô hàng và mã QR truy xuất.",
    },
    batches: {
      title: "Lô hàng",
      description: "Theo dõi thu hoạch, đóng gói và phân phối theo từng lô.",
    },
    org: {
      title: "Tổ chức",
      description: "Quản lý thành viên HTX hoặc doanh nghiệp và quyền truy cập.",
    },
    profileHeader: {
      title: "Hồ sơ của bạn",
      description: "Tên hiển thị, vai trò và thống kê bài viết — chỉnh sửa bất cứ lúc nào.",
    },
    profileBanner: {
      title: "Hoàn thiện hồ sơ",
      description: "Thêm giới thiệu và địa chỉ để cộng đồng nhận ra bạn. Bỏ qua được — cập nhật sau.",
    },
    topActions: {
      title: "Tin nhắn & thông báo",
      description: "Trao đổi với người bán và nhận tin cập nhật từ cộng đồng.",
    },
    finish: {
      title: "Sẵn sàng!",
      description: "Bắt đầu khám phá bảng tin VietGreenX.",
    },
    skip: "Bỏ qua",
    next: "Tiếp tục",
    finishBtn: "Bắt đầu sử dụng",
    stepOf: (current: number, total: number) => `Bước ${current}/${total}`,
  },
  en: {
    welcome: {
      title: "Welcome to VietGreenX",
      description:
        "A quick tour of the feed, menu, and profile — you can skip anytime.",
    },
    composer: {
      title: "Post to the feed",
      description: "Share harvest updates, farm photos, and community news.",
    },
    marketplace: {
      title: "Marketplace",
      description: "Connect buyers and sellers — find produce with clear origins.",
    },
    greenProfile: {
      title: "Green profile",
      description: "Manage production standards, seasons, and farm logs.",
    },
    qr: {
      title: "QR traceability",
      description: "Create codes for batches — buyers scan to view transparent data.",
    },
    products: {
      title: "Products",
      description: "List produce and link batches with QR traceability.",
    },
    batches: {
      title: "Batches",
      description: "Track harvest, packaging, and distribution by batch.",
    },
    org: {
      title: "Organization",
      description: "Manage cooperative or enterprise members and access.",
    },
    profileHeader: {
      title: "Your profile",
      description: "Display name, role, and post stats — edit anytime.",
    },
    profileBanner: {
      title: "Complete your profile",
      description: "Add a bio and location so others recognize you. Optional — update later.",
    },
    topActions: {
      title: "Messages & notifications",
      description: "Chat with sellers and get community updates.",
    },
    finish: {
      title: "You're all set!",
      description: "Start exploring the VietGreenX feed.",
    },
    skip: "Skip",
    next: "Continue",
    finishBtn: "Get started",
    stepOf: (current: number, total: number) => `Step ${current}/${total}`,
  },
} as const;

export function getTourCopy(locale: AppLocale) {
  return TOUR_COPY[locale] ?? TOUR_COPY.vi;
}
