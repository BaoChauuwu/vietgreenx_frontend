# 📋 Đặc Tả Yêu Cầu Tích Hợp API QR Code (FE <-> BE)

> **Mục tiêu:** Đồng bộ API Contract giữa Frontend (`vietgreenx-frontend`) và Backend (`vietgreenx-backend`) cho luồng **Crop Season → Product → Batch → Tạo & Hiển thị mã QR**.

---

## 🚨 1. Vấn Đề Hiện Tại & Nguyên Nhân Lỗi (`404 Not Found`)

Khi người dùng vào trang **Chi tiết Lô sản xuất (`BatchDetailScreen`)** và bấm **"Tạo mã QR"**, Frontend bị lỗi `404 Not Found` do 2 bên đang lệch Endpoint:

| Chức Năng                 | Frontend Đang Gọi (Contract)                                     | Backend Hiện Tại Có                                             | Tình Trạng                 |
| :------------------------ | :--------------------------------------------------------------- | :-------------------------------------------------------------- | :------------------------- |
| **Kiểm tra Quota QR**     | `GET /app/qr/quota`                                              | `GET /app/qr/quota`                                             | ✅ **Khớp (`200 OK`)**     |
| **Kiểm tra QR của Batch** | `GET /app/qr?batchId=xxx&targetType=batch`                       | ❌ _Chưa có endpoint này_                                       | ❌ **Lỗi `404 Not Found`** |
| **Tạo mã QR cho Batch**   | `POST /app/qr/generate` <br> _(body: `{ targetType, batchId }`)_ | `POST /app/batches/:id/qr/generate` <br> _(body: `{ amount }`)_ | ❌ **Lỗi `404 Not Found`** |

---

## 🛠️ 2. Yêu Cầu Bổ Sung Dành Cho Backend (`BE`)

Để Frontend giữ nguyên kiến trúc UI hiện tại và hoạt động trơn tru ngay lập tức, Backend cần bổ sung **02 Endpoints** vào Controller mới (`QrController`) với prefix `@Controller('app/qr')`.

### 2.1. API Lấy Danh Sách / Kiểm Tra Tem QR của Lô (`GET /app/qr`)

API này được Frontend gọi ngay khi mở màn hình Chi tiết Lô (`BatchDetail`) để kiểm tra xem lô đó đã được tạo mã QR truy xuất (`PublicTraceToken`) hay chưa.

- **URL:** `GET /app/qr`
- **Headers:** `Authorization: Bearer <access_token>`
- **Query Parameters:**

| Parameter    | Type            | Required | Description / Example                             |
| :----------- | :-------------- | :------- | :------------------------------------------------ |
| `batchId`    | `string (UUID)` | Optional | Lọc danh sách QR theo ID của lô (`batch`)         |
| `productId`  | `string (UUID)` | Optional | Lọc danh sách QR theo ID của sản phẩm (`product`) |
| `targetType` | `string`        | Optional | Giá trị: `"batch"` hoặc `"product"`               |
| `page`       | `number`        | Optional | Mặc định: `1`                                     |
| `limit`      | `number`        | Optional | Mặc định: `20`                                    |

- **Response Expected (`200 OK` - Phân trang chuẩn):**

