import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TopNav } from "@/components/top-nav";

export const metadata: Metadata = {
  title: "CatCare AI - kačių sveikatos konsultavimas",
  description:
    "CatCare AI padeda kačių augintojams suprasti simptomus, įvertinti skubumą ir pasiruošti vizitui pas veterinarą. Nepakeičia veterinaro konsultacijos.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1F6F64",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TopNav />
          <main className="mx-auto min-h-[calc(100vh-64px)] max-w-5xl px-4 py-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
