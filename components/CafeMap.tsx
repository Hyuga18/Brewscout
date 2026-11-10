"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Map as MapLibreMap, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { CafeSummary } from "@/lib/cafes";
import { type LatLng, distanceMeters } from "@/lib/geo";

// Free OpenStreetMap-based vector tiles, no API key: https://openfreemap.org
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const CAVITE_CENTER: [number, number] = [120.9, 14.25];
const CAVITE_VIEW = { center: CAVITE_CENTER, zoom: 9.8 };

type Props = {
  cafes: CafeSummary[];
  selectedId: string | null;
  hoveredId?: string | null;
  userLocation: LatLng | null;
  onSelect: (id: string) => void;
};

export function CafeMap({ cafes, selectedId, hoveredId, userLocation, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const maplibreRef = useRef<typeof import("maplibre-gl") | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const userMarkerRef = useRef<Marker | null>(null);
  const readyRef = useRef(false);
  const prevSelectedIdRef = useRef<string | null>(null);
  const prevHoveredIdRef = useRef<string | null | undefined>(null);
  const router = useRouter();

  const [mapError, setMapError] = useState(false);

  const latest = useRef({ cafes, selectedId, userLocation, onSelect, router });
  useEffect(() => {
    latest.current = { cafes, selectedId, userLocation, onSelect, router };
  });

  // Keep map container dimensions in sync with MapLibre canvas
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastW = el.clientWidth;
    let lastH = el.clientHeight;
    let rafId: number | null = null;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        const h = Math.round(entry.contentRect.height);
        if (w !== lastW || h !== lastH) {
          lastW = w;
          lastH = h;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            mapRef.current?.resize();
          });
        }
      }
    });

    ro.observe(el);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | null = null;
    const markers = markersRef.current;

    (async () => {
      const maplibre = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;
      maplibreRef.current = maplibre;
      maplibre.setWorkerUrl("/maplibre-gl-worker.mjs");

      map = new maplibre.Map({
        container: containerRef.current,
        style: STYLE_URL,
        minZoom: 8.5,
        maxZoom: 18,
        scrollZoom: true,
        fadeDuration: 0,
        renderWorldCopies: false,
        maxPitch: 0,
        dragRotate: false,
        touchPitch: false,
        attributionControl: { compact: true },
        ...CAVITE_VIEW,
      });
      map.scrollZoom.setWheelZoomRate(1 / 400);
      map.scrollZoom.setZoomRate(1 / 100);

      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");

      popupRef.current = new maplibre.Popup({
        closeButton: true,
        focusAfterOpen: false,
        offset: 14,
        maxWidth: "280px",
      });

      mapRef.current = map;

      map.on("error", (e) => {
        if (e.error && !readyRef.current) {
          console.warn("Map tile load warning:", e.error);
        }
      });

      map.on("load", () => {
        if (cancelled || !map) return;
        map.resize();
        readyRef.current = true;
        syncMarkers(map, maplibre, latest.current.cafes, markersRef.current, latest.current.onSelect);
        syncUserLocation(map, maplibre, latest.current.userLocation, userMarkerRef);
        fitTo(map, latest.current.cafes, latest.current.userLocation, false);
      });
    })();

    return () => {
      cancelled = true;
      readyRef.current = false;
      markers.forEach((m) => m.remove());
      markers.clear();
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      popupRef.current?.remove();
      popupRef.current = null;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Markers only when filtered cafe list or user location changes (NOT on selectedId or hoveredId)
  useEffect(() => {
    const map = mapRef.current;
    const maplibre = maplibreRef.current;
    if (!map || !maplibre || !readyRef.current) return;
    syncMarkers(map, maplibre, cafes, markersRef.current, latest.current.onSelect);
    fitTo(map, cafes, userLocation, true);
  }, [cafes, userLocation]);

  // Update Selection & Smooth Viewport-Aware Camera Fly-To (O(1) class updates)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current || !popupRef.current) return;

    const prevId = prevSelectedIdRef.current;
    if (prevId && prevId !== selectedId) {
      const prevMarker = markersRef.current.get(prevId);
      if (prevMarker) {
        const el = prevMarker.getElement();
        el.classList.remove("marker-selected");
        el.style.zIndex = "10";
      }
    }

    if (selectedId) {
      const currMarker = markersRef.current.get(selectedId);
      if (currMarker) {
        const el = currMarker.getElement();
        el.classList.add("marker-selected");
        el.style.zIndex = "40";
      }
    }
    prevSelectedIdRef.current = selectedId;

    const cafe = cafes.find((c) => c.id === selectedId);
    if (!cafe) {
      popupRef.current.remove();
      return;
    }

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    map.easeTo({
      center: [cafe.lng, cafe.lat],
      zoom: Math.max(map.getZoom(), 13.5),
      duration: 600,
      padding: {
        left: 32,
        bottom: !isDesktop ? 260 : 32,
        top: 32,
        right: 32,
      },
      essential: true,
    });

    // Rich popup micro-card with DOM construction (Zero innerHTML XSS vector)
    const popupEl = document.createElement("div");
    popupEl.className = "p-3 font-sans";

    const headerRow = document.createElement("div");
    headerRow.className = "flex items-center gap-1.5 mb-1";

    const badge = document.createElement("span");
    badge.className = `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
      cafe.openNow ? "bg-[#edf7f1] text-[#24633e]" : "bg-neutral-100 text-neutral-600"
    }`;
    const badgeDot = document.createElement("span");
    badgeDot.className = `size-1.5 rounded-full ${
      cafe.openNow ? "bg-[#24633e]" : "bg-neutral-400"
    }`;
    badge.appendChild(badgeDot);
    badge.appendChild(document.createTextNode(cafe.openNow ? "Open now" : "Closed"));
    headerRow.appendChild(badge);

    if (cafe.priceMin) {
      const priceBadge = document.createElement("span");
      priceBadge.className = "text-[10px] font-medium text-neutral-500 tabular-nums";
      priceBadge.textContent = `Latte from ₱${cafe.priceMin}`;
      headerRow.appendChild(priceBadge);
    }

    const title = document.createElement("h4");
    title.className = "font-semibold text-neutral-900 text-sm leading-snug";
    title.textContent = cafe.name;

    const city = document.createElement("p");
    city.className = "text-[11px] text-neutral-500 mt-0.5";
    city.textContent = cafe.city ?? "Cavite";

    const link = document.createElement("a");
    link.href = `/cafe/${cafe.slug}`;
    link.className =
      "mt-2.5 block w-full rounded-lg bg-[#5c351b] py-1.5 text-center text-xs font-semibold text-white shadow-2xs hover:bg-[#1f1610] transition-colors";
    link.textContent = "View Dossier →";
    link.addEventListener("click", (e) => {
      e.preventDefault();
      latest.current.router.push(`/cafe/${cafe.slug}`);
    });

    popupEl.appendChild(headerRow);
    popupEl.appendChild(title);
    popupEl.appendChild(city);
    popupEl.appendChild(link);

    popupRef.current.setLngLat([cafe.lng, cafe.lat]).setDOMContent(popupEl).addTo(map);
  }, [selectedId, cafes]);

  // Update hover highlight (O(1), zero camera movement)
  useEffect(() => {
    const prevId = prevHoveredIdRef.current;
    if (prevId && prevId !== hoveredId && prevId !== selectedId) {
      const prevMarker = markersRef.current.get(prevId);
      if (prevMarker) {
        const el = prevMarker.getElement();
        el.classList.remove("marker-hovered");
        el.style.zIndex = "10";
      }
    }

    if (hoveredId && hoveredId !== selectedId) {
      const currMarker = markersRef.current.get(hoveredId);
      if (currMarker) {
        const el = currMarker.getElement();
        el.classList.add("marker-hovered");
        el.style.zIndex = "35";
      }
    }
    prevHoveredIdRef.current = hoveredId;
  }, [hoveredId, selectedId]);

  // Update user location pin
  useEffect(() => {
    const map = mapRef.current;
    const maplibre = maplibreRef.current;
    if (!map || !maplibre || !readyRef.current) return;
    syncUserLocation(map, maplibre, userLocation, userMarkerRef);
  }, [userLocation]);

  return (
    <div className="relative size-full min-h-[300px] lg:min-h-0">
      <div ref={containerRef} className="size-full" aria-label="Map of cafés" role="region" />
      {mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper/90 p-4 text-center z-20">
          <p className="text-sm font-semibold text-ink">Unable to load map tiles.</p>
          <p className="text-xs text-muted mt-1">Check your network connection to view map tiles.</p>
          <button
            type="button"
            onClick={() => setMapError(false)}
            className="mt-3 rounded-full bg-espresso px-4 py-1.5 text-xs font-medium text-paper"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

// In-place reconciliation of HTML price markers
function syncMarkers(
  map: MapLibreMap,
  maplibre: typeof import("maplibre-gl"),
  cafes: CafeSummary[],
  markersMap: Map<string, Marker>,
  onSelect: (id: string) => void,
) {
  const nextIds = new Set(cafes.map((c) => c.id));

  // Remove markers for cafes that are no longer in the filtered list
  markersMap.forEach((marker, id) => {
    if (!nextIds.has(id)) {
      marker.remove();
      markersMap.delete(id);
    }
  });

  // Add new markers or update existing
  cafes.forEach((cafe) => {
    if (markersMap.has(cafe.id)) return; // Already exists, reuse!

    const price = cafe.priceMin ? `₱${cafe.priceMin}` : "☕";

    const el = document.createElement("div");
    el.className = "brewscout-marker z-10";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute(
      "aria-label",
      `${cafe.name}, ${cafe.city ?? "Cavite"}. ${cafe.priceMin ? `Latte ₱${cafe.priceMin}` : ""}. Select to view details.`
    );

    const pill = document.createElement("div");
    pill.className =
      "brewscout-marker-pill flex items-center gap-1 rounded-full border border-[#1f1610]/15 bg-[#fdfbf7] px-2.5 py-1 text-[11px] font-semibold text-[#1f1610] shadow-xs";

    const dot = document.createElement("span");
    dot.className = `size-1.5 rounded-full ${cafe.openNow ? "bg-[#24633e]" : "bg-neutral-300"}`;

    const priceSpan = document.createElement("span");
    priceSpan.className = "tabular-nums tracking-tight";
    priceSpan.textContent = price;

    pill.appendChild(dot);
    pill.appendChild(priceSpan);
    el.appendChild(pill);

    const handleSelect = (e: Event) => {
      e.stopPropagation();
      onSelect(cafe.id);
    };

    el.addEventListener("click", handleSelect);
    el.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(e);
      }
    });

    const marker = new maplibre.Marker({ element: el, anchor: "bottom" })
      .setLngLat([cafe.lng, cafe.lat])
      .addTo(map);

    markersMap.set(cafe.id, marker);
  });
}

