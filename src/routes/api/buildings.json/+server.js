import fallback from "$lib/data/buildings.json";

// UoM Open Spatial Data: "PARKVILLE CAMPUS - BUILDING OUTLINES" (spatialdata-uom.opendata.arcgis.com)
const SOURCE =
  "https://services6.arcgis.com/wNUCgbZ3TmLukLnT/arcgis/rest/services/PAR_BUILDING_ROOFPRINT_2024/FeatureServer/1/query" +
  "?where=1%3D1&outFields=building_number,property_name&outSR=4326&f=geojson";
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

// Start from the bundled copy; refresh from the university at most once a day
let cache = { at: 0, body: JSON.stringify(fallback) };

export const GET = async ({ fetch }) => {
  if (Date.now() - cache.at > DAY) {
    try {
      const res = await fetch(SOURCE, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      // Don't let an empty or broken response wipe the map
      if (!res.ok || !(data.features?.length > 50) || !data.features.every((f) => f.geometry?.type === "Polygon")) {
        throw new Error(`unexpected response (${res.status}, ${data.features?.length} features)`);
      }
      cache = { at: Date.now(), body: JSON.stringify({ type: "FeatureCollection", features: data.features }) };
    } catch (e) {
      console.warn("buildings: keeping cached copy:", e.message);
      cache.at = Date.now() - DAY + HOUR; // retry in an hour
    }
  }
  return new Response(cache.body, {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" },
  });
};
