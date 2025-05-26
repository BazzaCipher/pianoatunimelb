---
layout: page
title: Pianos
description: "Explore all the pianos on the University of Melbourne campus for practice and pleasure. Find locations, availability, and details in one comprehensive guide. Find the pianos at unimelb"
---

<script>
  import PostItem from "$lib/components/PostItem.svelte";
  import Pagination from "$lib/components/Pagination/Pagination.svelte";
  import { paginatedPosts } from "$lib/components/Pagination/paginatedPosts";
  import Seo from "$lib/components/Seo.svelte";
  import { siteTitle, siteDescription } from "$lib/constants";
  
  export let data;

  $: ({ posts } = data);
</script>

{#each $paginatedPosts as post}
  <PostItem {post} />
{/each}

<Pagination items={posts} itemsPerPage={20} />
