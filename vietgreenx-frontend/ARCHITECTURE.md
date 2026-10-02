# VietGreenX — Frontend Architecture (MVP)

> **Cập nhật lần cuối:** 2026-06-05 — entity layer cleanup (input schemas → feature model; category/stats merged)
> Tài liệu dành cho toàn team. **Đọc trước khi tạo file mới.**

---

## 1. Route Map & Screen Zones

### Luồng điều hướng sau login

```
Đăng ký / Đăng nhập  →  /feed
  └─ onboardingCompleted = false  →  ProductTour auto-start (spotlight trên UI thật)
  └─ onboardingCompleted = true   →  /feed bình thường
```

`/onboarding` giữ redirect → `/feed` (legacy links).

### Toàn bộ route map

```
─── PUBLIC ZONE (no auth, SSG/SSR) ───────────────────────────────────────────

  /                     Landing page (SSG — TASK 43)
  /legal                Legal & Policy pages (TASK 50)

─── AUTH ZONE (guest only — nếu đã login → redirect /feed) ───────────────────

  /login                Đăng nhập (email hoặc SĐT — TASK 4)
  /register             Đăng ký: tab SĐT / Email → wizard trong RegisterWizard (TASK 1,2)
                        · Phone: SĐT → OTP → tài khoản + chọn role
                        · Email: email → kiểm tra hộp thư → /verify-email?token=...
  /verify-email         Hoàn tất đăng ký email (VerifyEmailForm)
  /otp                  Xác thực OTP 6 số (legacy/alternate — TASK 1)
  /forgot-password      Quên mật khẩu (TASK 5)
  /reset-password       Đặt lại mật khẩu (TASK 5)

─── APP ZONE (protected — route group: (dashboard)) ──────────────────────────

  Feed & Posts
  ├── /feed                         Bảng tin (TASK 12)
  └── /post/[id]                    Chi tiết bài viết (PostDetailView — comments phase sau, TASK 14)

  Profile & Settings
  ├── /profile                      Hồ sơ cá nhân (my profile view — TASK 8)
  ├── /profile/edit                 Chỉnh sửa hồ sơ (TASK 8)
  └── /settings                     Cài đặt tài khoản: bảo mật/notif/privacy/block (TASK 63)

  Green Profile (seller, cooperative, enterprise)
  ├── /green-profile                Danh sách hồ sơ xanh (TASK 22)
  ├── /green-profile/create         Tạo hồ sơ xanh (TASK 22)
  ├── /green-profile/[id]/edit      Chỉnh sửa (TASK 22)
  ├── /green-profile/[id]/seasons   Quản lý mùa vụ (TASK 24)
  └── /green-profile/[id]/log       Nhật ký sản xuất — append-only (TASK 25)

  Products & Batches (seller+)
  ├── /products                     Danh sách sản phẩm (TASK 26)
  ├── /products/create              Tạo sản phẩm (TASK 26)
  ├── /products/[id]                Chi tiết sản phẩm (TASK 26)
  ├── /batches                      Danh sách lô hàng (TASK 27)
  ├── /batches/create               Tạo lô hàng (TASK 27)
  └── /batches/[id]                 Chi tiết lô hàng (TASK 27)

  QR Traceability (seller+)
  └── /qr                           Quản lý QR, quota, download (TASK 28, 56)

  Marketplace
  ├── /marketplace                  Tìm kiếm & lọc (TASK 33)
  ├── /marketplace/sell/create      Đăng bán (TASK 31 — seller, coop, enterprise)
  ├── /marketplace/buy/create       Đăng yêu cầu mua (TASK 32 — coop, enterprise)
  └── /marketplace/[id]             Chi tiết giao dịch

  Chat & Inbox (TASK 18, 19)
  ├── /chat                         Inbox list — desktop: split panel (TASK 19)
  └── /chat/[conversationId]        Conversation — desktop: 2-panel, mobile: full (TASK 18)

  Notifications & Search
  ├── /notifications                Trung tâm thông báo (TASK 20)
  └── /search                       Tìm kiếm toàn cục (TASK 21)

  Organization (cooperative, enterprise)
  ├── /org                          Dashboard tổ chức của tôi (TASK 9)
  ├── /org/members                  Quản lý thành viên (TASK 9)
  └── /org/edit                     Chỉnh sửa thông tin tổ chức (TASK 9)

  Membership
  └── /pricing                      Trang gói dịch vụ (TASK 55a)

─── PUBLIC DYNAMIC (no auth, SSR, SEO) ────────────────────────────────────────

  /[username]           Hồ sơ công khai của user (TASK 8, 23)
                        vd: vietgreenx.vn/nguyenvana
  /trace/[token]        Trang truy xuất QR — mobile-first (TASK 29)
                        vd: vietgreenx.vn/trace/01HX...
  /org/[slug]           Trang tổ chức công khai (TASK 9)
                        vd: vietgreenx.vn/org/htx-xanh-hanoi

─── ERROR PAGES ───────────────────────────────────────────────────────────────

  /403                  Không có quyền
  (404)                 not-found.tsx — Next.js tự gọi khi notFound()
```

