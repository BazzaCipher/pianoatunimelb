<script>
  import { page } from "$app/stores";
  import createFuzzySearch from "@nozbe/microfuzz";
  import PostItem from "$lib/components/PostItem.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import { siteTitle } from "$lib/constants";

  export let data;
  const { posts, categories } = data;

  const label = (c) => (c === "sus" ? "unconfirmed" : c);
  const search = createFuzzySearch(posts, {
    getText: (p) => [p.title ?? "", p.location ?? "", p.description ?? "", p.categories.map(label).join(" ")],
  });

  // ?q=text&c=grand&c=parkville preselects (old /categories/<slug> links redirect here)
  let query = $page.url.searchParams.get("q") ?? "";
  let selected = new Set($page.url.searchParams.getAll("c"));

  function toggle(c) {
    selected.has(c) ? selected.delete(c) : selected.add(c);
    selected = selected;
  }
  const clear = () => ((query = ""), (selected = new Set()));

  // Text is fuzzy; categories must all match
  $: results = (query.trim() ? search(query.trim()).map((r) => r.item) : posts).filter((p) =>
    [...selected].every((c) => p.categories.includes(c)),
  );
</script>

<Seo title="Categories | {siteTitle}" description="Search and filter every piano at Unimelb" />

<h1>Categories</h1>

<div class="search">
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
  <input type="search" placeholder="Search by name, building or note…" aria-label="Search pianos" bind:value={query} />
</div>

<div class="filters" role="group" aria-label="Filter by category">
  {#each categories as [c, n]}
    <button class="filter" class:sus={c === "sus"} aria-pressed={selected.has(c)} on:click={() => toggle(c)}>
      {label(c)} <span class="count">{n}</span>
    </button>
  {/each}
</div>

<p class="summary" aria-live="polite">
  {results.length} {results.length === 1 ? "piano" : "pianos"}
  {#if query || selected.size}<button class="clear" on:click={clear}>Clear filters</button>{/if}
</p>

{#if results.length}
  <ul class="results">
    {#each results as post (post.slug)}
      <li><PostItem {post} /></li>
    {/each}
  </ul>
{:else}
  <p class="empty">No pianos match that. Try fewer filters or a shorter search.</p>
{/if}

<style>
  .search {
    position: relative;
    margin: 1.25rem 0 1rem;
  }

  .search svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    width: 20px;
    height: 20px;
    translate: 0 -50%;
    fill: none;
    stroke: var(--ink-soft);
    stroke-width: 2;
    stroke-linecap: round;
  }

  input {
    width: 100%;
    font: inherit;
    color: var(--ink);
    padding: 0.85rem 1rem 0.85rem 2.8rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--card);
    outline: none;
  }

  input:focus {
    border-color: var(--accent);
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .filter {
    gap: 0.4rem;
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
    color: var(--ink-soft);
    background: var(--chip);
    text-transform: capitalize;
  }

  .filter.sus {
    background: transparent;
    border: 1px dashed var(--ink-soft);
  }

  .filter:hover {
    color: var(--ink);
    background: var(--chip-hot);
  }

  .filter[aria-pressed="true"] {
    color: var(--ivory);
    background: var(--ebony);
  }

  .filter:active {
    color: var(--ivory);
    background: var(--press);
  }

  .count {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .summary {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.25rem 0 0.75rem;
    font-weight: 600;
    color: var(--ink-soft);
  }

  .clear {
    font-size: 0.8rem;
    padding: 0.3rem 0.75rem;
    color: var(--accent);
    background: transparent;
    border: 1px solid var(--line);
  }

  .clear:hover {
    color: var(--hover-fg);
    background: var(--hover-bg);
  }

  .results {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }

  .empty {
    color: var(--ink-soft);
    padding: 2rem 0;
  }

  @media (max-width: 640px) {
    .results {
      grid-template-columns: 1fr;
    }
  }
</style>
