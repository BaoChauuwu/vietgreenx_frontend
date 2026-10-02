import type { BatchStatus } from "@/entities/batch";
import type { AppLocale } from "@/shared/i18n/locale";

const BATCHES_VALIDATION_COPY = {
  vi: {
    batchCodeRequired: "Vui lòng nhập mã lô",
    productRequired: "Vui lòng chọn sản phẩm",
    cropSeasonRequired: "Vui lòng chọn mùa vụ",
    quantityPositive: "Số lượng phải lớn hơn 0",
    unitRequired: "Vui lòng nhập đơn vị",
  },
  en: {
    batchCodeRequired: "Please enter a batch code",
    productRequired: "Please select a product",
    cropSeasonRequired: "Please select a crop season",
    quantityPositive: "Quantity must be greater than 0",
    unitRequired: "Please enter a unit",
  },
} as const;

export function getBatchesValidationCopy(locale: AppLocale) {
  return BATCHES_VALIDATION_COPY[locale] ?? BATCHES_VALIDATION_COPY.vi;
}

const BATCHES_COPY = {
  vi: {
    hub: {
      title: "Lô hàng",
      createCta: "Tạo lô hàng",
      emptyTitle: "Chưa có lô hàng",
      emptyDescription: "Tạo lô gắn với sản phẩm để sinh mã QR truy xuất nguồn gốc.",
      loadError: "Không thể tải danh sách lô hàng.",
      loading: "Đang tải...",
      rail: {
        title: "Từ sản phẩm đến QR",
        products: "Quản lý sản phẩm",
      },
      columns: {
        code: "Mã lô",
        product: "Sản phẩm",
        quantity: "Số lượng",
        harvest: "Thu hoạch",
        status: "Trạng thái",
      },
    },
    status: {
      created: "Mới tạo",
      qr_generated: "Đã có QR",
      shipped: "Đã giao",
      sold: "Đã bán",
      recalled: "Thu hồi",
    } satisfies Record<BatchStatus, string>,
    form: {
      createTitle: "Tạo lô hàng",
      subtitle: "Gắn lô với sản phẩm và thông tin thu hoạch.",
      fields: {
        batchCode: "Mã lô",
        product: "Sản phẩm",
        cropSeason: "Mùa vụ",
        quantity: "Số lượng",
        unit: "Đơn vị",
        harvestDate: "Ngày thu hoạch",
      },
      save: "Lưu lô hàng",
      cancel: "Huỷ",
      editTitle: "Chỉnh sửa lô hàng",
      editSubtitle: "Cập nhật mã lô, số lượng và ngày thu hoạch.",
      batchCodeLocked: "Mã lô không đổi sau khi đã tạo QR.",
      terminalLocked: "Lô đã giao / bán / thu hồi — không chỉnh sửa được.",
      productReadOnly: "Sản phẩm gắn với lô không đổi.",
      draftWarning: "Sản phẩm này đang ở trạng thái Lưu nháp (Draft), không thể tạo lô hàng.",
      editProductCta: "Chỉnh sửa sản phẩm →",
      createHeaderTitle: "Thông tin lô hàng mới",
      createHeaderSubtitle: "Nhập đầy đủ thông tin để khởi tạo mã lô & lưu vào hệ thống",
      footerInfoHint: "Mã lô sẽ được tự động liên kết để khởi tạo QR truy xuất.",
      units: {
        kg: "kg (Kilôgam)",
        tonne: "Tấn",
        ta: "Tạ",
        box: "Hộp / Thùng",
        bag: "Bao / Túi",
        item: "Quả / Trái / Cái",
        bottle: "Chai / Lọ",
        selectPlaceholder: "Chọn đơn vị...",
      },
    },
    toast: {
      createSuccess: "Đã tạo lô hàng.",
      createError: "Không thể tạo lô hàng. Vui lòng thử lại.",
      draftProductError:
        "Sản phẩm đang ở trạng thái Nháp (Draft), không thể tạo lô hàng! Vui lòng chuyển sản phẩm sang 'Đang bán' trước.",
      updateSuccess: "Đã cập nhật lô hàng.",
      updateError: "Không thể cập nhật lô hàng.",
    },
    detail: {
      title: "Chi tiết lô hàng",
      qrSection: "Mã QR truy xuất",
      qrEmpty: "Chưa có mã QR cho lô này.",
      generateQr: "Tạo QR",
      viewTrace: "Xem trang truy xuất",
      loadError: "Không thể tải chi tiết lô hàng.",
      loading: "Đang tải...",
    },
  },
  en: {
    hub: {
      title: "Batches",
      createCta: "Create batch",
      emptyTitle: "No batches yet",
      emptyDescription: "Create batches linked to products for QR traceability.",
      loadError: "Could not load batches.",
      loading: "Loading...",
      rail: {
        title: "Product to QR flow",
        products: "Manage products",
      },
      columns: {
        code: "Batch code",
        product: "Product",
        quantity: "Quantity",
        harvest: "Harvest",
        status: "Status",
      },
    },
    status: {
      created: "Created",
      qr_generated: "QR generated",
      shipped: "Shipped",
      sold: "Sold",
      recalled: "Recalled",
    } satisfies Record<BatchStatus, string>,
    form: {
      createTitle: "Create batch",
      subtitle: "Link a batch to a product and harvest info.",
      fields: {
        batchCode: "Batch code",
        product: "Product",
        cropSeason: "Crop season",
        quantity: "Quantity",
        unit: "Unit",
        harvestDate: "Harvest date",
      },
      save: "Save batch",
      cancel: "Cancel",
      editTitle: "Edit batch",
      editSubtitle: "Update batch code, quantity, and harvest date.",
      batchCodeLocked: "Batch code cannot change after QR is generated.",
      terminalLocked: "Shipped, sold, or recalled batches cannot be edited.",
      productReadOnly: "The linked product cannot be changed.",
      draftWarning: "This product is currently in Draft status and cannot create a batch.",
      editProductCta: "Edit product →",
      createHeaderTitle: "New Batch Information",
      createHeaderSubtitle: "Enter complete details to generate a batch code & save to system",
      footerInfoHint: "The batch code will be automatically linked to generate a trace QR code.",
      units: {
        kg: "kg (Kilogram)",
        tonne: "Tonne",
        ta: "Quintal",
        box: "Box / Carton",
        bag: "Bag / Sack",
        item: "Item / Piece",
        bottle: "Bottle / Jar",
        selectPlaceholder: "Select unit...",
      },
    },
    toast: {
      createSuccess: "Batch created.",
      createError: "Could not create batch. Please try again.",
      draftProductError:
        "This product is in Draft status and cannot create a batch! Please set status to 'Active' first.",
      updateSuccess: "Batch updated.",
      updateError: "Could not update batch.",
    },
    detail: {
      title: "Batch details",
      qrSection: "Traceability QR",
      qrEmpty: "No QR codes for this batch yet.",
      generateQr: "Generate QR",
      viewTrace: "View trace page",
      loadError: "Could not load batch details.",
      loading: "Loading...",
    },
  },
} as const;

export function getBatchesCopy(locale: AppLocale) {
  return BATCHES_COPY[locale] ?? BATCHES_COPY.vi;
}