> **⚠️ Admin:** Là project riêng biệt, KHÔNG có trong codebase này.

---

## 2. Route Protection — 3 tầng (defense in depth)

| Tầng                   | File                              | Chạy ở đâu          | Làm gì                                                                         |
| ---------------------- | --------------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| **1. Edge middleware** | `src/middleware.ts`               | Edge, trước render  | Check cookie `access_token` tồn tại (mirror từ login) → redirect sớm           |
| **2. Client gate**     | `src/shared/auth/AuthWrapper.tsx` | Client, sau hydrate | Hydrate user qua Bearer + `GET /users/:id/profile`, check roles |
| **3. Backend guards**  | NestJS Guards                     | Mỗi API call        | Verify JWT signature + RBAC thật — **lớp bảo mật duy nhất đáng tin**           |

> ⚠️ Tầng 1 & 2 = UX only (tránh flash, redirect mượt). Không verify JWT ở FE.

### Thiết kế đặc biệt cho `/org`

```
/org          → protected (my org dashboard)   → check exact match
/org/members  → protected (member management)  → check exact match
/org/edit     → protected (edit org)           → check exact match
/org/[slug]   → PUBLIC (org profile, SSR)      → KHÔNG protected
```

Middleware dùng `isProtectedPath()` phân biệt bằng exact match, không prefix.

### RBAC phía client

`src/shared/auth/roles.ts` — `PERMISSION_MAP` khớp 1-1 với Backend. **Role groups** dùng chung cho `AuthWrapper`:

```ts
import {
  AuthWrapper,
  PRODUCTION_ACCESS_ROLES,   // seller, cooperative, enterprise, admin
  ORG_DASHBOARD_ROLES,       // cooperative, enterprise, admin
  ORG_EDIT_ROLES,            // cooperative, enterprise
  MARKETPLACE_SELL_ROLES,
  MARKETPLACE_BUY_ROLES,
} from "@/shared/auth";

// Route-level
<AuthWrapper requiredRoles={PRODUCTION_ACCESS_ROLES}>
  <GreenProfilePage />
</AuthWrapper>

// UI-level
const { can } = useUser();
{can("qr_generate") && <GenerateQRButton />}
```

| Route group | Constant | Roles |
| --- | --- | --- |
| Green profile, products, batches, QR | `PRODUCTION_ACCESS_ROLES` | seller, cooperative, enterprise, admin |
| Org dashboard / members | `ORG_DASHBOARD_ROLES` | cooperative, enterprise, admin |
| Org edit | `ORG_EDIT_ROLES` | cooperative, enterprise |
| Marketplace sell create | `MARKETPLACE_SELL_ROLES` | seller, cooperative, enterprise, admin |
| Marketplace buy create | `MARKETPLACE_BUY_ROLES` | cooperative, enterprise, admin |

> Nav sidebar & bottom nav dùng `canAccessNavRoute()` (`shared/auth/route-access.ts`) — cùng role groups với page `AuthWrapper`.

### Trạng thái module (layout MVP)