function syncUserLocation(
  map: MapLibreMap,
  maplibre: typeof import("maplibre-gl"),
  location: LatLng | null,
  userMarkerRef: React.MutableRefObject<Marker | null>,
) {
  if (userMarkerRef.current) {
    userMarkerRef.current.remove();
    userMarkerRef.current = null;
  }
  if (!location) return;

  const el = document.createElement("div");
  el.className = "brewscout-marker relative flex items-center justify-center size-6";

  const ping = document.createElement("span");
  ping.className = "absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-75";

  const core = document.createElement("span");
  core.className = "relative inline-flex size-3.5 rounded-full border-2 border-white bg-blue-600 shadow-sm";

  el.appendChild(ping);
  el.appendChild(core);

  const marker = new maplibre.Marker({ element: el }).setLngLat([location.lng, location.lat]).addTo(map);
  userMarkerRef.current = marker;
}

function fitTo(map: MapLibreMap, cafes: CafeSummary[], location: LatLng | null, animate: boolean) {
  if (cafes.length === 0) {
    map.easeTo({ center: CAVITE_CENTER, zoom: CAVITE_VIEW.zoom, duration: animate ? 500 : 0 });
    return;
  }
  const points = cafes.map((c) => [c.lng, c.lat] as [number, number]);

  // Distant user location clamp: only include user location in bounding box if within 150km of Cavite
  if (location) {
    const distFromCavite = distanceMeters(location, { lat: CAVITE_CENTER[1], lng: CAVITE_CENTER[0] });
    if (distFromCavite <= 150_000) {
      points.push([location.lng, location.lat]);
    }
  }

  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  map.fitBounds(
    [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ],
    {
      padding: {
        left: 40,
        right: 40,
        top: 48,
        bottom: !isDesktop ? 260 : 48,
      },
      maxZoom: 13.5,
      animate,
    },
  );
}
