## To modify
Pianos live in `src/routes/posts/<slug>/+page.md` (frontmatter: categories, location, floor, `coordinates: lat lng`).
Pins use the coordinates; without them, the title is matched to a campus building.

Building outlines come from UoM Open Spatial Data via `src/routes/api/buildings.json/+server.js`
(refreshed daily; `src/lib/data/buildings.json` is the bundled fallback).

Colours and fonts are tokens at the top of `src/lib/css/global.css`.
