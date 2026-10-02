import type { AppLocale } from "@/shared/i18n/locale";

const APP_SHELL_COPY = {
  vi: {
    chatOverlay: {
      expand: "Mở rộng",
      minimize: "Thu nhỏ",
      close: "Đóng",
      loadingMessages: "Đang tải tin nhắn...",
      messagePlaceholder: "Nhập tin nhắn...",
    },
  },
  en: {
    chatOverlay: {
      expand: "Expand",
      minimize: "Minimize",
      close: "Close",
      loadingMessages: "Loading messages...",
      messagePlaceholder: "Type a message...",
    },
  },
} as const;

export function getAppShellCopy(locale: AppLocale) {
  return APP_SHELL_COPY[locale] ?? APP_SHELL_COPY.vi;
}
