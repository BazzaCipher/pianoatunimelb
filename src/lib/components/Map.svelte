<script>
  import { onMount } from 'svelte';
  import createFuzzySearch from '@nozbe/microfuzz';
  import { fade } from 'svelte/transition';
  export let posts;
  let map;

  async function createMap() {
	let isVertical = window.innerWidth !== 0 ? window.innerHeight / window.innerWidth <= 1.25 : true;
    // Create the map centred on Melbourne Uni
	console.log(isVertical)
	map = L.map('map', {fullscreenControl: true})
		.setView(
			!isVertical ? [-37.798, 144.9615] : [-37.800, 144.98]
			, !isVertical ? 15.5 : 15)
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>💖contributors'
	}).addTo(map);
	
	// Add the bounds
	map .setMaxBounds([
		[-37.792049,144.955950],
		[-37.805084,144.967796],
	])
		.setMinZoom(14);

	// Add the Unimelb GeoJSON layer
	const response = await fetch("building_layers/PAR_BUILDING_ROOFPRINT_2024_3053703928735353279.geojson");
	const parkvillegeojson = await response.json();
	const parkvillelayermap = L.geoJson(parkvillegeojson, {
		style: function(feature) {
			return {color:"lightgreen",weight: 2,fillOpacity: 0.4}
		}});
	parkvillelayermap.addTo(map);
	
	// Create the search; To optimise only keep "building" features.
	const fuzzySearch = createFuzzySearch(parkvillegeojson.features, {
		getText: (item) => [item.properties.property_name,
			`Building ${item.properties.building_number}`],
		strategy: "aggressive"
	})

	// Create the markers corresponding to the GPS coordinates of pianos, or building
	const iconUpright = new L.Icon({
		iconUrl: './piano-upright.svg',
		iconRetinaUrl: './piano-upright.svg',
		iconAnchor: null,
		popupAnchor: null,
		shadowUrl: null,
		shadowSize: null,
		shadowAnchor: null,
		iconSize: new L.Point(25, 100),
	})
	const iconGrand = new L.Icon({
		iconUrl: './piano-grand.svg',
		iconRetinaUrl: './piano-grand.svg',
		iconAnchor: null,
		popupAnchor: null,
		shadowUrl: null,
		shadowSize: null,
		shadowAnchor: null,
		iconSize: new L.Point(30, 100),
	});
	for (let post of posts) {
		let coords;
		if (post.coordinates) { 
			coords = getCoords(post.coordinates);
		}
		let m = fuzzySearch(post.title);
		if (m.length > 0) { coords = markFeature(m[0]) }
		if (coords) { L
			.marker(coords, {
				icon: post.categories.includes("grand") ? iconGrand : iconUpright,
				title: post.title.toUpperCase(),
				opacity: post.categories.includes("sus") ? 0.5: 1.0
			})
			.addTo(map)
			.on('mouseup', () => window.location.href = `/posts/${post.slug}`); }
	}

	// Hide skeleton image
	onMount(()=>{document.getElementById("leaflet-skeleton-image").style.display = "none"})

	function markFeature(feature) {
		let lengthofarr = feature.item.geometry.coordinates[0].length;
		return [feature.item.geometry.coordinates[0].reduce((acc, val) => acc + val[1], 0)/lengthofarr,
		feature.item.geometry.coordinates[0].reduce((acc, val) => acc + val[0], 0)/lengthofarr]
	}

	function getCoords(coords) {
		return coords.split(" ").map(s => parseFloat(s, 10))
	}
  }

  onMount(()=>setTimeout(createMap, 200));
  onMount(()=>setTimeout(()=>{document.getElementById("map").style.visibility = "visible"}, 150))

  let visible = false
  setTimeout(() => visible = true, 150);
</script>

<svelte:head>
<script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js'></script>
<link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css' rel='stylesheet' />
</svelte:head>

{#if visible}
<div id="map" transition:fade={{duration:2000}}>
  <slot />
</div>
{/if}

<style>
  #map {
	width: inherit;
	aspect-ratio: 1 / 1.5;

	box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
	border: 1px solid black;

	position: fixed;
	top: 25vh;

	visibility: hidden;
  }

  @media only screen and (max-aspect-ratio: 1/1.25) {
	#map {
	  position: relative;
	  aspect-ratio: 16 / 9;
	  box-shadow: none;
	  border: none;
	  top: unset;
	}
  }
</style>
