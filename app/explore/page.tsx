import { Suspense } from "react";
import type { Metadata } from "next";
import { Explorer } from "@/components/Explorer";
import { getCafes, getTags } from "@/lib/cafes";

export const metadata: Metadata = {
  title: "Explorer · Spatial Directory",
  description:
    "Interactive split vector map and curated directory of 50 verified independent specialty cafés across Cavite, Philippines.",
};

export default async function ExplorePage() {
  const [cafes, tags] = await Promise.all([getCafes(), getTags()]);
  return (
    // Explorer reads filters from the URL, which is only known in the browser.
    <Suspense fallback={<div className="flex-1 animate-pulse bg-line/40" />}>
      <Explorer cafes={cafes} tags={tags} />
    </Suspense>
  );
}