| Module | Widget | API wired | Ghi chú |
| --- | --- | --- | --- |
| Auth, posts, profile | feed, profile, post | ✅ | CRUD posts, session hydrate |
| Green profile | green-profile | scaffold | `greenProfileService` + queries; UI mock |
| Products, batches | product-dashboard, batch-dashboard | mock | `LAYOUT_PREVIEW_*` |
| QR / trace | qr, traceability | mock | Public `/trace/demo` |
| Marketplace | marketplace | mock | B2B, no checkout |
| Search, notifications | search, notifications | mock | |
| Org, pricing | org-dashboard, pricing | mock | |
| Chat | app-shell overlay | stub | `/chat/*` placeholder |

---

## 3. Folder Structure & Layer Rules (FSD-inspired)

```
src/
├── middleware.ts                    ← Edge route protection (tầng 1)
│
├── app/                             ← CHỈ route definitions. File mỏng, ít logic.
│   ├── layout.tsx                   Root: font (Be Vietnam Pro), ErrorBoundary, AppProviders
│   ├── page.tsx                     / → Landing page
│   ├── not-found.tsx                Global 404
│   ├── error.tsx                    Global error boundary
│   │
│   ├── (auth)/                      Auth zone: login, register, verify-email, otp, forgot/reset-password
│   │   └── layout.tsx               PublicPageShell from widgets/public-layout
│   │
│   ├── (dashboard)/                 App zone: tất cả protected pages
│   │   ├── layout.tsx               AuthWrapper + AppShell + Suspense
│   │   ├── feed/
│   │   ├── profile/edit/
│   │   ├── settings/
│   │   ├── search/
│   │   ├── notifications/
│   │   ├── pricing/
│   │   ├── post/[id]/
│   │   ├── green-profile/           create/, [id]/edit/, [id]/seasons/, [id]/log/
│   │   ├── products/                create/, [id]/
│   │   ├── batches/                 create/, [id]/
│   │   ├── qr/
│   │   ├── marketplace/             sell/create/, buy/create/, [id]/
│   │   ├── chat/                    layout.tsx (split panel) + [conversationId]/
│   │   └── org/                     members/, edit/
│   │
│   ├── (public)/                    Public pages: legal
│   ├── onboarding/                  Legacy redirect → /feed (product tour ở AppShell)
│   ├── trace/[token]/               QR trace — public SSR
│   ├── org/[slug]/                  Public org profile — public SSR
│   └── [username]/                  Public user profile — public SSR (top-level dynamic)
│
├── shared/                          ← Code dùng chung, không phụ thuộc feature nào
│   ├── api/
│   │   ├── api.ts                   Axios + Bearer token, 401 refresh via POST /auth/refresh
│   │   └── create-service.ts        Factory: createService("/posts") → {get, post, put, patch, delete}
│   ├── auth/
│   │   ├── AuthWrapper.tsx          Client gate: verify session, check roles
│   │   ├── welcome-storage.ts       localStorage: product tour completion per user
│   │   ├── token-storage.ts         access/refresh token (localStorage) + cookie mirror cho middleware
│   │   ├── useUser.ts               Hook: { user, role, can(), hasRole(), isAuthenticated }
│   │   ├── roles.ts                 UserRole enum + PERMISSION_MAP + role groups + can()
│   │   ├── auth.schema.ts           Zod: authUserSchema
│   │   ├── auth-token.schema.ts     Zod: authTokenResponseSchema (login/refresh)
│   │   ├── profile.schema.ts        Zod: profileResponseSchema (session hydrate)
│   │   └── auth.types.ts            AuthUser, AuthState interfaces
│   │   (session hydrate: `features/auth/api/session.service.ts` + `AuthProvider`)
│   ├── config/env.mjs               @t3-oss/env-nextjs — validated env vars
│   ├── i18n/                        Locale detection + `shell.copy.ts` (top/side nav strings)
│   ├── navigation/
│   │   ├── shell-nav.config.ts      SHELL_NAV_ITEMS, SHELL_TOP_NAV_ITEMS
│   │   ├── shell-nav.icons.ts       Lucide map + feed shortcut tiles
│   │   └── index.ts                 Barrel — import `@/shared/navigation`
│   ├── lib/
│   │   ├── cn.ts                    clsx + tailwind-merge helper
│   │   ├── toast.ts                 Sonner wrapper (toastService.success/error)
│   │   └── chat-overlay.store.ts   Zustand: quản lý Facebook-style popup chat windows
│   ├── routing/
│   │   ├── route-contract.ts        ROUTES object + isProtectedPath() + MIDDLEWARE_MATCHER
│   │   └── index.ts                 Barrel export
│   ├── seo/                         JsonLd, buildMetadata(), schema builders (Product, Org, Person)
│   └── ui/                          shadcn/ui primitives: Button, Input, Card, Avatar, Dialog, AlertDialog…
│
├── entities/                        ← Domain response models. Zod schemas + pure helpers.
│   │                                ← API ở `entities/*/api/` chỉ khi endpoint dùng chéo nhiều feature (xem §3.1).
│   │                                ← Form/mutation input → `features/*/model/*-input.schema.ts`.
│   ├── user/                        UserAvatar, PublicUser, profile schema, fetchUserProfile()
│   ├── media/                       Media upload V1 (upload-url → S3 → complete)
│   ├── location/                    VN address proxy client (Open API v1/v2) — service only
│   ├── post/                        Post, PostAuthor, PostMedia, PostTag — API response schemas
│   ├── product/                     Product schema + types (TASK 26)
│   ├── green-profile/               GreenProfile schema + isCertified() (TASK 22)
│   ├── batch/                       Batch schema + types (TASK 27)
│   ├── crop-season/                 CropSeason schema (TASK 24)
│   ├── organization/                Organization + member response schemas (TASK 9)
│   ├── comment/                     Comment response schema (engagement)
│   ├── reaction/                    Reaction response schema + enums (engagement)
│   ├── follow/                      Follow response schema
│   ├── block/                       Block list response schema
│   └── production-log/              ProductionLog schema — append-only (TASK 25, scaffold)
│
├── features/                        ← Business features. Mỗi feature = 1 folder khép kín.
│   ├── auth/                        Login, Register, OTP, session.service, AuthProvider, AuthGuestGuard
│   ├── account/                     Settings: password, email, phone, delete account
│   ├── onboarding/                  ProductTourProvider, spotlight overlay
│   ├── posts/                       PostCard, FeedList, PostDetailView, CRUD dialogs; category catalog schema
│   ├── profile/                     ProfileHeader, ProfileEditForm, ProfileCompletionBanner
│   ├── landing/                     Landing page sections
│   ├── green-profile/               api + model scaffold; GreenProfileCard (UI mock)
│   ├── products/                    Product forms/shells (layout mock)
│   ├── batches/                     Batch forms/shells (layout mock)
│   ├── crop-season/                 Crop season API + constants
│   ├── comment/                     CommentSection, CRUD dialogs
│   ├── reaction/                    Post/comment reaction hooks
│   ├── follow/                      FollowUserButton
│   ├── block/                       Block list, user search (settings)
│   ├── stats/                       Public stats for landing
│   ├── traceability/                QRDashboardShell, trace public UI
│   ├── marketplace/                 Sell/buy offer shells (layout mock)
│   ├── organization/                Org member/verify UI; input schemas in model/
│   ├── notifications/               NotificationList, NotificationRow
│   ├── search/                      GlobalSearch UI
│   └── pricing/                     Pricing tier cards
│
└── widgets/                         ← Composition từ nhiều features. Dùng trong layouts.
    ├── app-providers/               AppProviders — QueryClientProvider + AuthProvider
    ├── app-shell/                   AppShell, AppShellBody, AppTopNav, AppTopNavCenter, AppSideNav, AppBottomNav, ChatOverlay
    ├── public-layout/               PublicPageShell, PublicSplitLayout, AuthStoryPanel
    ├── feed/                        FeedScreen, FeedModuleNav, FeedProfileBanner
    ├── profile/                     ProfileScreen
    ├── post/                        PostDetailScreen
    ├── green-profile/               Green profile hub + create/edit/seasons/log screens
    ├── product-dashboard/             Product list/create/detail screens
    ├── batch-dashboard/               Batch list/create/detail screens
    ├── qr/                          QR management screen
    ├── marketplace/                 Marketplace hub + sell/buy create + detail
    ├── search/                      Search results screen
    ├── notifications/               Notifications screen
    ├── org-dashboard/               Org hub, members, edit screens
    └── pricing/                     Pricing screen
    (stubs — chưa wire: production-dashboard/, qr-scanner/)
```

### Import Rules — BẮT BUỘC

| Layer       | Được import từ                      | KHÔNG import từ                   |
| ----------- | ----------------------------------- | --------------------------------- |
| `app/`      | Tất cả                              | —                                 |
| `widgets/`  | `features/`, `entities/`, `shared/` | `app/`                            |
| `features/` | `entities/`, `shared/`              | `widgets/`, `app/`, features khác |
| `entities/` | `shared/`                           | `features/`, `widgets/`, `app/`   |
| `shared/`   | Không import nội bộ                 | Tất cả layers trên                |

> Feature A cần logic của feature B → move xuống `entities/` hoặc `shared/`.

### 3.1 Entity API (`entities/*/api/`) — khi nào được phép

Mặc định **feature** sở hữu `api/*.service.ts` + `*.queries.ts`. Chỉ đặt HTTP client trong **entity** khi:

| Điều kiện                                                  | Ví dụ trong repo                                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Endpoint gắn với **một domain object** dùng bởi ≥2 feature | `entities/user/api` → `fetchUserProfile`, `patchUserProfile` (auth hydrate + profile edit) |
| Infrastructure domain, không phải “use case”               | `entities/media/api` — upload-url / complete                                               |
| Proxy/helper không thuộc feature cụ thể                    | `entities/location/api` — VN provinces/wards                                               |

**Quy tắc:**

- Entity API chỉ gọi `createService` / `fetch` + **Zod validate**; không toast, không redirect.
- **Query hooks** (`useQuery`, `useMutation`) đặt trong `features/*/api/*.queries.ts` — vd. `features/profile/api/location.queries.ts` bọc `entities/location`.
- Feature bọc entity API trong `features/*/api/*.service.ts` khi cần thêm orchestration (vd. `profile.service.uploadAvatar` gọi `uploadMedia` + `patchUserProfile`).
- Feature **mới** ưu tiên service + queries trong `features/` trước; chỉ nâng HTTP client lên entity khi có consumer thứ hai.
- **Response schema** → `entities/<domain>/model/`; **form/mutation input** → `features/<feature>/model/` (vd. `organization-input.schema.ts`). Schema chỉ 1 feature dùng → đặt luôn trong feature model (vd. `features/posts/model/category.schema.ts`, `features/stats/model/stats.schema.ts`).

---

## 4. State Management

```
AppProviders  (src/widgets/app-providers/AppProviders.tsx)
  ├── QueryClientProvider     ← Server state: posts, profiles, org, marketplace...
  └── AuthProvider            ← Session state: user, role, status (features/auth)
        │
        └── useUser()         ← Hook dùng ở mọi component
              { user, role, status, isAuthenticated, can(), hasRole(), refresh, logout }
```

| Loại state        | Tool                    | Ví dụ                                        |
| ----------------- | ----------------------- | -------------------------------------------- |
| Server data (API) | TanStack Query          | feed, danh sách sản phẩm, profile            |
| Auth / session    | AuthContext + useUser() | user info, login status                      |
| Global UI         | Zustand                 | Chat overlay windows (chat-overlay.store.ts) |
| Local UI          | useState / useReducer   | form step, modal open, dropdown              |

> **Không dùng useState để cache API response.** Không tự fetch `/auth/me` trong component.

---

## 5. AppShell Layout

```
Desktop (≥ md) — route ≠ /feed              /feed (FB-style 3-column cluster)
┌────────────────────────────────┐         ┌──────────────────────────────────┐
│ AppTopNav (logo | center icons | actions) │  same TopNav                    │
├────────┬───────────────────────┤         ├──────────────────────────────────┤
│ Side   │  Main (vgx-social-canvas)│         │ Main only — no shell SideNav    │
│ Nav    │  module pages            │         │  [320 nav | 680 feed | 320 rail]│
└────────┴───────────────────────┘         │  centered max-w ~1520px          │
│ ChatOverlay (fixed bottom-right)│         └──────────────────────────────────┘
└─────────────────────────────────┘

Mobile (< md): Main + AppBottomNav (no side nav)
```

- `AppShellBody`: không render `AppSideNav` — ghost left rail nằm trong `SocialAppLayout` (mọi dashboard route, trừ `/chat` immersive).
- `AppTopNavCenter`: icon module giữa top bar (Bảng tin, Chợ, …) — `SHELL_TOP_NAV_ITEMS` + `canAccessNavRoute`.
- Feed UI pieces: `features/posts` (composer + hashtag typeahead, list, aside, stories, suggestions) compose trong `widgets/feed/FeedScreen`.

### Module page primitives (`shared/ui`)

| Primitive | File | Vai trò |
| --- | --- | --- |
| `SocialAppLayout` | `widgets/app-shell/SocialAppLayout.tsx` | Ghost rail + center + optional right rail; variants `social` \| `workspace` \| `focused` |
| `AppModuleRail` | `widgets/app-shell/AppModuleRail.tsx` | Ghost left nav (shortcuts, footer) — shared feed + modules |
| `ModulePageShell` | `widgets/app-shell/ModulePageShell.tsx` | `width` → variant mapping; bọc `SocialAppLayout` |
| `ModulePageHeader` | `module-page-header.tsx` | Tiêu đề + subtitle + actions (module list/hub) |
| `ElevatedCard` | `elevated-card.tsx` | Card trắng nổi (`vgx-elevated-surface`) |
| Width tokens | `page-layout.ts` | `form` 720 · `hub` 840 · `work` 960 · `profile` 1120 · `post` 720 · `feed` 1520 |

**Canvas theo route:**

| Canvas | Routes | Pattern |
| --- | --- | --- |
| Social A | `/feed`, `/post/[id]` | Feed: 3-col `width="feed"`; Post: `width="post"` |
| Module B | marketplace, products, batches, qr, org, pricing, notifications, search | SideNav + `width="work"` |
| Profile C | `/profile` | `width="profile"` (2-col trong widget) |
| Hub | green-profile/* | `width="hub"` |
| Form | creates, edits, `/settings` | `width="form"` |
| Full-bleed D | `/chat/*` | Không bọc `ModulePageShell` |

Widget screen bọc `ModulePageShell`; feature shell/card dùng `ElevatedCard` hoặc `VGX_ELEVATED_SURFACE`.

**Right rail (Wave 3):** workspace/hub screens truyền `rightRail` — `WorkspaceRailCard` + module rails trong `widgets/app-shell/workspace-rails.tsx`. `FarmTipsRail` (ghost text) xếp dưới CTA card. Form/focused (`width="form"`) không rail.

**Chat — 2 chế độ (TASK 18, 19):**

- **Popup** (desktop): Zustand `useChatOverlay()` → max 3 windows, minimize/close
- **Full page** `/chat/[id]`: split panel desktop, full screen mobile

**Chat layout** (`/chat/*`) override main content thành full-height `h-[calc(100vh-3.5rem)]` để chat chiếm hết viewport.

### Feed & Profile — widget compose

| Route | Page | Widget | Ghép feature |
| --- | --- | --- | --- |
| `/feed` | `app/(dashboard)/feed/page.tsx` | `widgets/feed/FeedScreen` | `features/posts` + `features/profile` (banner); `FeedModuleNav` trong widget |
| `/profile` | `app/(dashboard)/profile/page.tsx` | `widgets/profile/ProfileScreen` | `features/posts` + `features/profile` (header, intro) |

- `features/posts` và `features/profile` **không import lẫn nhau** — compose ở widget.
- List bài **`/feed`:** `GET /feed` (`feedService.list` + `useDiscoveryFeed`) — cursor pagination, mode `discovery`.
- List bài **`/profile`:** `GET /posts/me` (`postService.listMyPosts` + `useMyPostsFeed`) — timeline của user.
- **Post CRUD (MVP):** create qua `CreatePostComposer`; owner edit caption (`PATCH`) / soft delete qua menu ⋯ trên `PostCard` → `EditPostDialog`, `DeletePostDialog`. Detail: `/post/[id]` → `PostDetailView` + `GET /posts/:id`.
- **Post tags (metadata có cấu trúc):** `tags[]` (`product` | `region` | `category`) + field `category` (loại nội dung bài) — wire qua `postService` / `PostTagAttachToolbar` · `PostTagEditor`; picker catalog `GET /app/categories` (`features/posts/api/category.service.ts`, schema `features/posts/model/category.schema.ts`), region từ `entities/location`, product từ `features/products/api/product.service.ts`.
- **Social hashtags (inline `#` trong `body`):** BE derive `hashtags[]` từ `body` — FE **không** gửi `hashtags` trong create/update. Response validate qua `entities/post` (`postSchema.hashtags`). Typeahead `GET /posts/hashtags?q=` → `postService.searchHashtags` + `useHashtagSearch` (`staleTime` 60s). Composer: `PostComposerTextarea` (caret portal dropdown); card/detail: linkify qua `PostBodyContent`. Share: `POST /shares` (`shareService`) + Web Share / clipboard trên `PostCard`. Client cap 30 hashtag (`parse-body-hashtags`). Feed theo hashtag / `@` mention — phase sau.
- Comments/reactions — phase sau (TASK 14).
- Form edit hồ sơ: `app/.../profile/edit/page.tsx` → `ProfileEditForm` (feature trực tiếp, không cần widget).
- Auth register: `RegisterWizard` trong `PublicSplitLayout` (tab SĐT/Email + story panel); tab content ở `PhoneRegisterTab` / `EmailRegisterTab`.
- Product tour: `ProductTourProvider` trong `AppShell` — auto-start trên `/feed` khi `!onboardingCompleted`; hoàn tất qua `markWelcomeSeen()`.

---

## 6. Cách phân chia việc cho team

**Quy tắc:** Mỗi dev = 1 feature folder. Đụng vào `app/` layer chỉ để wire feature vào page.

| Dev      | Ownership Sprint 3                                    | Ownership Sprint 4                           |
| -------- | ----------------------------------------------------- | -------------------------------------------- |
| Dev 1    | `features/green-profile/` + `entities/green-profile/` | `features/traceability/` + `entities/batch/` |
| Dev 2    | `features/posts/` + `entities/production-log/`        | `features/marketplace/`                      |
| TechLead | `shared/` + `widgets/app-shell/` + wire `app/` pages  | Review + `shared/lib/chat-overlay.store.ts`  |

**Nguyên tắc không conflict:**

- Page trong `app/` = vỏ mỏng, chỉ `import X from "@/features/xxx"` → hiếm sửa
- Barrel `index.ts` = public API duy nhất. Import qua barrel, không deep-import
- `entities/` = contract chung → sửa ở đây, cả team thấy

---

## 7. Conventions

### Naming

| Loại              | Pattern       | Ví dụ                                    |
| ----------------- | ------------- | ---------------------------------------- |
| Component         | PascalCase    | `PostCard.tsx`, `GreenProfileForm.tsx`   |
| Hook              | `useXxx`      | `usePostsFeed`, `useGreenProfileByUser`  |
| Service           | `xxxService`  | `postService`, `greenProfileService`     |
| Query key factory | `xxxKeys`     | `postKeys`, `greenProfileKeys`           |
| Zod schema        | `xxxSchema`   | `postSchema`, `createGreenProfileSchema` |
| Derived type      | `Xxx`         | `type Post = z.infer<typeof postSchema>` |
| Store             | `useXxxStore` | `useChatOverlay`                         |

### File structure trong 1 feature

```
features/green-profile/
  api/
    green-profile.service.ts   ← createService() calls + Zod validation
    green-profile.queries.ts   ← useQuery / useMutation hooks + key factory
  model/
    green-profile.schema.ts    ← Zod form input schemas + derived types (response ở entities/green-profile)
  ui/
    GreenProfileCard.tsx       ← Presentational (props only)
    GreenProfileForm.tsx       ← Container (hooks + form)
    GreenProfileList.tsx       ← Container (query + render list)
  index.ts                     ← Barrel: chỉ export những gì public ra ngoài
```

### Commit messages

```
feat(green-profile): add multi-step create form (TASK 22)
fix(auth): support phone identifier in login (TASK 4)
refactor(entities): expand user entity with PublicUser schema
chore(routes): add /marketplace routes to middleware matcher
```

### Ghi chú quan trọng cho SEO pages

- **Public SSR pages** (`/[username]`, `/trace/[token]`, `/org/[slug]`): dùng `publicApi` (không cookie), có `generateMetadata()`, có `JsonLd`
- **Protected pages**: không cần SEO, không cần `generateMetadata()`
- Trang QR trace `/trace/[token]` phải load < 2s, mobile-first (TASK 29)
