# VietGreenX — FSD Guide cho team (MVP)

VietGreenX = **Social + E-commerce (B2B) + Traceability (QR)**. Để code không "nát"
khi nhiều intern làm song song, mọi tính năng PHẢI tuân thủ phân tầng FSD dưới đây.

## Quy tắc 1 câu

> **`entities` = danh từ (dữ liệu là gì) · `features` = động từ (làm gì với dữ liệu) · `widgets` = lắp ghép nhiều feature thành block lớn · `shared` = dùng chung toàn dự án.**

Phụ thuộc một chiều: `app → widgets → features → entities → shared`.
Tầng trên import tầng dưới, KHÔNG ngược lại. Import qua `index.ts` của mỗi slice.

## Bản đồ layer (2026-06 — layout MVP)

```
src/
├─ app/            route + layout (mỏng — import widgets hoặc feature form trực tiếp)
├─ widgets/        app-providers · app-shell · feed (FeedScreen, FeedModuleNav) · profile · post · green-profile ·
│                  product-dashboard · batch-dashboard · qr · marketplace · search ·
│                  notifications · org-dashboard · pricing · public-layout
├─ features/       auth · account · posts · profile · onboarding · landing · green-profile ·
│                  products · batches · certification · crop-season · production-log ·
│                  traceability · marketplace · organization · comment · reaction ·
│                  follow · block · stats · notifications · search · pricing
├─ entities/       post · user · green-profile · product · batch · organization ·
│                  comment · reaction · follow · block · crop-season · production-log ·
│                  certification · notification · media · location · qr-quota ·
│                  public-trace-token
│                  (HTTP client chéo-feature: user · media · location — xem ARCHITECTURE §3.1)
└─ shared/         ui · api · auth · routing · navigation · i18n (shell.copy) · seo · config · lib
```

**Providers:** `AppProviders` nằm ở `widgets/app-providers/` (QueryClient + `AuthProvider` từ `features/auth`). Root layout import từ `@/widgets/app-providers` — **không** đặt trong `shared/lib`.

## Ví dụ chuẩn: module "Nhật ký sản xuất" (Production Log)

| Việc | Đặt ở đâu |
|---|---|
| Type/Model `ProductionLog` | `entities/production-log/model/` |
| Card hiển thị 1 dòng nhật ký (dumb) | `entities/production-log/ui/` hoặc `features/traceability/ui/` |
| Form nhập liệu + gọi API tạo log | `features/production-log/` (`ui/` + `api/`) |
| Màn hình tổng hợp (layout) | `widgets/green-profile/GreenProfileLogScreen` |
| Route hiển thị | `app/(dashboard)/green-profile/[id]/log/page.tsx` (AuthWrapper + widget) |

## Map nghiệp vụ chính

- **Hồ sơ xanh:** entity `entities/green-profile`; API scaffold `features/green-profile/api/`; screens `widgets/green-profile/`.
- **Sản phẩm / lô hàng:** entity schemas; feature shells; widgets `product-dashboard`, `batch-dashboard`.
- **QR / truy xuất:** `features/traceability` + `widgets/qr`; public trace `/trace/[token]`.
- **Sàn B2B:** `features/marketplace` + `widgets/marketplace` (layout mock, chưa checkout).
- **Tổ chức:** `features/organization` + `widgets/org-dashboard`.

## RBAC trong page

Dùng constants từ `@/shared/auth`, không hardcode mảng role rải rác:

```ts
import { AuthWrapper, PRODUCTION_ACCESS_ROLES } from "@/shared/auth";
```

Nav (side + bottom) dùng `canAccessNavRoute(role, href)` — cùng role groups với page:

```ts
import { canAccessNavRoute, useUser } from "@/shared/auth";

const { role } = useUser();
navItems.filter((item) => canAccessNavRoute(role, item.href));
```

Tất cả sub-route green-profile (`create`, `[id]/edit`, `seasons`, `log`) cũng bọc `AuthWrapper`.

