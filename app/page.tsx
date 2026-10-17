import { Suspense } from "react";
import { Explorer } from "@/components/Explorer";
import { getCafes, getTags } from "@/lib/cafes";

export default async function Home() {
  const [cafes, tags] = await Promise.all([getCafes(), getTags()]);
  return (
    // Explorer reads filters from the URL, which is only known in the browser.
    <Suspense fallback={<div className="flex-1 animate-pulse bg-line/40" />}>
      <Explorer cafes={cafes} tags={tags} />
    </Suspense>
  );
}
