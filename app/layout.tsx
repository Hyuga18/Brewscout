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
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} antialiased`}>
      <body className="flex min-h-dvh lg:h-dvh lg:overflow-y-auto flex-col font-sans bg-paper text-ink selection:bg-accent/20 selection:text-espresso">
        {/* Global Root Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-espresso focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-paper focus:shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Skip to main content
        </a>

        {/* Editorial Masthead Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-line bg-paper px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2 font-display text-xl text-espresso tracking-tight transition-transform hover:opacity-90 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
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
          </div>

          <nav aria-label="Main navigation" className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <Link
              href="/"
              className="text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Explorer
            </Link>
            <Link
              href="/about"
              className="text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Field Guide
            </Link>
          </nav>
        </header>
        <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col min-h-0 focus:outline-none">
          {children}
        </main>
      </body>
    </html>
  );
}