## Feed layout (đã có — 2026-06)

- `/feed`: widget `FeedScreen` — 3 cột căn giữa (`FeedModuleNav` | feed | `FeedAside`).
- Nav config dùng chung: `shared/navigation/shell-nav.config.ts` + `shared/i18n/shell.copy.ts`.
- Stories / Gợi ý / Sponsored rail = placeholder UI; wire API phase sau.
- **Post hashtags (Wave C — done):** `hashtags[]` trên entity `Post`; typeahead + linkify trong `features/posts` — xem **ARCHITECTURE.md §5** (phân biệt `tags[]` metadata vs `#` social).

## Ví dụ chuẩn: post hashtags (Wave C)

| Việc | Đặt ở đâu |
|---|---|
| `hashtags[]` trên response `Post` | `entities/post/model/post.schema.ts` |
| Schema response search `GET /posts/hashtags` | `features/posts/model/hashtag.schema.ts` |
| `searchHashtags()` + validate | `features/posts/api/post.service.ts` |
| `useHashtagSearch` + `hashtagKeys` | `features/posts/api/hashtag.queries.ts` |
| Parse token `#`, cap 30, caret mirror | `features/posts/lib/` |
| Composer typeahead + card linkify | `PostComposerTextarea`, `PostHashtagSuggestDropdown`, `PostBodyContent` |
| Ghép compose/profile | `widgets/feed/FeedScreen`, `widgets/profile/ProfileScreen` |

## Ví dụ chuẩn: post category catalog (post tags)

| Việc | Đặt ở đâu |
|---|---|
| `Category`, `CategoryList` response | `features/posts/model/category.schema.ts` (single-consumer — không tách entity) |
| `GET /app/categories` | `features/posts/api/category.service.ts` |
| Picker UI | `PostTagAttachToolbar` |

## Ví dụ chuẩn: organization (wire BE)

| Việc | Đặt ở đâu |
|---|---|
| `Organization`, members response | `entities/organization/model/` (response + helpers) |
| Form/mutation input (create, invite, verify…) | `features/organization/model/organization-input.schema.ts` |
| HTTP client + SSR fetch | `features/organization/api/organization.service.ts` |
| Query hooks dashboard/members | `features/organization/api/organization.queries.ts` |
| UI dashboard/members | `OrgDashboardShell`, `MemberListShell`, `InviteMemberDialog`, `OrgVerificationCard` |
| Accept invite | `AcceptInviteScreen` → `/accept-invite?token=` → `POST /organizations/invites/accept` |
| Public SSR `/org/[id]` | `fetchPublicOrganization()` từ `features/organization` (page import barrel) |
| Active org id (tạm) | `user.orgId` hoặc `setStoredActiveOrganizationId()` — BE chưa trả org trên auth |

## Ví dụ chuẩn: account + auth sessions + blocks

| Việc | Đặt ở đâu |
|---|---|
| Export / change password / email / phone / delete | `features/account/api/account.service.ts` + dialogs trong `features/account/ui/` |
| Auth sessions list/revoke | `features/auth/api/auth-session.service.ts` + `SessionsCard` |
| Block list response | `entities/block/model/` (`Block`, `BlockList`) |
| Block / user-search input + API | `features/block/model/` + `features/block/api/` + `BlockedUsersCard` |
| Settings page compose | `app/(dashboard)/settings/page.tsx` — ghép account + auth + block (không import feature↔feature) |
| Public stats landing | `features/stats/model/stats.schema.ts` + `features/stats/api/` → `GET /stats` → `PublicStatsStrip` |

## Module page layout (Wave 1 — 2026-06)

