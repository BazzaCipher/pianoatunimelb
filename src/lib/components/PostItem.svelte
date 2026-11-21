<script>
  export let post;
  export let active = false;
  $: ({ title, description, location, slug, categories, thumbnail } = post);
  $: type = categories.includes("grand") ? "grand" : "upright";
</script>

<a class="card" class:active id="piano-{slug}" href="/posts/{slug}" on:mouseenter on:mouseleave on:focus on:blur>
  {#if thumbnail}
    <img class="thumb" src="/{thumbnail}" alt="" />
  {:else}
    <span class="thumb icon {type}"><img class="key-icon" src="/piano-{type}.svg" alt="" /></span>
  {/if}
  <span class="body">
    <strong>{title ?? location ?? ""}</strong>
    {#if location && location !== title}<span class="where">{location}</span>{/if}
    {#if description}<span class="desc">{description}</span>{/if}
    <span class="chips">
      {#each categories as c}<span class="chip" class:sus={c === "sus"}>{c === "sus" ? "unconfirmed" : c}</span>{/each}
    </span>
  </span>
</a>

<style>
  .card {
    position: relative;
    display: flex;
    gap: 0.85rem;
    padding: 0.75rem;
    border-radius: 14px;
    color: var(--ink);
    text-decoration: none;
    border: 1px solid var(--line);
    background: var(--card);
  }

  /* Accent bar slides in on the left; shared by real hover and map-pin hover */
  .card::before {
    content: "";
    position: absolute;
    left: -1px;
    top: 14px;
    bottom: 14px;
    width: 4px;
    border-radius: 0 4px 4px 0;
    background: var(--accent-2);
    scale: 1 0;
  }

  .card:hover,
  .card.active {
    color: var(--ink);
    border-color: var(--accent-2);
    background: var(--card-hot);
  }

  .card:hover::before,
  .card.active::before {
    scale: 1 1;
  }

  .thumb {
    flex: none;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    object-fit: cover;
  }

  .icon {
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--upright) 18%, transparent);
  }

  .icon.grand {
    background: color-mix(in srgb, var(--grand) 18%, transparent);
  }

  .icon img {
    width: 28px;
    height: 28px;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  strong {
    font: 700 1.2rem/1.2 var(--serif);
    font-variant-numeric: lining-nums;
    text-transform: capitalize;
  }

  .where {
    font-size: 0.85rem;
    color: var(--ink-soft);
    text-transform: capitalize;
  }

  .desc {
    font-size: 0.85rem;
    color: var(--ink-soft);
  }

  .chips {
    margin-top: 0.35rem;
  }
</style>
