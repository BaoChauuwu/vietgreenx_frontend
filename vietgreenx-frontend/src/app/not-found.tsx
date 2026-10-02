import Link from "next/link";
import { ROUTES } from "@/shared/routing";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl font-medium">Không tìm thấy trang này</p>
      <p className="max-w-sm text-muted-foreground">
        Trang bạn đang tìm có thể đã bị xóa hoặc URL không đúng.
      </p>
      <Link
        href={ROUTES.home}
        className="mt-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Về trang chủ
      </Link>
    </main>
  );
}
