import type { AppLocale } from "@/shared/i18n/locale";

const BLOCK_VALIDATION_COPY = {
  vi: {
    userIdInvalid: "ID người dùng không hợp lệ",
  },
  en: {
    userIdInvalid: "Invalid user ID",
  },
} as const;

export function getBlockValidationCopy(locale: AppLocale) {
  return BLOCK_VALIDATION_COPY[locale] ?? BLOCK_VALIDATION_COPY.vi;
}

const BLOCK_COPY = {
  vi: {
    title: "Người dùng bị chặn",
    description: "Danh sách tài khoản bạn đã chặn. Bạn cũng có thể chặn từ menu bài viết.",
    empty: "Chưa chặn ai.",
    blockAction: "Tìm và chặn",
    searchTitle: "Chặn người dùng",
    searchDescription: "Tìm theo tên hoặc username.",
    searchPlaceholder: "Tên hoặc @username…",
    searchMinLength: "Nhập ít nhất 2 ký tự để tìm.",
    searchEmpty: "Không tìm thấy người dùng.",
    confirmTitle: "Chặn người dùng này?",
    confirmDescription: "Họ sẽ không thể tương tác với bạn trên VietGreenX.",
    confirm: "Chặn",
    cancel: "Huỷ",
    unblock: "Bỏ chặn",
    blocked: "Đã chặn người dùng.",
    unblocked: "Đã bỏ chặn.",
    alreadyBlocked: "Người dùng này đã bị chặn.",
    error: "Không thể thực hiện. Vui lòng thử lại.",
    loading: "Đang tải…",
  },
  en: {
    title: "Blocked users",
    description: "Accounts you have blocked. You can also block from a post menu.",
    empty: "No blocked users.",
    blockAction: "Find and block",
    searchTitle: "Block user",
    searchDescription: "Search by name or username.",
    searchPlaceholder: "Name or @username…",
    searchMinLength: "Type at least 2 characters to search.",
    searchEmpty: "No users found.",
    confirmTitle: "Block this user?",
    confirmDescription: "They will not be able to interact with you on VietGreenX.",
    confirm: "Block",
    cancel: "Cancel",
    unblock: "Unblock",
    blocked: "User blocked.",
    unblocked: "User unblocked.",
    alreadyBlocked: "This user is already blocked.",
    error: "Could not complete action. Please try again.",
    loading: "Loading…",
  },
} as const;

export function getBlockCopy(locale: AppLocale) {
  return BLOCK_COPY[locale] ?? BLOCK_COPY.vi;
}
