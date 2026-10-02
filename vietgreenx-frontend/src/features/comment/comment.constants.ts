import type { AppLocale } from "@/shared/i18n/locale";

const COMMENT_VALIDATION_COPY = {
  vi: {
    bodyRequired: "Nội dung không được để trống",
    bodyMax: "Tối đa 500 ký tự",
  },
  en: {
    bodyRequired: "Comment cannot be empty",
    bodyMax: "Maximum 500 characters",
  },
} as const;

export function getCommentValidationCopy(locale: AppLocale) {
  return COMMENT_VALIDATION_COPY[locale] ?? COMMENT_VALIDATION_COPY.vi;
}

const COMMENT_COPY = {
  vi: {
    title: "Bình luận",
    placeholder: "Viết bình luận…",
    replyPlaceholder: "Viết phản hồi…",
    submit: "Đăng",
    submitting: "Đang đăng…",
    like: "Thích",
    reply: "Trả lời",
    edit: "Sửa",
    delete: "Xóa",
    cancel: "Huỷ",
    save: "Lưu",
    saving: "Đang lưu…",
    loadError: "Không tải được bình luận.",
    empty: "Chưa có bình luận. Hãy làm người đầu tiên!",
    loading: "Đang tải…",
    loadMore: "Xem thêm bình luận",
    created: "Đã đăng bình luận.",
    updated: "Đã cập nhật bình luận.",
    deleted: "Đã xóa bình luận.",
    error: "Không thể thực hiện. Vui lòng thử lại.",
    replyError: "Không thể trả lời bình luận này.",
    deleteTitle: "Xóa bình luận?",
    deleteDescription: "Bình luận sẽ bị xóa và không thể khôi phục.",
    editTitle: "Sửa bình luận",
    charCount: (count: number) => `${count}/500`,
  },
  en: {
    title: "Comments",
    placeholder: "Write a comment…",
    replyPlaceholder: "Write a reply…",
    submit: "Post",
    submitting: "Posting…",
    like: "Like",
    reply: "Reply",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving…",
    loadError: "Could not load comments.",
    empty: "No comments yet. Be the first!",
    loading: "Loading…",
    loadMore: "Load more comments",
    created: "Comment posted.",
    updated: "Comment updated.",
    deleted: "Comment deleted.",
    error: "Could not complete action. Please try again.",
    replyError: "Cannot reply to this comment.",
    deleteTitle: "Delete comment?",
    deleteDescription: "This comment will be permanently removed.",
    editTitle: "Edit comment",
    charCount: (count: number) => `${count}/500`,
  },
} as const;

export function getCommentCopy(locale: AppLocale) {
  return COMMENT_COPY[locale] ?? COMMENT_COPY.vi;
}
