<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import createFuzzySearch from '@nozbe/microfuzz';
  export let posts;
  export let hovered = null; // slug highlighted from the list
  export let onhover = () => {}; // called with a slug (or null) when a pin is hovered
  export let panelWidth = 0; // list panel covering the map's left edge on desktop
  export let shown = null; // Set of slugs to show; null = all

  let el;
  let map;

  $: showOnly(bySlug, shown);

  function showOnly(markers, shown) {
    if (!map) return;
    for (const [slug, m] of Object.entries(markers)) {
      if (!shown || shown.has(slug)) m.addTo(map);
      else m.remove();
    }
  }
  let bySlug = {};
  let lit;

  $: highlight(bySlug, hovered);

  function highlight(markers, slug) {
    if (lit) {
      lit.getElement()?.classList.remove('hot');
      lit.setZIndexOffset(0).closeTooltip();
    }
    lit = markers[slug];
    if (lit) {
      lit.getElement()?.classList.add('hot');
      lit.setZIndexOffset(1000).openTooltip();
    }
  }

  onMount(() => {
    const style = getComputedStyle(el);
    map = L.map(el, {
      zoomControl: false,
      zoomSnap: 0.25, // lets the campus fit snugly beside the panel at any width
      fadeAnimation: false, // Leaflet fades tiles in by default
      minZoom: 14,
      // West edge leaves room to shift the campus right of the list panel
      maxBounds: [[-37.789, 144.945], [-37.808, 144.971]],
    }).setView([-37.798, 144.9615], 15.5);
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const pin = (type, sus) => L.divIcon({
      className: `pin pin-${type}${sus ? ' pin-sus' : ''}`,
      html: `<span><img src="/piano-${type}.svg" alt=""></span>`,
      iconSize: [36, 36],
      iconAnchor: [18, 43],
      tooltipAnchor: [0, -44],
    });

    (async () => {
      const buildingsGeojson = await (await fetch('/api/buildings.json')).json();
      const buildings = L.geoJson(buildingsGeojson, {
        style: () => ({
          color: style.getPropertyValue('--campus-line').trim(),
          fillColor: style.getPropertyValue('--campus').trim(),
          weight: 1,
          fillOpacity: 0.55,
        }),
      }).addTo(map);

      // Building name search, used to place pianos that name a building
      const fuzzySearch = createFuzzySearch(buildingsGeojson.features, {
        getText: (item) => [item.properties.property_name, `Building ${item.properties.building_number}`],
        strategy: 'aggressive',
      });

      const markers = {};
      for (const post of posts) {
        // Hand-entered coordinates win; otherwise fall back to the building the title names
        let coords = post.coordinates ? post.coordinates.split(' ').map(parseFloat) : undefined;
        const m = coords ? [] : fuzzySearch(post.title);
        if (m.length > 0) coords = L.geoJSON(m[0].item).getBounds().getCenter();
        if (!coords) continue;
        const name = post.title.replace(/\b\w/g, (c) => c.toUpperCase());
        markers[post.slug] = L.marker(coords, {
          icon: pin(post.categories.includes('grand') ? 'grand' : 'upright', post.categories.includes('sus')),
          alt: name,
        })
          .bindTooltip(name, { direction: 'top', className: 'pin-label' })
          .addTo(map)
          .on('mouseover', () => onhover(post.slug))
          .on('mouseout', () => onhover(null))
          .on('click', () => goto(`/posts/${post.slug}`));
      }
      // Fit the campus and every pin into the visible part of the map, i.e. right of the list panel on desktop
      const bounds = buildings.getBounds();
      for (const m of Object.values(markers)) bounds.extend(m.getLatLng());
      const covered = el.clientWidth > 760 ? panelWidth + 16 : 0;
      map.fitBounds(bounds, {
        paddingTopLeft: [covered + 24, 56], // pins stand ~43px above their point
        paddingBottomRight: [24, 24],
        animate: false,
      });
      bySlug = markers;
    })();

    return () => map.remove();
  });
</script>

<div class="map" bind:this={el} />

<style>
  .map {
    width: 100%;
    height: 100%;
    background: var(--map-bg);
  }

  /* Tint the OSM tiles into the palette (grey -> sepia -> rotate to sage; plum in dark mode) */
  .map :global(.leaflet-tile-pane) {
    filter: grayscale(1) sepia(0.45) hue-rotate(45deg) saturate(0.7) brightness(1.05) contrast(0.88);
  }

  @media (prefers-color-scheme: dark) {
    .map :global(.leaflet-tile-pane) {
      filter: grayscale(1) invert(1) sepia(0.6) hue-rotate(275deg) saturate(1.1) brightness(0.6) contrast(1.1);
    }
  }

  .map :global(.leaflet-control-zoom) {
    border: 1px solid var(--line);
    border-radius: 12px;
    overflow: hidden;
  }

  .map :global(.leaflet-control-zoom a) {
    background: var(--card);
    color: var(--ink);
    border-color: var(--line);
  }

  .map :global(.leaflet-control-attribution) {
    background: color-mix(in srgb, var(--card) 80%, transparent);
    color: var(--ink-soft);
  }

  /* Teardrop pins. Styled on the inner span: rotate/scale on the marker itself
     would also rotate Leaflet's translate3d position */
  .map :global(.pin span) {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    border-radius: 50% 50% 50% 0;
    rotate: -45deg;
    background: var(--upright);
    border: 2.5px solid var(--pin-ring);
  }

  .map :global(.pin-grand span) {
    background: var(--grand);
  }

  /* Unconfirmed: same fill as its type, dashed dark outline instead of the solid ring */
  .map :global(.pin-sus span) {
    border: 3px dashed var(--ink);
  }

  .map :global(.pin:hover span),
  .map :global(.pin.hot span) {
    scale: 1.3;
  }

  .map :global(.pin img) {
    width: 20px;
    height: 20px;
    rotate: 45deg;
    filter: var(--upright-icon);
  }

  .map :global(.pin-grand img) {
    filter: var(--grand-icon);
  }

  .map :global(.pin-label) {
    font: 600 0.9rem var(--serif);
    font-variant-numeric: lining-nums;
    color: var(--ink);
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 0.25rem 0.7rem;
  }

  .map :global(.pin-label::before) {
    display: none;
  }
</style>
