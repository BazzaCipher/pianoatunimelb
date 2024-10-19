<script>
  import "$lib/css/global.css";
  import SidebarToggle from "$lib/components/SidebarToggle.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { isSidebarOpen } from "$lib/stores";
  import { page } from "$app/stores"
  import Header from "$lib/components/Header.svelte";
  import Map from "$lib/components/Map.svelte";

  export let data;
  $: dynamicClass = $page.url.pathname == "/" ? 'displayInline': '';
  $: ({ posts } = data);
</script>

<div class="wrapper overflow-hidden">
  <Sidebar />
  <main class:show={$isSidebarOpen}>
    <SidebarToggle />
    <Header />
	{#if $page.url.pathname=="/"}
		<div id="map-container">
			<Map {posts}/>
		</div>
	{/if}
      <div class="container {dynamicClass}">
		<slot />
      </div>
  </main>
</div>

<style>
  .wrapper {
    display: flex;
    overflow: hidden;
  }

  main {
    width: 100%;
  }

  .container {
    margin: 2rem auto;
  }

  .displayInline {
    display: inline-block;
  }

  #map-container {
    top: 0;
	vertical-align: top;

	margin: 10em 3em;

	width: 400px;
	height: 80%;
	display: inline-block;
  }

  @media only screen and (max-width: 600px) {
    #map-container {
      width: 100vw;
	  aspect-ratio: 16 / 9;

	  border: 10em 0 5em 0;
	  display: inline;
	}
	.container {
	  margin: 0 auto;
	}
  }
</style>
