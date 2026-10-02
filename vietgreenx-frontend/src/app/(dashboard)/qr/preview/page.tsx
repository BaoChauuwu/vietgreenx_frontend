import { QrPreviewScreen } from "@/widgets/qr/QrPreviewScreen";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata = { title: "Xem trước QR | VietGreenX" };

export default async function QrPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token;

  return <QrPreviewScreen token={token} locale={getRequestLocale()} />;
}
