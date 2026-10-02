import type { CropSeasonStatus } from "@/entities/crop-season";
import type { AppLocale } from "@/shared/i18n/locale";

const CROP_SEASON_VALIDATION_COPY = {
  vi: {
    seasonNameRequired: "Vui lòng nhập tên mùa vụ",
    cropTypeRequired: "Vui lòng nhập loại cây trồng",
    areaPositive: "Diện tích phải lớn hơn 0",
    startDateRequired: "Vui lòng chọn ngày bắt đầu",
    harvestDateRequired: "Vui lòng chọn ngày thu hoạch dự kiến",
    harvestAfterStart: "Ngày thu hoạch phải sau ngày bắt đầu",
    greenProfileRequired: "Thiếu hồ sơ xanh",
  },
  en: {
    seasonNameRequired: "Please enter a season name",
    cropTypeRequired: "Please enter a crop type",
    areaPositive: "Area must be greater than 0",
    startDateRequired: "Please select a start date",
    harvestDateRequired: "Please select an expected harvest date",
    harvestAfterStart: "Harvest date must be after start date",
    greenProfileRequired: "Green profile is required",
  },
} as const;

export function getCropSeasonValidationCopy(locale: AppLocale) {
  return CROP_SEASON_VALIDATION_COPY[locale] ?? CROP_SEASON_VALIDATION_COPY.vi;
}

const CROP_SEASON_COPY = {
  vi: {
    status: {
      planning: "Lên kế hoạch",
      active: "Đang canh tác",
      harvested: "Đã thu hoạch",
      cancelled: "Đã huỷ",
    } satisfies Record<CropSeasonStatus, string>,
    loadError: "Không thể tải danh sách mùa vụ.",
    noGreenProfile: "Cần tạo hồ sơ xanh trước khi quản lý mùa vụ.",
    section: {
      title: "Quản lý mùa vụ",
      subtitle: "Theo dõi từng vụ canh tác gắn với hồ sơ xanh.",
    },
    list: {
      addCta: "Thêm mùa vụ",
      emptyTitle: "Chưa có mùa vụ",
      emptyDescription: "Thêm mùa vụ để ghi nhật ký canh tác theo từng vụ.",
      loading: "Đang tải...",
      columns: {
        name: "Tên mùa vụ",
        start: "Bắt đầu",
        harvest: "Thu hoạch dự kiến",
        status: "Trạng thái",
        actions: "Thao tác",
      },
      edit: "Sửa",
      delete: "Xóa",
      deleteConfirm: "Xóa mùa vụ này?",
      statusActions: {
        active: "Bắt đầu canh tác",
        harvested: "Hoàn thành thu hoạch",
        cancelled: "Huỷ mùa vụ",
      } satisfies Record<"active" | "harvested" | "cancelled", string>,
      statusConfirm: {
        active: "Bắt đầu canh tác mùa vụ này?",
        harvested: "Đánh dấu mùa vụ đã thu hoạch?",
        cancelled: "Huỷ mùa vụ này?",
      } satisfies Record<"active" | "harvested" | "cancelled", string>,
    },
    form: {
      title: "Thêm mùa vụ",
      subtitle: "Gắn mùa vụ với hồ sơ xanh để ghi nhật ký canh tác.",
      fields: {
        seasonName: "Tên mùa vụ",
        cropType: "Loại cây trồng",
        areaHa: "Diện tích (ha)",
        startDate: "Ngày bắt đầu",
        expectedHarvestDate: "Thu hoạch dự kiến",
        product: "Sản phẩm liên kết (tuỳ chọn)",
        notes: "Ghi chú",
      },
      productNone: "Không liên kết",
      submit: "Thêm mùa vụ",
      cancel: "Huỷ",
    },
    editForm: {
      title: "Chỉnh sửa mùa vụ",
      subtitle: "Cập nhật thông tin mùa vụ canh tác.",
      submit: "Cập nhật mùa vụ",
    },
    toast: {
      createSuccess: "Đã thêm mùa vụ.",
      createError: "Không thể thêm mùa vụ. Vui lòng thử lại.",
      updateSuccess: "Đã cập nhật mùa vụ.",
      updateError: "Không thể cập nhật mùa vụ.",
      deleteSuccess: "Đã xóa mùa vụ.",
      deleteError: "Không thể xóa mùa vụ.",
      statusSuccess: "Đã cập nhật trạng thái mùa vụ.",
      statusError: "Không thể cập nhật trạng thái mùa vụ.",
    },
  },
  en: {
    status: {
      planning: "Planning",
      active: "Active",
      harvested: "Harvested",
      cancelled: "Cancelled",
    } satisfies Record<CropSeasonStatus, string>,
    loadError: "Could not load crop seasons.",
    noGreenProfile: "Create a green profile before managing crop seasons.",
    section: {
      title: "Crop seasons",
      subtitle: "Track each cultivation season linked to your green profile.",
    },
    list: {
      addCta: "Add season",
      emptyTitle: "No seasons yet",
      emptyDescription: "Add a season to log production activities per crop cycle.",
      loading: "Loading...",
      columns: {
        name: "Season",
        start: "Start",
        harvest: "Expected harvest",
        status: "Status",
        actions: "Actions",
      },
      edit: "Edit",
      delete: "Delete",
      deleteConfirm: "Delete this crop season?",
      statusActions: {
        active: "Start cultivation",
        harvested: "Mark harvested",
        cancelled: "Cancel season",
      } satisfies Record<"active" | "harvested" | "cancelled", string>,
      statusConfirm: {
        active: "Start this crop season?",
        harvested: "Mark this season as harvested?",
        cancelled: "Cancel this crop season?",
      } satisfies Record<"active" | "harvested" | "cancelled", string>,
    },
    form: {
      title: "Add crop season",
      subtitle: "Link a season to your green profile for production logging.",
      fields: {
        seasonName: "Season name",
        cropType: "Crop type",
        areaHa: "Area (ha)",
        startDate: "Start date",
        expectedHarvestDate: "Expected harvest",
        product: "Linked product (optional)",
        notes: "Notes",
      },
      productNone: "None",
      submit: "Add season",
      cancel: "Cancel",
    },
    editForm: {
      title: "Edit crop season",
      subtitle: "Update cultivation season details.",
      submit: "Update season",
    },
    toast: {
      createSuccess: "Crop season added.",
      createError: "Could not add crop season. Please try again.",
      updateSuccess: "Crop season updated.",
      updateError: "Could not update crop season.",
      deleteSuccess: "Crop season deleted.",
      deleteError: "Could not delete crop season.",
      statusSuccess: "Season status updated.",
      statusError: "Could not update season status.",
    },
  },
} as const;

export function getCropSeasonCopy(locale: AppLocale) {
  return CROP_SEASON_COPY[locale] ?? CROP_SEASON_COPY.vi;
}
