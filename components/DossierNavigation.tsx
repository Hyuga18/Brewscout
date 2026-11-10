"use client";

import { useEffect, useState } from "react";
import type { CafeDetail } from "@/lib/cafes";
import { distanceMeters, formatDistance } from "@/lib/geo";

type Props = {
  cafe: CafeDetail;
};

export function DossierNavigation({ cafe }: Props) {
  const [copied, setCopied] = useState(false);
  const [userDistance, setUserDistance] = useState<number | null>(null);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${cafe.lat},${cafe.lng}`
  )}`;
  const wazeUrl = `https://waze.com/ul?ll=${cafe.lat},${cafe.lng}&navigate=yes`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${cafe.lat},${cafe.lng}&dirflg=d`;

  const fullAddress = cafe.address || `${cafe.name}, ${cafe.city ? `${cafe.city}, ` : ""}Cavite`;

  // Estimate distance if user has already granted geolocation
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = distanceMeters(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          { lat: cafe.lat, lng: cafe.lng }
        );
        setUserDistance(d);
      },
      () => {
        // Geolocation denied or unavailable; gracefully remain null
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, [cafe.lat, cafe.lng]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ExecCommand fallback for restricted browser contexts
      try {
        const textarea = document.createElement("textarea");
        textarea.value = fullAddress;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // Silently ignore if clipboard permissions are denied
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Live Distance Pill (When location permitted) */}
      {userDistance !== null && (
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted bg-surface px-3 py-1.5 rounded-xl border border-line">
          <svg className="size-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span>
            Approximately <strong className="text-ink">{formatDistance(userDistance)}</strong> from your location
          </span>
        </div>
      )}

      {/* Primary Navigation Segment */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted">Driving Navigation</span>
        <div className="grid grid-cols-3 gap-2">
          {/* Google Maps */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open directions to ${cafe.name} in Google Maps (opens in a new tab)`}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-surface p-2.5 text-center transition-all hover:border-accent hover:bg-surface-sub focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group"
          >
            <svg className="size-5 text-accent transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            <span className="text-xs font-semibold text-espresso group-hover:text-ink">Google Maps</span>
          </a>

          {/* Waze */}
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open directions to ${cafe.name} in Waze (opens in a new tab)`}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-surface p-2.5 text-center transition-all hover:border-accent hover:bg-surface-sub focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group"
          >
            <svg className="size-5 text-accent transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 19 21 12 17 5 21 12 2" />
            </svg>
            <span className="text-xs font-semibold text-espresso group-hover:text-ink">Waze</span>
          </a>

          {/* Apple Maps */}
          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open directions to ${cafe.name} in Apple Maps (opens in a new tab)`}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-surface p-2.5 text-center transition-all hover:border-accent hover:bg-surface-sub focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group"
          >
            <svg className="size-5 text-accent transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <span className="text-xs font-semibold text-espresso group-hover:text-ink">Apple Maps</span>
          </a>
        </div>
      </div>

      {/* Copy Address Button */}
      <button
        type="button"
        onClick={handleCopyAddress}
        aria-label={copied ? "Address copied to clipboard" : "Copy street address to clipboard"}
        className="mt-1 flex items-center justify-between rounded-xl border border-line bg-surface px-3 py-2 text-xs transition-colors hover:border-ink/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="truncate pr-2 text-muted">
          {copied ? (
            <span className="font-medium text-open flex items-center gap-1.5">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Address copied to clipboard!
            </span>
          ) : (
            fullAddress
          )}
        </span>
        <span className="shrink-0 font-semibold text-espresso">
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
    </div>
  );
}
