import type { AppLocale } from "@/shared/i18n/locale";

const REPORTS_COPY = {
  vi: {
    reasons: {
      spam: "Spam",
      counterfeit_goods: "Hàng giả/nhái",
      misinformation: "Thông tin sai lệch",
      harmful_content: "Nội dung có hại",
      harassment: "Quấy rối",
      other: "Lý do khác",
    },
    dialog: {
      title: "Báo cáo nội dung",
      description: "Chọn lý do báo cáo. Chúng tôi sẽ xem xét trong thời gian sớm nhất.",
      reasonLabel: "Lý do",
      descriptionLabel: "Mô tả thêm (tùy chọn)",
      descriptionPlaceholder: "Mô tả chi tiết về vấn đề bạn gặp phải...",
      submit: "Gửi báo cáo",
      submitting: "Đang gửi...",
      cancel: "Hủy",
    },
    toast: {
      reported: "Đã gửi báo cáo. Chúng tôi sẽ xem xét trong thời gian sớm nhất.",
      reportError: "Không thể gửi báo cáo. Vui lòng thử lại.",
    },
    myReports: {
      title: "Lịch sử báo cáo",
      description: "Danh sách các báo cáo vi phạm bạn đã gửi.",
      empty: "Bạn chưa gửi báo cáo nào.",
      prevPage: "Trang trước",
      nextPage: "Trang sau",
      pageInfo: (page: number, totalPages: number) => `Trang ${page} / ${totalPages}`,
      targetTypes: {
        post: "Bài viết",
        comment: "Bình luận",
        user: "Người dùng",
        product: "Sản phẩm",
      },
      statuses: {
        pending: "Chờ xử lý",
        under_review: "Đang xem xét",
        actioned: "Đã xử lý",
        dismissed: "Đã từ chối",
      },
    },
  },
  en: {
    reasons: {
      spam: "Spam",
      counterfeit_goods: "Counterfeit goods",
      misinformation: "Misinformation",
      harmful_content: "Harmful content",
      harassment: "Harassment",
      other: "Other",
    },
    dialog: {
      title: "Report content",
      description: "Select a reason. We will review your report as soon as possible.",
      reasonLabel: "Reason",
      descriptionLabel: "Additional details (optional)",
      descriptionPlaceholder: "Describe the issue in more detail...",
      submit: "Submit report",
      submitting: "Submitting...",
      cancel: "Cancel",
    },
    toast: {
      reported: "Report submitted. We will review it shortly.",
      reportError: "Could not submit report. Please try again.",
    },
    myReports: {
      title: "My Reports",
      description: "List of reports submitted by you.",
      empty: "You have not submitted any reports.",
      prevPage: "Previous",
      nextPage: "Next",
      pageInfo: (page: number, totalPages: number) => `Page ${page} of ${totalPages}`,
      targetTypes: {
        post: "Post",
        comment: "Comment",
        user: "User",
        product: "Product",
      },
      statuses: {
        pending: "Pending",
        under_review: "Under Review",
        actioned: "Actioned",
        dismissed: "Dismissed",
      },
    },
  },
} as const;

export function getReportsCopy(locale: AppLocale) {
  return REPORTS_COPY[locale] ?? REPORTS_COPY.vi;
}
