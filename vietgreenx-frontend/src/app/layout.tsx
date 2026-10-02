import { Be_Vietnam_Pro } from "next/font/google";

import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { AppProviders } from "@/widgets/app-providers";
import { JsonLd, buildWebsiteSchema, defaultMetadata } from "@/shared/seo";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnamPro.variable} suppressHydrationWarning>
      <body>
        <JsonLd data={buildWebsiteSchema()} />
        <ErrorBoundary>
          <AppProviders>{children}</AppProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
