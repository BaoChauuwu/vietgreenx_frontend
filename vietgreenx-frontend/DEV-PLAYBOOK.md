# VietGreenX — Dev Playbook

> Đây là quy trình **bắt buộc** khi làm màn hình mới hoặc feature mới.
> Mục tiêu: tất cả dev viết code theo cùng một luồng → dễ review, dễ onboard người mới.

---

## Mục lục

1. [Quy trình làm feature mới](#1-quy-trình-làm-feature-mới-từ-a-đến-z)
2. [Làm màn hình có danh sách + fetch API](#2-làm-màn-hình-có-danh-sách--fetch-api)
3. [Làm form tạo / chỉnh sửa](#3-làm-form-tạo--chỉnh-sửa)
   - [Chống spam submit (double-click)](#chống-spam-submit-double-click)
4. [Làm trang protected (cần login / cần role)](#4-làm-trang-protected-cần-login--cần-role)
5. [Làm trang public SSR (SEO)](#5-làm-trang-public-ssr-seo)
6. [Checklist trước khi tạo PR](#6-checklist-trước-khi-tạo-pr)
7. [Anti-patterns — tuyệt đối không làm](#7-anti-patterns--tuyệt-đối-không-làm)

---

## 1. Quy trình làm feature mới (từ A đến Z)

### Bước 0 — Đọc task spec trước

Mở `VietGreenX_MVP_Tasks_v5.md`, tìm TASK liên quan. Hiểu rõ:

- Acceptance Criteria
- Subtask phía FE cần làm
- Dependencies (task này block / bị block bởi task nào)

---

### Bước 1 — Define Entity (nếu là domain object mới)

Nếu feature liên quan đến object domain mới (e.g., GreenProfile, Batch) → tạo/cập nhật entity trước.

**File:** `src/entities/{domain}/model/{domain}.types.ts`

```ts
// Ví dụ: entities/green-profile/model/green-profile.types.ts
import { z } from "zod";

// 1. Zod schema = source of truth (validate runtime + derive TS type)
export const greenProfileSchema = z.object({
  id: z.string().uuid(),
  farmName: z.string(),
  province: z.string(),
  certifications: z.array(z.enum(["VietGAP", "GlobalGAP", "Organic", "OCOP"])),
  farmAreaHa: z.number().positive(),
  createdAt: z.string().datetime(),
});

// 2. Type derived từ schema — KHÔNG hand-write interface riêng
export type GreenProfile = z.infer<typeof greenProfileSchema>;

// 3. Pure helpers (không có side effects, không gọi API)
export function isCertified(profile: GreenProfile): boolean {
  return profile.certifications.length > 0;
}
```

**Export qua barrel:**

```ts
// entities/green-profile/index.ts
export type { GreenProfile } from "./model/green-profile.types";
export { greenProfileSchema, isCertified } from "./model/green-profile.types";
```

> **Rule:** entities/ KHÔNG được import từ features/. Chỉ import từ shared/.

---

### Bước 2 — Tạo feature folder

```
src/features/{feature-name}/
  api/
    {name}.service.ts    ← gọi axios
    {name}.queries.ts    ← TanStack Query hooks
  model/
    {name}.schema.ts     ← Zod cho form input (không phải API response)
  ui/
    {Name}View.tsx       ← màn hình chính (hoặc nhiều file nhỏ hơn)
  index.ts               ← barrel export
```

---

### Bước 3 — Tạo service (API layer)

**File:** `src/features/{name}/api/{name}.service.ts`

```ts
import { createService } from "@/shared/api/create-service";
import { greenProfileSchema, type GreenProfile } from "@/entities/green-profile";

// createService("/green-profiles") → tạo factory với baseURL = /green-profiles
const http = createService("/green-profiles");

export const greenProfileService = {
  // GET /green-profiles/:id
  byId(id: string): Promise<GreenProfile> {
    return http.get<GreenProfile>(`/${id}`, undefined, { schema: greenProfileSchema });
  },

  // GET /green-profiles?userId=xxx
  byUser(userId: string): Promise<GreenProfile[]> {
    return http.get<GreenProfile[]>(
      "",
      { params: { userId } },
      { schema: z.array(greenProfileSchema) },
    );
  },

  // POST /green-profiles
  create(input: CreateGreenProfileInput): Promise<GreenProfile> {
    return http.post<GreenProfile, CreateGreenProfileInput>("", input, {
      schema: greenProfileSchema,
    });
  },

  // PATCH /green-profiles/:id
  update(id: string, input: Partial<CreateGreenProfileInput>): Promise<GreenProfile> {
    return http.patch<GreenProfile>(`/${id}`, input, { schema: greenProfileSchema });
  },
};
```

> **Rule:** Luôn truyền `schema` vào service method. Nếu BE trả sai shape → throw ngay, không silent bug.

---

### Bước 4 — Tạo Query hooks (TanStack Query)

**File:** `src/features/{name}/api/{name}.queries.ts`

```ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toastService } from "@/shared/lib/toast";
import { greenProfileService } from "./green-profile.service";

// ============================================================
// Query Key Factory — QUAN TRỌNG: tập trung keys ở đây
// ============================================================
export const greenProfileKeys = {
  all: ["green-profiles"] as const,
  byUser: (userId: string) => [...greenProfileKeys.all, "user", userId] as const,
  detail: (id: string) => [...greenProfileKeys.all, "detail", id] as const,
};

// ============================================================
// Read hooks
// ============================================================

/** Lấy green profile theo userId. Dùng trên trang Profile (TASK 22). */
export function useGreenProfileByUser(userId: string) {
  return useQuery({
    queryKey: greenProfileKeys.byUser(userId),
    queryFn: () => greenProfileService.byUser(userId),
    staleTime: 5 * 60_000, // 5 phút — profile không đổi liên tục
    enabled: Boolean(userId),
  });
}

/** Lấy detail — dùng trên form edit. */
export function useGreenProfileDetail(id: string) {
  return useQuery({
    queryKey: greenProfileKeys.detail(id),
    queryFn: () => greenProfileService.byId(id),
    enabled: Boolean(id),
  });
}

// ============================================================
// Mutation hooks
// ============================================================

export function useCreateGreenProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: greenProfileService.create,
    onSuccess: (created, variables, context) => {
      toastService.success("Đã tạo Green Profile thành công!");
      // Invalidate list của user → refetch tự động
      qc.invalidateQueries({ queryKey: greenProfileKeys.all });
    },
    onError: () => {
      toastService.error("Tạo Green Profile thất bại. Vui lòng thử lại.");
    },
  });
}

export function useUpdateGreenProfile(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<CreateGreenProfileInput>) => greenProfileService.update(id, input),
    onSuccess: (updated) => {
      toastService.success("Đã cập nhật!");
      // Update cache trực tiếp → không cần refetch network
      qc.setQueryData(greenProfileKeys.detail(id), updated);
      qc.invalidateQueries({ queryKey: greenProfileKeys.all });
    },
  });
}
```

> **Stale time guideline:**
>
> - Feed/posts: `30_000` (30s) — thay đổi thường xuyên
> - Hashtag typeahead: `60_000` (60s) — autocomplete, ít critical hơn feed
> - Profile/org: `5 * 60_000` (5 phút) — ít thay đổi
> - Categories/config: `30 * 60_000` (30 phút) — gần như tĩnh

---

### Bước 5 — Tạo Form Schema (nếu có form)

**File:** `src/features/{name}/model/{name}.schema.ts`

```ts
import { z } from "zod";

// Schema cho form CREATE (khác với entity schema — chỉ chứa input của user)
export const createGreenProfileSchema = z.object({
  farmName: z.string().min(1, "Vui lòng nhập tên trang trại").max(100),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  farmAreaHa: z.number({ invalid_type_error: "Phải là số" }).positive("Diện tích phải lớn hơn 0"),
  certifications: z.array(z.enum(["VietGAP", "GlobalGAP", "Organic", "OCOP"])),
});

export type CreateGreenProfileInput = z.infer<typeof createGreenProfileSchema>;
```

> **Rule:** Schema form ≠ Schema entity. Entity schema reflect shape của API response. Form schema reflect những gì user nhập.

---

### Bước 6 — Build UI Component

**Phân loại component:**

| Loại               | Đặc điểm                                         | Ví dụ                                        |
| ------------------ | ------------------------------------------------ | -------------------------------------------- |
| **Presentational** | Chỉ nhận props, không có hooks                   | `GreenProfileCard.tsx`, `PostCard.tsx`       |
| **Container**      | Có hooks (useQuery, useMutation, useState)       | `CreatePostComposer.tsx`, `ProfileEditForm.tsx` |
| **Page**           | Thin wrapper, import **widget** hoặc feature       | `app/(dashboard)/feed/page.tsx` → `FeedScreen`; `profile/page.tsx` → `ProfileScreen` |

**Template Presentational component:**

```tsx
// features/green-profile/ui/GreenProfileCard.tsx
import type { GreenProfile } from "@/entities/green-profile";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

interface GreenProfileCardProps {
  profile: GreenProfile;
  className?: string;
}

// Presentational: KHÔNG gọi hook ở đây
export function GreenProfileCard({ profile, className }: GreenProfileCardProps) {
  return (
    <Card className={className}>
      <CardContent className="space-y-2 p-4">
        <h3 className="font-semibold">{profile.farmName}</h3>
        <p className="text-muted-foreground text-sm">{profile.province}</p>
        <div className="flex flex-wrap gap-1">
          {profile.certifications.map((cert) => (
            <Badge key={cert} variant="secondary">
              {cert}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Template Container component (fetch + render):**

```tsx
// features/green-profile/ui/GreenProfileSection.tsx
"use client";

import { useUser } from "@/shared/auth";
import { useGreenProfileByUser } from "../api/green-profile.queries";
import { GreenProfileCard } from "./GreenProfileCard";

export function GreenProfileSection() {
  const { user } = useUser();
  const { data, isLoading, isError } = useGreenProfileByUser(user?.id ?? "");

  if (isLoading) {
    // Skeleton đồng bộ với shape của card
    return <div className="bg-muted h-32 w-full animate-pulse rounded-xl" />;
  }

  if (isError || !data?.length) {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">
        Chưa có Green Profile.{" "}
        <a href="/profile/green-profile/create" className="text-primary">
          Tạo ngay
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((profile) => (
        <GreenProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}
```

---

### Bước 7 — Wire vào Page (app/ layer)

Page trong `app/` chỉ là thin wrapper. Không đặt logic ở đây.

**Màn hình compose nhiều feature** → page import **widget**, không ghép feature trực tiếp:

```tsx
// app/(dashboard)/profile/page.tsx
import { getRequestLocale } from "@/shared/i18n/get-request-locale";
import { ProfileScreen } from "@/widgets/profile";

export const metadata = { title: "Hồ sơ | VietGreenX" };

export default function ProfilePage() {
  return <ProfileScreen locale={getRequestLocale()} />;
}
```

**Màn hình single-feature** (edit form, settings) → page import trực tiếp từ feature barrel:

```tsx
// app/(dashboard)/profile/edit/page.tsx
import { ProfileEditForm } from "@/features/profile";

export default function ProfileEditPage() {
  return <ProfileEditForm />;
}
```

---

### Bước 8 — Export qua barrel

```ts
// features/green-profile/index.ts
// Chỉ export những gì page/widget bên ngoài cần
export { GreenProfileSection } from "./ui/GreenProfileSection";
export { GreenProfileCard } from "./ui/GreenProfileCard";
export { useGreenProfileByUser, useCreateGreenProfile } from "./api/green-profile.queries";
// Không export internal helpers, service, schema (trừ khi cần)
```

---

## 2. Làm màn hình có danh sách + fetch API

### Pattern chuẩn

```tsx
"use client";

import { useXxxList } from "../api/xxx.queries";
import { XxxCard } from "./XxxCard";

import { useInfiniteScrollSentinel } from "../lib/use-infinite-scroll-sentinel";

export function XxxListView() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useXxxList();
  const sentinelRef = useInfiniteScrollSentinel({
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
    onLoadMore: () => void fetchNextPage(),
  });

  // Loading state — phải có, không để blank
  if (isLoading) return <XxxListSkeleton />;

  // Error state — phải có
  if (isError) return <ErrorMessage message="Không tải được dữ liệu" />;

  // Empty state — phải có
  if (!data?.pages[0]?.items.length) return <EmptyState />;

  return (
    <>
      {data.pages
        .flatMap((p) => p.items)
        .map((item) => (
          <XxxCard key={item.id} item={item} />
        ))}
      {hasNextPage ? (
        <div ref={sentinelRef} aria-busy={isFetchingNextPage}>
          {isFetchingNextPage ? <XxxListSkeleton rows={1} /> : null}
        </div>
      ) : null}
    </>
  );
}
```

### Infinite scroll (feed, marketplace)

```ts
// Dùng useInfiniteQuery thay vì useQuery khi có pagination
export function useXxxFeed() {
  return useInfiniteQuery({
    queryKey: xxxKeys.feed(),
    queryFn: ({ pageParam }) => xxxService.list(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
  });
}
```

---

## 3. Làm form tạo / chỉnh sửa

### Pattern chuẩn

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { createXxxSchema, type CreateXxxInput } from "../model/xxx.schema";
import { useCreateXxx } from "../api/xxx.queries";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function CreateXxxForm() {
  const { mutate, isPending } = useCreateXxx();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateXxxInput>({
    resolver: zodResolver(createXxxSchema),
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data, { onSuccess: () => reset() });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fieldName">Tên trường</Label>
        <Input id="fieldName" {...register("fieldName")} />
        {errors.fieldName && <p className="text-destructive text-sm">{errors.fieldName.message}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Lưu"}
      </Button>
    </form>
  );
}
```

### Form có nhiều bước (wizard)

Xem register làm mẫu:

- **`RegisterWizard`** — tab SĐT/Email trong `PublicSplitLayout` + link “Đã có tài khoản?”
- **`PhoneRegisterTab` / `EmailRegisterTab`** — step indicator + `StepSlide`; phone dùng 2 `useForm` (bước 1 + 3), OTP giữ `useState`
- Dùng `useState` track `step`; validate từng step trước khi next; mutation không qua form dùng `runGuarded`

### Validation & hiển thị lỗi (bắt buộc)

| Quy tắc | Chi tiết |
| ------- | -------- |
| **Một nguồn rule** | Zod schema (`createXxxSchema(locale)` hoặc `features/.../model`) — UI **không** tự validate format riêng |
| **Màu lỗi** | Lỗi field → `text-destructive` (đỏ). Hint → `text-muted-foreground` (xám). Success async (vd. username khả dụng) → xanh |
| **Không chặn im lặng** | Không `disabled` submit thay cho validate — user bấm submit phải thấy lỗi Zod đỏ như field khác |
| **Async check** | Chỉ dùng cho availability / server (vd. `UsernameField` + debounce). Format vẫn do Zod |
| **Locale** | Message Zod lấy từ `*.constants.ts` qua factory schema — không hardcode trong component |

**Username (đăng ký):** `createUsernameSchema(locale)` + `UsernameField` + `assertUsernameAvailableForSubmit()` — xem `features/auth/`.

Form đăng ký nên `mode: "onTouched"` để blur hiện lỗi format sớm.

---

### Chống spam submit (double-click)

Form **POST / PATCH / DELETE** dùng **stack chuẩn** — không tự implement guard riêng.

| Lớp           | Primitive                                                 | Vai trò                                                |
| ------------- | --------------------------------------------------------- | ------------------------------------------------------ |
| **UI**        | `useGuardedSubmit()` + `GuardedForm` + `SubmitButton`     | Lock đồng bộ, disable fieldset, nút loading thống nhất |
| **Mutation**  | `useSingleFlightMutation()` trong `*.queries.ts`          | Một HTTP request dù UI lọt                             |
| **Edit form** | `enabled: form.formState.isDirty` + `reset()` sau success | Không spam lưu cùng data                               |

**Reference:** `features/profile/ui/ProfileEditForm.tsx`, `features/auth/ui/LoginForm.tsx`

#### `GuardedForm` — layout class áp lên `<fieldset>`

Children render **bên trong `<fieldset>`**, không phải con trực tiếp của `<form>`.  
→ `className="flex flex-col gap-4"` (và `flex`, `gap-*`, `space-y-*`, `p-*`) **phải truyền qua `GuardedForm`** — component merge vào fieldset.

```tsx
// shared/ui/guarded-form.tsx — className → fieldset
<fieldset className={cn("m-0 min-w-0 border-0 p-0", className, fieldsetClassName)}>
```

Auth / CTA chính: `SubmitButton className="w-full"` để khớp input full-width.

#### Stack UI (bắt buộc)

```tsx
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { SubmitButton } from "@/shared/ui/submit-button";

const { mutate, isPending } = useCreateXxx();
const { guardFormEvent, release, isSubmitting, isDisabled } = useGuardedSubmit({
  isPending,
  enabled: true, // edit form: form.formState.isDirty
});

const onSubmit = guardFormEvent(
  form.handleSubmit(
    (data) => {
      mutate(data, { onSettled: () => release() });
    },
    () => release(),
  ),
);

return (
  <GuardedForm onSubmit={onSubmit} isSubmitting={isSubmitting} className="flex flex-col gap-4">
    {/* fields — gap-4 thực sự chạy vì nằm trong fieldset */}
    <SubmitButton isSubmitting={isSubmitting} disabled={isDisabled} className="w-full">
      Lưu
    </SubmitButton>
  </GuardedForm>
);
```

Nút mutation không qua form (wizard skip, delete confirm): `runGuarded(() => mutate(..., { onSettled: () => release() }))` — xem `DeletePostDialog.tsx`.

#### Pattern mutation (`useSingleFlightMutation`)

```tsx
"use client"; // bắt buộc trên *.queries.ts dùng hooks

import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";

export function useUpdateProfile() {
  return useSingleFlightMutation({
    mutationFn: (input) => profileService.update(userId, input),
    onSuccess: (data) => queryClient.setQueryData(profileKeys.me(userId), data),
  });
}
```

#### Form đã migrate

| Form           | File                                             | Ghi chú |
| -------------- | ------------------------------------------------ | ------- |
| Profile edit   | `ProfileEditForm.tsx`                            | `enabled: isDirty` |
| Login          | `LoginForm.tsx`                                  | CTA `w-full` |
| Verify email   | `VerifyEmailForm.tsx`                            | CTA `w-full` |
| Email register | `EmailRegisterTab.tsx` (step 1)                | CTA `w-full` |
| Phone register | `PhoneRegisterTab.tsx` (step 1, 3)               | Step 1: error cooldown + `w-full` |
| Create post    | `CreatePostComposer.tsx`                         | `PostComposerTextarea` — hashtag typeahead |
| Edit post      | `EditPostDialog.tsx`                             | `enabled: isDirty`, dialog; cùng textarea |
| Delete post    | `DeletePostDialog.tsx`                           | `runGuarded`, AlertDialog |
| Post detail    | `PostDetailView.tsx`                             | `usePostById` — comments phase sau |
| Newsletter     | `FooterNewsletter.tsx`                           | |

**Product tour (onboarding):** không còn wizard form — `features/onboarding/ProductTourProvider` auto-start trên `/feed` khi `!user.onboardingCompleted`. Hoàn tất tour gọi `markWelcomeSeen()` (`shared/auth/welcome-storage.ts`).

---

## 4. Làm trang protected (cần login / cần role)

### Case 1: Chỉ cần login

Đặt page vào `app/(dashboard)/` → tự động protected bởi layout.

### Case 2: Cần role cụ thể

Wrap component bằng `AuthWrapper` với `requiredRoles` (Admin là project riêng — không có route admin trong repo FE này):

```tsx
import { AuthWrapper } from "@/shared/auth";
import { GreenProfileForm } from "@/features/green-profile";
import { UserRole } from "@/shared/auth/roles";

export default function GreenProfileCreatePage() {
  return (
    <AuthWrapper requiredRoles={[UserRole.SELLER, UserRole.COOPERATIVE]}>
      <GreenProfileForm />
    </AuthWrapper>
  );
}
```

### Case 3: Ẩn/hiện UI theo quyền (không redirect)

```tsx
"use client";

import { useUser } from "@/shared/auth";

export function PostActions({ postAuthorId }: { postAuthorId: string }) {
  const { user, can } = useUser();

  const isOwner = user?.id === postAuthorId;
  const canDelete = isOwner && can("post_delete");

  return (
    <div className="flex gap-2">
      {canDelete && <DeletePostButton />}
      {can("content_manage") && <AdminHideButton />} {/* chỉ admin */}
    </div>
  );
}
```

---

## 5. Làm trang public SSR (SEO)

Dùng cho: Trang trace QR (`/product/[id]`), Trang profile công khai.

```tsx
// app/product/[id]/page.tsx
import { Metadata } from "next";
import { publicApi } from "@/shared/api/api"; // ← publicApi, không phải api

interface Props {
  params: { id: string };
}

// generateMetadata chạy server-side → perfect cho SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await publicApi.get(`/trace/${params.id}`).then((r) => r.data);
  return {
    title: `${product.name} | VietGreenX`,
    description: `Truy xuất nguồn gốc: ${product.farmName} — ${product.province}`,
    openGraph: {
      images: [product.imageUrl],
    },
  };
}

// Server Component → fetch thẳng, không cần useQuery
export default async function ProductTracePage({ params }: Props) {
  // Nếu không tìm thấy → notFound() từ next/navigation
  const data = await publicApi.get(`/trace/${params.id}`).then((r) => r.data);

  return (
    <main>
      <TracePageContent data={data} />
    </main>
  );
}
```

> **Rule:** Trang public SSR dùng `publicApi` (không có cookie), không bao giờ dùng `api` (authenticated).

---

## 6. Checklist trước khi tạo PR

```
Schema & Types
  [ ] Zod schema viết trước, type derived từ schema (không hand-write interface)
  [ ] Service method luôn có { schema } để validate response
  [ ] Form schema đặt trong model/, không nhét vào component

API & State
  [ ] Query keys dùng factory (xxxKeys.detail(id), xxxKeys.byUser(userId))
  [ ] staleTime phù hợp (không để mặc định 0 cho data ít thay đổi)
  [ ] Mutation có onSuccess (toast + invalidate) và onError (toast)
  [ ] Form POST/PATCH: `useGuardedSubmit` + `GuardedForm` + `SubmitButton` + `useSingleFlightMutation` (§3)
  [ ] `GuardedForm className` = layout trên fieldset; auth CTA `SubmitButton className="w-full"` khi full-width
  [ ] Không dùng useState để cache API response

UI
  [ ] Có loading state (skeleton, không để blank)
  [ ] Có error state (không để crash)
  [ ] Có empty state (không để blank list)
  [ ] "use client" chỉ đặt khi thực sự cần (form, hooks, event handlers)

Auth / Permission
  [ ] Trang protected trong (dashboard)/ hoặc có AuthWrapper
  [ ] UI ẩn/hiện theo can() — không hardcode role string
  [ ] Không đặt permission check trong service/business logic FE

Import Rules
  [ ] features/ không import từ features/ khác
  [ ] entities/ không import từ features/
  [ ] Import qua barrel index.ts, không deep-import

Code Quality
  [ ] Không có console.log còn sót
  [ ] Không có TODO comment chưa có issue
  [ ] Chạy: npm run typecheck (không có TS error)
  [ ] Chạy: npm run lint (không có ESLint error)
```

---

## 7. Anti-patterns — tuyệt đối không làm

### ❌ Fetch API trực tiếp trong component

```tsx
// BAD
export function MyComponent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then(setData);
  }, []);
}

// GOOD
export function MyComponent() {
  const { data } = usePostsFeed(); // TanStack Query
}
```

### ❌ Hard-code role check

```tsx
// BAD
{
  user?.role === "admin" && <AdminButton />;
}
{
  user?.role === "seller" || user?.role === "cooperative" ? <QRButton /> : null;
}

// GOOD
{
  can("content_manage") && <AdminButton />;
}
{
  can("qr_generate") && <QRButton />;
}
```

### ❌ Import deep vào internal file của feature khác

```tsx
// BAD — deep import feature internal
import { CreatePostInput } from "@/features/posts/model/post.schema";
import { useLogin } from "@/features/auth/api/auth.queries";

// GOOD — entity schema từ entities; feature types/hooks qua barrel
import { postSchema } from "@/entities/post";
import { useLogin } from "@/features/auth";
import type { CreatePostInput } from "@/features/posts";
```

### ❌ Đặt type/interface trong component file

```tsx
// BAD — type nằm trong component
interface PostCardProps {
  id: string;
  content: string;
}

// GOOD — type ở entity, import vào
import type { Post } from "@/entities/post";
interface PostCardProps {
  post: Post;
  className?: string;
}
```

### ❌ Không validate API response

```tsx
// BAD — trust BE blindly
const data = await http.get<Post>("/posts/1");
// Nếu BE trả thiếu field → runtime error không biết từ đâu

// GOOD — validate runtime
const data = await http.get<Post>("/posts/1", undefined, { schema: postSchema });
// Nếu BE trả sai → throw rõ ràng với field nào sai
```

### ❌ Gọi /auth/me trong component

```tsx
// BAD
export function Header() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch("/auth/me").then(...).then(setUser) }, []);
}

// GOOD — dùng context đã hydrate sẵn
export function Header() {
  const { user } = useUser();
}
```

### ❌ Chỉ `disabled={isPending}` cho nút submit

```tsx
// BAD — user spam click → nhiều PATCH trước khi isPending kịp true
<Button type="submit" disabled={isPending}>
  Lưu
</Button>;

// GOOD — §3 Chống spam submit
const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });
// + GuardedForm + SubmitButton + useSingleFlightMutation trong *.queries.ts
```

---

```tsx
// BAD — thêm "use client" mà không cần
"use client";
export function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>; // không có hook, không cần client
}

// GOOD — chỉ thêm khi thực sự dùng hook/event
("use client");
export function InteractiveCard({ title }: { title: string }) {
  const [open, setOpen] = useState(false); // cần hook → cần "use client"
}
```

---

## Reference nhanh

| Cần làm                        | Xem mẫu ở                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Service + Zod validate         | `features/posts/api/post.service.ts`                                                                                     |
| Query hooks + keys factory     | `features/posts/api/post.queries.ts`                                                                                     |
| Form với React Hook Form + Zod | `features/auth/ui/LoginForm.tsx`                                                                                         |
| Form chống spam submit         | `ProfileEditForm.tsx`, `LoginForm.tsx`, `EditPostDialog.tsx`, `guarded-form.tsx`, `use-guarded-submit.ts`, `submit-button.tsx`, `use-single-flight-mutation.ts` |
| Multi-step wizard              | `RegisterWizard.tsx` + `PhoneRegisterTab.tsx` / `EmailRegisterTab.tsx`                                                   |
| Post CRUD                      | `post.service.ts`, `post.queries.ts`, `PostCard.tsx`, `PostDetailView.tsx`, `EditPostDialog.tsx`, `DeletePostDialog.tsx` |
| Post hashtags (typeahead)      | `hashtag.queries.ts`, `PostComposerTextarea.tsx`, `PostHashtagSuggestDropdown.tsx`, `lib/parse-body-hashtags.ts`         |
| Global feed                    | `feed.service.ts`, `useDiscoveryFeed`, `FeedList` (`source="discovery"`)                                                 |
| Profile timeline               | `post.service.ts` → `listMyPosts`, `FeedList` (`source="mine"`)                                                          |
| Post share                     | `share.service.ts`, `lib/share-post-link.ts`, `PostCard.tsx`                                                             |
| Organization dashboard         | `entities/organization` (schema), `features/organization/api/organization.service.ts`, `organization.queries.ts`, `OrgScreens.tsx` (create/edit/invite/verify) |
| Account settings               | `features/account/` → export, change-password OTP, delete account                                                        |
| Landing public stats           | `features/stats/` → `GET /stats`, `PublicStatsStrip`                                                                     |
| Axios instance + 401 refresh   | `shared/api/api.ts`                                                                                                      |
| RBAC + permission check        | `shared/auth/roles.ts`                                                                                                   |
| Auth context + useUser         | `shared/auth/AuthContext.tsx`, `useUser.ts`                                                                              |
| Route protection               | `middleware.ts`, `shared/auth/AuthWrapper.tsx`                                                                           |
| Public SSR page                | `app/trace/[token]/page.tsx`, `app/[username]/page.tsx`                                                                  |
| Infinite scroll                | `features/posts/api/post.queries.ts` → `usePostsFeed`                                                                    |
| Widget compose (feed/profile)  | `widgets/feed/FeedScreen.tsx`, `widgets/profile/ProfileScreen.tsx` — ghép `features/posts` + `features/profile`          |
