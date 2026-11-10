import type { Metadata } from "next";
import { CuratedGalleryTicker } from "@/components/landing/CuratedGalleryTicker";
import { FeaturePillars } from "@/components/landing/FeaturePillars";
import { FieldGuidesSection } from "@/components/landing/FieldGuidesSection";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHero } from "@/components/landing/LandingHero";
import { StatsBanner } from "@/components/landing/StatsBanner";

export const metadata: Metadata = {
  title: "Brewscout · Cavite Coffee Gazetteer",
  description:
    "An independent, opinionated spatial guide and field directory for 50 verified specialty cafés across Cavite, Philippines.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      <LandingHero />
      <StatsBanner />
      <FieldGuidesSection />
      <FeaturePillars />
      <CuratedGalleryTicker />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}
