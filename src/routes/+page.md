---
layout: page
description: "Explore all the pianos on the University of Melbourne campus for practice and pleasure. Find locations, availability, and details in one comprehensive guide. Find the pianos at unimelb"
---

<script>
  import PostItem from "$lib/components/PostItem.svelte";
  import Map from "$lib/components/Map.svelte";

  export let data;

  $: ({ posts } = data);

  // Key doubles as a filter: pick one type at a time; click it again to show everything
  let picked = null;
  const keys = [
    { id: "grand", label: "Grand" },
    { id: "upright", label: "Upright" },
    { id: "sus", label: "Unconfirmed" },
  ];
  const pick = (id) => (picked = picked === id ? null : id);
  const isGrand = (p) => p.categories.includes("grand");
  // Pins without either tag are drawn as uprights, so count them as uprights here too
  const test = {
    grand: isGrand,
    upright: (p) => p.categories.includes("upright") || !isGrand(p),
    sus: (p) => p.categories.includes("sus"),
  };
  $: shownPosts = picked ? posts.filter(test[picked]) : posts;
  $: shown = new Set(shownPosts.map((p) => p.slug));

  // List <-> map hover link: hovering either side lights up the other
  let hovered = null;
  let panelWidth = 0;
  function fromMap(slug) {
    hovered = slug;
    // Scroll the list to the piano when the list is its own scroll box (desktop)
    if (slug && matchMedia("(min-width: 761px)").matches) {
      document.getElementById(`piano-${slug}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
</script>

<div class="home">
  <div class="map-wrap">
    <Map {posts} {shown} {hovered} onhover={fromMap} {panelWidth} />
  </div>
  <aside class="panel" bind:clientWidth={panelWidth}>
    <div class="key" role="group" aria-label="Show only">
      {#each keys as k}
        <button class="k-{k.id}" aria-pressed={picked === k.id} on:click={() => pick(k.id)}>{k.label}</button>
      {/each}
    </div>
    <ul class="list">
      {#each shownPosts as post (post.slug)}
        <li>
          <PostItem
            {post}
            active={hovered === post.slug}
            on:mouseenter={() => (hovered = post.slug)}
            on:mouseleave={() => (hovered = null)}
            on:focus={() => (hovered = post.slug)}
            on:blur={() => (hovered = null)} />
        </li>
      {/each}
    </ul>
  </aside>
</div>

<style>
  .home {
    position: relative;
    height: calc(100dvh - var(--header-h));
  }

  .map-wrap {
    position: absolute;
    inset: 0;
  }


  .panel {
    position: absolute;
    z-index: 500;
    top: 1rem;
    left: 1rem;
    bottom: 1rem;
    width: min(400px, 42vw);
    overflow-y: auto;
    scrollbar-width: thin;
    padding: 1.5rem 1.25rem;
    background: var(--glass);
    backdrop-filter: blur(16px) saturate(1.3);
    -webkit-backdrop-filter: blur(16px) saturate(1.3);
    border: 1px solid var(--line);
    border-radius: var(--radius);
  }



  /* Three equal rounded squares. Outline = off, filled = the one type being shown */
  .key {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--line);
  }

  .key button {
    justify-content: center;
    padding: 0.7rem 0.2rem;
    border-radius: 12px;
    font-size: 0.95rem;
    color: var(--c);
    background: var(--card);
    border: 2px solid var(--c);
  }

  .k-grand { --c: var(--grand); --fg: var(--grand-fg); }
  .k-upright { --c: var(--upright); --fg: var(--upright-fg); }
  .k-sus { --c: var(--ink); --fg: var(--card); }

  .key .k-sus {
    border-style: dashed;
  }

  .key button:hover {
    color: var(--c);
    background: color-mix(in srgb, var(--c) 12%, var(--card));
  }

  .key button[aria-pressed="true"] {
    color: var(--fg);
    background: var(--c);
  }

  .key button:active {
    color: var(--fg);
    background: var(--c);
  }

  /* Filled unconfirmed: dashes in the panel colour show as gaps in the fill edge */
  .key .k-sus[aria-pressed="true"] {
    border-color: var(--card);
  }

  .list {
    display: grid;
    gap: 0.5rem;
  }

  /* Phone: map on top, list as a sheet sliding over its bottom edge */
  @media (max-width: 760px) {
    .home { height: auto; }
    .map-wrap { position: relative; height: 58dvh; }
    .panel {
      position: relative;
      inset: auto;
      width: auto;
      margin-top: 0;
      overflow: visible;
      border-radius: var(--radius) var(--radius) 0 0;
      padding: 1rem 1rem 2rem;
    }
  }
</style>
