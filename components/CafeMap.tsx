"use client";

import { useEffect, useRef } from "react";
import type { GeoJSONSource, Map as MapLibreMap, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { CafeSummary } from "@/lib/cafes";
import type { LatLng } from "@/lib/geo";

// Free OpenStreetMap-based vector tiles, no API key: https://openfreemap.org
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const CAVITE_VIEW = { center: [120.9, 14.25] as [number, number], zoom: 9.6 };

type Props = {
  cafes: CafeSummary[];
  selectedId: string | null;
  userLocation: LatLng | null;
  onSelect: (id: string) => void;
};

function toGeoJSON(cafes: CafeSummary[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: cafes.map((cafe) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [cafe.lng, cafe.lat] },
      properties: { id: cafe.id, name: cafe.name, slug: cafe.slug, open: cafe.openNow },
    })),
  };
}

export function CafeMap({ cafes, selectedId, userLocation, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const readyRef = useRef(false);
  const latest = useRef({ cafes, selectedId, userLocation, onSelect });

  useEffect(() => {
    latest.current = { cafes, selectedId, userLocation, onSelect };
  });

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | null = null;

    (async () => {
      const maplibre = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;
      maplibre.setWorkerUrl("/maplibre-gl-worker.mjs");

      map = new maplibre.Map({ container: containerRef.current, style: STYLE_URL, ...CAVITE_VIEW });
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");
      popupRef.current = new maplibre.Popup({ closeButton: false, focusAfterOpen: false, offset: 12, maxWidth: "240px" });
      mapRef.current = map;

      map.on("load", () => {
        if (!map) return;
        map.addSource("cafes", { type: "geojson", data: toGeoJSON(latest.current.cafes) });
        map.addSource("me", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
        map.addLayer({
          id: "cafes",
          type: "circle",
          source: "cafes",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 5, 14, 9],
            "circle-color": ["case", ["get", "open"], "#6f4325", "#a8a29e"],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });
        map.addLayer({
          id: "cafes-selected",
          type: "circle",
          source: "cafes",
          filter: ["==", ["get", "id"], ""],
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 8, 14, 13],
            "circle-color": "#c8873a",
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });
        map.addLayer({
          id: "me",
          type: "circle",
          source: "me",
          paint: {
            "circle-radius": 7,
            "circle-color": "#2563eb",
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });

        map.on("click", "cafes", (e) => {
          const id = e.features?.[0]?.properties?.id;
          if (typeof id === "string") latest.current.onSelect(id);
        });
        map.on("mouseenter", "cafes", () => map && (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", "cafes", () => map && (map.getCanvas().style.cursor = ""));

        readyRef.current = true;
        syncSelection(map, popupRef.current!, latest.current.cafes, latest.current.selectedId);
        syncUserLocation(map, latest.current.userLocation);
        fitTo(map, latest.current.cafes, latest.current.userLocation, false);
      });
    })();

    return () => {
      cancelled = true;
      readyRef.current = false;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when the filtered list changes, and frame them.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    (map.getSource("cafes") as GeoJSONSource).setData(toGeoJSON(cafes));
    fitTo(map, cafes, userLocation, true);
  }, [cafes, userLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current || !popupRef.current) return;
    syncSelection(map, popupRef.current, cafes, selectedId);
  }, [cafes, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    syncUserLocation(map, userLocation);
  }, [userLocation]);

  return <div ref={containerRef} className="size-full" aria-label="Map of cafés" role="region" />;
}

function syncSelection(map: MapLibreMap, popup: Popup, cafes: CafeSummary[], selectedId: string | null) {
  map.setFilter("cafes-selected", ["==", ["get", "id"], selectedId ?? ""]);
  const cafe = cafes.find((c) => c.id === selectedId);
  if (!cafe) {
    popup.remove();
    return;
  }
  const link = document.createElement("a");
  link.href = `/cafe/${cafe.slug}`;
  link.textContent = cafe.name;
  link.className = "font-semibold text-ink hover:underline";
  popup.setLngLat([cafe.lng, cafe.lat]).setDOMContent(link).addTo(map);
}

function syncUserLocation(map: MapLibreMap, location: LatLng | null) {
  (map.getSource("me") as GeoJSONSource).setData({
    type: "FeatureCollection",
    features: location
      ? [{ type: "Feature", geometry: { type: "Point", coordinates: [location.lng, location.lat] }, properties: {} }]
      : [],
  });
}

function fitTo(map: MapLibreMap, cafes: CafeSummary[], location: LatLng | null, animate: boolean) {
  const points = cafes.map((c) => [c.lng, c.lat] as [number, number]);
  if (location) points.push([location.lng, location.lat]);
  if (points.length === 0) return;
  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  map.fitBounds(
    [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ],
    { padding: 48, maxZoom: 14, animate },
  );
}
