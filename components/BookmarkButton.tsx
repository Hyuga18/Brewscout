"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "brewscout:scoutlist:v1";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("brewscout:scoutlist-updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("brewscout:scoutlist-updated", callback);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

export function BookmarkButton({
  cafeId,
  cafeName,
  size = "md",
}: {
  cafeId: string;
  cafeName: string;
  size?: "sm" | "md";
}) {
  const rawList = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  let saved = false;
  try {
    const list: string[] = JSON.parse(rawList);
    saved = list.includes(cafeId);
  } catch {
    // Ignored
  }

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const next = list.includes(cafeId)
        ? list.filter((id) => id !== cafeId)
        : [...list, cafeId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("brewscout:scoutlist-updated"));
    } catch {
      // Ignored
    }
  };

  const dimensionClass = size === "sm" ? "size-8" : "size-9";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      title={saved ? `Remove ${cafeName} from Scoutlist` : `Save ${cafeName} to Scoutlist`}
      aria-label={saved ? `Remove ${cafeName} from Scoutlist` : `Save ${cafeName} to Scoutlist`}
      className={`group relative inline-flex ${dimensionClass} items-center justify-center rounded-full border transition-all duration-200 active:scale-95 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        saved
          ? "border-accent bg-accent/15 text-accent shadow-xs"
          : "border-line bg-surface text-muted hover:border-ink/40 hover:text-ink shadow-2xs"
      }`}
    >
      <svg
        className={`size-4 transition-transform duration-200 group-hover:scale-110 ${
          saved ? "fill-accent stroke-accent" : "fill-none stroke-currentColor"
        }`}
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
