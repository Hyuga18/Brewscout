"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const SCOUTLIST_STORAGE_KEY = "brewscout:scoutlist:v1";
const SCOUTLIST_EVENT = "brewscout:scoutlist-updated";

// Module-level cache to share 1 parsed Set across all 50 CafeCard bookmark buttons
let cachedRaw: string | null = null;
let cachedIds: string[] = [];
let cachedSet: Set<string> = new Set();

function getParsedCache(raw: string | null): { ids: string[]; set: Set<string> } {
  if (!raw) return { ids: [], set: new Set() };
  if (raw === cachedRaw) {
    return { ids: cachedIds, set: cachedSet };
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { ids: [], set: new Set() };
    const valid = parsed.filter(
      (id): id is string => typeof id === "string" && Boolean(id.trim()),
    );
    cachedRaw = raw;
    cachedIds = Array.from(new Set(valid));
    cachedSet = new Set(cachedIds);
    return { ids: cachedIds, set: cachedSet };
  } catch {
    cachedRaw = raw;
    cachedIds = [];
    cachedSet = new Set();
    return { ids: [], set: new Set() };
  }
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === SCOUTLIST_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SCOUTLIST_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SCOUTLIST_EVENT, callback);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(SCOUTLIST_STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

export function getScoutlistIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return getParsedCache(localStorage.getItem(SCOUTLIST_STORAGE_KEY)).ids;
  } catch {
    return [];
  }
}

export function toggleScoutlistId(cafeId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getScoutlistIds();
    const idSet = new Set(current);
    const exists = idSet.has(cafeId);
    if (exists) {
      idSet.delete(cafeId);
    } else {
      idSet.add(cafeId);
    }
    const next = Array.from(idSet);
    localStorage.setItem(SCOUTLIST_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(SCOUTLIST_EVENT));
    return !exists;
  } catch {
    return false;
  }
}

export function useScoutlist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const { ids: savedIds, set: savedSet } = useMemo(() => getParsedCache(raw), [raw]);

  const isSaved = useCallback((cafeId: string) => savedSet.has(cafeId), [savedSet]);

  return {
    savedIds,
    savedSet,
    count: savedIds.length,
    isSaved,
    toggle: toggleScoutlistId,
  };
}
