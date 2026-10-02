import type { CertificationStatus, CertificationType } from "@/entities/certification";
import type { AppLocale } from "@/shared/i18n/locale";

export const CERTIFICATION_TYPES = certificationTypeSchemaValues();
export const CERTIFICATION_ACCEPT = "application/pdf,image/jpeg,image/png,image/webp";
export const CERTIFICATION_MAX_BYTES = 10 * 1024 * 1024;

function certificationTypeSchemaValues(): CertificationType[] {
  return ["vietgap", "globalgap", "organic", "ocop", "halal", "iso22000", "haccp", "other"];
}

const CERTIFICATION_VALIDATION_COPY = {
  vi: {
    certTypeRequired: "Vui lòng chọn loại chứng nhận",
    issuingAuthorityRequired: "Vui lòng nhập cơ quan cấp",
    issueDateRequired: "Vui lòng chọn ngày cấp",
    expiryDateRequired: "Vui lòng chọn ngày hết hạn",
    expiryAfterIssue: "Ngày hết hạn phải sau ngày cấp",
    documentRequired: "Vui lòng tải lên tài liệu chứng nhận",
    fileTooLarge: "Tệp không được vượt quá 10MB",
    fileInvalidType: "Chỉ chấp nhận PDF hoặc hình ảnh",
  },
  en: {
    certTypeRequired: "Please select a certification type",
    issuingAuthorityRequired: "Please enter the issuing authority",
    issueDateRequired: "Please select an issue date",
    expiryDateRequired: "Please select an expiry date",
    expiryAfterIssue: "Expiry date must be after issue date",
    documentRequired: "Please upload a certification document",
    fileTooLarge: "File must be 10MB or smaller",
    fileInvalidType: "Only PDF or image files are allowed",
  },
} as const;

export function getCertificationValidationCopy(locale: AppLocale) {
  return CERTIFICATION_VALIDATION_COPY[locale] ?? CERTIFICATION_VALIDATION_COPY.vi;
}

const CERTIFICATION_COPY = {
  vi: {
    section: {
      title: "Chứng nhận",
      subtitle: "Quản lý VietGAP, OCOP, Organic và các chứng nhận khác.",
      createRequiresProfile: "Lưu hồ sơ xanh trước khi thêm chứng nhận.",
    },
    types: {
      vietgap: "VietGAP",
      globalgap: "GlobalGAP",
      organic: "Hữu cơ / Organic",
      ocop: "OCOP",
      halal: "Halal",
      iso22000: "ISO 22000",
      haccp: "HACCP",
      other: "Khác",
    } satisfies Record<CertificationType, string>,
    status: {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Bị từ chối",
      valid: "Còn hiệu lực",
      expired: "Hết hạn",
      pending_renewal: "Chờ gia hạn",
      revoked: "Thu hồi",
    } satisfies Record<CertificationStatus, string>,
    form: {
      title: "Thêm chứng nhận",
      subtitle: "Tải lên giấy chứng nhận và nhập thông tin cấp phép.",
      fields: {
        certType: "Loại chứng nhận",
        certNumber: "Số chứng nhận",
        issuingAuthority: "Cơ quan cấp",
        issueDate: "Ngày cấp",
        expiryDate: "Ngày hết hạn",
        document: "Tài liệu đính kèm",
      },
      documentHint: "PDF hoặc ảnh, tối đa 10MB",
      submit: "Lưu chứng nhận",
    },
    editForm: {
      title: "Chỉnh sửa chứng nhận",
      subtitle: "Cập nhật thông tin cấp phép. Tài liệu chỉ cần tải lại khi đổi file.",
      documentOptionalHint: "Để trống nếu giữ tài liệu hiện tại",
      submit: "Cập nhật chứng nhận",
    },
    list: {
      emptyTitle: "Chưa có chứng nhận",
      emptyDescription: "Thêm chứng nhận để tăng độ tin cậy hồ sơ xanh.",
      addCta: "Thêm chứng nhận",
      loadError: "Không thể tải danh sách chứng nhận.",
      loading: "Đang tải...",
      columns: {
        type: "Loại",
        authority: "Cơ quan cấp",
        expiry: "Hết hạn",
        status: "Trạng thái",
        actions: "Thao tác",
      },
      viewDocument: "Xem tài liệu",
      edit: "Sửa",
      delete: "Xóa",
      deleteConfirm: "Xóa chứng nhận này?",
    },
    toast: {
      createSuccess: "Đã thêm chứng nhận.",
      createError: "Không thể thêm chứng nhận.",
      updateSuccess: "Đã cập nhật chứng nhận.",
      updateError: "Không thể cập nhật chứng nhận.",
      deleteSuccess: "Đã xóa chứng nhận.",
      deleteError: "Không thể xóa chứng nhận.",
      uploadError: "Không thể tải lên tài liệu.",
    },
  },
  en: {
    section: {
      title: "Certifications",
      subtitle: "Manage VietGAP, OCOP, Organic, and other certifications.",
      createRequiresProfile: "Save the green profile before adding certifications.",
    },
    types: {
      vietgap: "VietGAP",
      globalgap: "GlobalGAP",
      organic: "Organic",
      ocop: "OCOP",
      halal: "Halal",
      iso22000: "ISO 22000",
      haccp: "HACCP",
      other: "Other",
    } satisfies Record<CertificationType, string>,
    status: {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      valid: "Valid",
      expired: "Expired",
      pending_renewal: "Pending renewal",
      revoked: "Revoked",
    } satisfies Record<CertificationStatus, string>,
    form: {
      title: "Add certification",
      subtitle: "Upload the certificate document and enter license details.",
      fields: {
        certType: "Certification type",
        certNumber: "Certificate number",
        issuingAuthority: "Issuing authority",
        issueDate: "Issue date",
        expiryDate: "Expiry date",
        document: "Attached document",
      },
      documentHint: "PDF or image, max 10MB",
      submit: "Save certification",
    },
    editForm: {
      title: "Edit certification",
      subtitle: "Update license details. Re-upload the document only when replacing the file.",
      documentOptionalHint: "Leave empty to keep the current document",
      submit: "Update certification",
    },
    list: {
      emptyTitle: "No certifications yet",
      emptyDescription: "Add certifications to strengthen your green profile.",
      addCta: "Add certification",
      loadError: "Could not load certifications.",
      loading: "Loading...",
      columns: {
        type: "Type",
        authority: "Issuing authority",
        expiry: "Expiry",
        status: "Status",
        actions: "Actions",
      },
      viewDocument: "View document",
      edit: "Edit",
      delete: "Delete",
      deleteConfirm: "Delete this certification?",
    },
    toast: {
      createSuccess: "Certification added.",
      createError: "Could not add certification.",
      updateSuccess: "Certification updated.",
      updateError: "Could not update certification.",
      deleteSuccess: "Certification deleted.",
      deleteError: "Could not delete certification.",
      uploadError: "Could not upload document.",
    },
  },
} as const;

export function getCertificationCopy(locale: AppLocale) {
  return CERTIFICATION_COPY[locale] ?? CERTIFICATION_COPY.vi;
}
