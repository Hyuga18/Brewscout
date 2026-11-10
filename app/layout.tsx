import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["600"] });

export const metadata: Metadata = {
  title: { default: "Brewscout · Cafés in Cavite", template: "%s · Brewscout" },
  description: "Find independent specialty cafés in Cavite by wifi, outlets, late hours, price, and vibe.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Brewscout",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-display text-xl text-espresso tracking-tight hover:opacity-90 transition-opacity">
              Brewscout
            </Link>
            <span className="hidden sm:inline-block text-xs font-medium uppercase tracking-wider text-muted">
              Cavite
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="text-muted hover:text-ink transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/about"
              className="text-muted hover:text-ink transition-colors"
            >
              About
            </Link>
          </nav>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
