"use client";

import { useRouter } from "next/navigation";

export function BackButton({ label = "Back to Explorer" }: { label?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex min-h-[44px] items-center gap-1.5 py-2 px-2.5 -ml-2.5 rounded-lg text-xs sm:text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