- **Widget** bọc `ModulePageShell` (`widgets/app-shell/`) — `width` map sang variant: `social` | `workspace` | `focused`.
- **Ghost rail** — `AppModuleRail` trong `SocialAppLayout`; `AppSideNav` không dùng làm nav chính.
- **Feature** dùng `ElevatedCard` / `VGX_ELEVATED_SURFACE` cho card trắng trên canvas xám — không tự `rounded-xl border bg-card` lẻ.
- **Wave 2 surface** — `ModulePageHeader` mặc định `elevated` (+ `toolbar` / `meta`); form/detail title gộp vào `ElevatedCard`; feature shell không tự `max-w-[…]` (shell lo width).
- **Wave 3 right rail** — `WorkspaceRailCard` + `widgets/app-shell/workspace-rails.tsx`; hub/work screens truyền `rightRail` vào `ModulePageShell`; copy trong `*.constants.ts` key `rail`.
- `/chat/*` giữ full-bleed — không bọc `ModulePageShell`.
- Chi tiết canvas theo route: **ARCHITECTURE.md §5**.

## ⚠️ Việc cần dọn (nợ kỹ thuật)

### ✅ Đã wire BE (2026-06)

- **Green profile** — CRUD, publish (cá nhân + org), media, route gate
- **Agriculture** — crop-season, production-log, certification, products, batches
- **Notifications** — list, unread count, mark read (badge trên top/bottom nav)
- **Social** — feed, posts, comments, reactions, follow, block, organization dashboard
- **Account / auth** — credentials, sessions, OTP flows

### ⏸ Chờ BE (không làm FE mock thêm)

- **Marketplace** — `trade_posts` / quotation (schema DB có, chưa controller)
- **Chat** — `messaging.*` (schema DB có, chưa controller)
- **Search global** — chỉ có `GET /users/search` + hashtag; trang search vẫn layout preview
- **QR** — generate/list/quota + public `/trace/:token` (FE degrade + demo token)

### 🔧 Polish / phase sau

1. **Public profile** — `/[username]` (chưa có public API by username)
2. **Global feed** — tab following UI
3. **`@` mention** — composer placeholder
4. **Feed theo hashtag** — route + API
5. **Stub widgets** — `widgets/production-dashboard/`, `widgets/qr-scanner/`
6. **Nav vs route RBAC** — sync 100%
7. **Shared `Checkbox` primitive** — thay native checkbox ở vài form

### Entity API (`entities/*/api/`)

HTTP client đặt ở `entities/<domain>/api/` khi endpoint dùng chéo feature; **query hooks** ở `features/*/api/*.queries.ts`. Chi tiết: **ARCHITECTURE.md §3.1**.

## Checklist khi intern thêm tính năng mới

- [ ] Type/schema **API response** trong `entities/<x>/model/`; **form/mutation input** trong `features/<y>/model/` (vd. `organization-input.schema.ts`, `comment-input.schema.ts`).
- [ ] Schema chỉ 1 feature dùng → đặt luôn trong `features/<y>/model/` (vd. `category.schema.ts`, `stats.schema.ts`).
- [ ] Logic (form, mutation, query) trong `features/<y>/api/` + `features/<y>/ui/`.
- [ ] Component dùng chung (Button, Input, Dialog...) lấy từ `shared/ui`, không tự viết lại.
- [ ] UI copy tiếng Việt/Anh trong `*.constants.ts` của feature, không hardcode string rải component.
- [ ] Màu/spacing ưu tiên design tokens Tailwind (`primary`, `muted`, `border`…) — tránh hex lẻ khi polish UI.
- [ ] Mỗi slice export qua `index.ts`; chỗ khác import từ barrel, không reach sâu.
- [ ] Không để feature import feature khác (nếu cần → nâng lên widget hoặc dùng entity chung).
- [ ] Form POST/PATCH/DELETE: `GuardedForm` + `useGuardedSubmit` + `SubmitButton` — `className` layout áp lên fieldset (DEV-PLAYBOOK §3).
- [ ] Page protected: `AuthWrapper` + role group constant từ `shared/auth/roles.ts`.
