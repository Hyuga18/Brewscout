import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Brewscout · Cavite Coffee Gazetteer", template: "%s · Brewscout" },
  description:
    "An independent, opinionated spatial guide to the best third-wave, specialty, and homegrown cafés in Cavite, Philippines.",
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
  themeColor: "#f8f5ee",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} antialiased`}>
      <body className="flex min-h-dvh lg:h-dvh lg:overflow-y-auto flex-col font-sans bg-paper text-ink selection:bg-accent/20 selection:text-espresso">
        {/* Editorial Masthead Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-line bg-paper/95 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2 font-display text-xl text-espresso tracking-tight transition-transform hover:opacity-90 active:scale-98"
            >
              {/* Compass / Scout Emblem */}
              <svg
                className="size-5 text-accent transition-transform duration-300 group-hover:rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.3" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span className="font-semibold text-espresso">Brewscout</span>
            </Link>
            <span className="hidden sm:inline-block rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Cavite Gazetteer
            </span>
          </div>

          <nav aria-label="Main navigation" className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <Link
              href="/"
              className="text-muted hover:text-ink transition-colors"
            >
              Explorer
            </Link>
            <Link
              href="/about"
              className="text-muted hover:text-ink transition-colors"
            >
              Field Guide
            </Link>
          </nav>
        </header>
        <main className="flex flex-1 flex-col min-h-0">{children}</main>
      </body>
    </html>
  );
}
