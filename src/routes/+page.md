---
layout: page
title: Pianos
description: "Explore all the pianos on the University of Melbourne campus for practice and pleasure. Find locations, availability, and details in one comprehensive guide. Find the pianos at unimelb"
---

<script>
  import { page } from "$app/stores"
  import PostItem from "$lib/components/PostItem.svelte";
  import Pagination from "$lib/components/Pagination/Pagination.svelte";
  import { paginatedPosts } from "$lib/components/Pagination/paginatedPosts";
  import Seo from "$lib/components/Seo.svelte";
  import Map from "$lib/components/Map.svelte";
  import { siteTitle, siteDescription } from "$lib/constants";
  
  export let data;

  $: ({ posts } = data);
  $: dynamicClass = $page.url.pathname == "/" ? 'displayInline': '';
</script>


<div id="map-content-container">
    <div id="map-container">
        <Map {posts}/>
    </div>
	<div class="container {dynamicClass}" id="checkedinlineelement">
        {#each $paginatedPosts as post}
          <PostItem {post} />
        {/each}

        <Pagination items={posts} itemsPerPage={20} />
    </div>
</div>

<style>
  #map-container {
    top: 0;
	vertical-align: top;

	margin: 10em 3em;

	width: 400px;
	height: 80%;
	display: inline-block;
  }

  #map-content-container {
	display: flex;
  }

  .container {
    margin: 2rem auto;
  }


  @media screen and (max-aspect-ratio: 1/1.25) {
    #map-container {
      width: 100vw;
      height: 100vw;
	  aspect-ratio: 1 / 3;
      margin: 0;

	  border: 10em 0 5em 0;
	  display: inline;
	}
	.container {
      width: 100vw;
	  margin: 0 auto;
	}
  }
</style>
