import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["600"] });

export const metadata: Metadata = {
  title: { default: "Brewscout · Cafés in Cavite", template: "%s · Brewscout" },
  description: "Find cafés in Cavite by wifi, outlets, late hours, price, and vibe.",
};

export const viewport: Viewport = { themeColor: "#faf7f2" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur">
          <Link href="/" className="font-display text-xl text-espresso">
            Brewscout
          </Link>
          <span className="text-sm text-muted">Cafés in Cavite</span>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
