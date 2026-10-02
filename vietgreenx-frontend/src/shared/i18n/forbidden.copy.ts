import type { AppLocale } from "@/shared/i18n/locale";

export const FORBIDDEN_COPY = {
  vi: {
    metadata: {
      title: "403 - Truy cập bị từ chối | VietGreenX",
      description: "Bạn không có quyền truy cập vào khu vực này.",
    },
    title: "KHU VỰC CẤM VÀO",
    subtitle: "Truy cập bị từ chối",
    button: "Quay về an toàn",
  },
  en: {
    metadata: {
      title: "403 - Access Denied | VietGreenX",
      description: "You do not have permission to access this area.",
    },
    title: "RESTRICTED AREA",
    subtitle: "Access Denied",
    button: "Return to Safety",
  },
};

export const getForbiddenCopy = (locale: AppLocale) =>
  FORBIDDEN_COPY[locale] ?? FORBIDDEN_COPY.vi;