```json
{
  "items": [
    {
      "id": "01918a3d-1111-2222-3333-444444444444",
      "batchId": "c8b41e3a-5555-6666-7777-888888888888",
      "productId": "a1b2c3d4-9999-0000-1111-222222222222",
      "token": "01918a3d-1111-2222-3333-444444444444",
      "targetType": "batch",
      "createdBy": "e5f6g7h8-3333-4444-5555-666666666666",
      "createdAt": "2026-07-08T15:00:00.000Z",
      "updatedAt": "2026-07-08T15:00:00.000Z"
    }
  ],
  "meta": {
    "totalItems": 1,
    "itemCount": 1,
    "itemsPerPage": 20,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

---

### 2.2. API Tạo Mã QR Chung (`POST /app/qr/generate`)

API này được Frontend gọi khi người dùng nhấn nút **"Tạo mã QR"** trên thanh `RightRail` của màn hình Chi tiết Lô.

- **URL:** `POST /app/qr/generate`
- **Headers:** `Authorization: Bearer <access_token>`
- **Request Body:**

```json
{
  "targetType": "batch",
  "batchId": "c8b41e3a-5555-6666-7777-888888888888"
}
```

- **Logic Xử Lý Phía Backend (`Service Logic`):**
  1. Kiểm tra `batchId` có tồn tại và thuộc sở hữu của `user` đang đăng nhập hay không.
  2. Kiểm tra trạng thái của Lô (chỉ cho phép tạo nếu Lô đang ở trạng thái `CREATED` hoặc `QR_GENERATED`).
  3. Kiểm tra & trừ hạn mức QR thông qua `QrQuotaService.checkAndDeductQuota(user, 1, manager)`.
  4. Tạo **01** bản ghi trong bảng `public_trace_token` với `batchId`, `targetType = 'batch'`, `createdBy = user.id`.
  5. Nếu Lô đang ở trạng thái `CREATED`, cập nhật trạng thái Lô thành `QR_GENERATED`.
  6. Trả về đối tượng `PublicTraceToken` vừa được tạo (hoặc đối tượng đầu tiên trong danh sách tạo).

- **Response Expected (`201 Created` - Đối tượng `PublicTraceToken`):**

```json
{
  "id": "01918a3d-1111-2222-3333-444444444444",
  "batchId": "c8b41e3a-5555-6666-7777-888888888888",
  "productId": null,
  "token": "01918a3d-1111-2222-3333-444444444444",
  "targetType": "batch",
  "createdBy": "e5f6g7h8-3333-4444-5555-666666666666",
  "createdAt": "2026-07-08T15:00:00.000Z",
  "updatedAt": "2026-07-08T15:00:00.000Z"
}
```

---

## 📝 3. Hướng Dẫn Triển Khai Gợi Ý cho BE (NestJS)

Dưới đây là mẫu code gợi ý cho `QrController` bên Backend để xử lý nhanh 2 endpoint trên:

```typescript
// src/modules/app/qr/qr.controller.ts
import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppAuthGuard } from "../app-auth/app-auth.guard";
import { CurrentUser } from "@app/common/decorators/current-user.decorator";
import { User } from "@app/database/typeorm/entities/identity/user.entity";
import { Responser } from "@app/common/decorators/responser.decorator";
import { PublicTraceTokenRepository } from "@app/database/typeorm/repositories/public-trace-token.repository";
import { BatchService } from "../batch/batch.service";

@ApiTags("App / QR")
@Controller("app/qr")
@UseGuards(AppAuthGuard)
@ApiBearerAuth()
export class QrController {
  constructor(
    private readonly publicTraceTokenRepo: PublicTraceTokenRepository,
    private readonly batchService: BatchService,
  ) {}

  @Get()
  @ApiOperation({ summary: "[AUTH] Get list of trace tokens" })
  @Responser.handle("Get QR tokens")
  async list(
    @CurrentUser() user: User,
    @Query("batchId") batchId?: string,
    @Query("productId") productId?: string,
    @Query("targetType") targetType?: string,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ) {
    const where: any = { createdBy: user.id };
    if (batchId) where.batchId = batchId;
    if (productId) where.productId = productId;
    if (targetType) where.targetType = targetType;

    return this.publicTraceTokenRepo.findWithPagination(+page, +limit, {
      where,
      order: { createdAt: "DESC" },
    });
  }

  @Post("generate")
  @ApiOperation({ summary: "[AUTH] Generate QR token for target" })
  @Responser.handle("Generate QR token")
  async generate(
    @CurrentUser() user: User,
    @Body() body: { targetType: string; batchId?: string; productId?: string },
  ) {
    if (body.targetType === "batch" && body.batchId) {
      // Gọi lại logic tạo QR cho batch có sẵn trong BatchService
      const result = await this.batchService.generateQrCodes(user, body.batchId, {
        amount: 1,
      });
      return result.tokens[0]; // Trả về thông tin token
    }
    throw new Error("Unsupported targetType or missing target ID");
  }
}
```

---

## 📌 4. Tổng Kết

Chỉ cần Backend bổ sung **2 endpoints** trên (`GET /app/qr` và `POST /app/qr/generate`), toàn bộ luồng tạo và hiển thị tem QR trên Frontend hiện tại sẽ hoạt động hoàn hảo 100% mà không cần chỉnh sửa giao diện!
