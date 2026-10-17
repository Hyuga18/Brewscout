// MapLibre loads its web worker from a separate file, which bundlers can't resolve on their own.
// Copy it into public/ so the map can load it from /maplibre-gl-worker.mjs (runs before dev/build).
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const dist = dirname(require.resolve("maplibre-gl/package.json"));
mkdirSync("public", { recursive: true });
copyFileSync(join(dist, "dist", "maplibre-gl-worker.mjs"), join("public", "maplibre-gl-worker.mjs"));
