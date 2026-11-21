<script>
  import Seo from "$lib/components/Seo.svelte";
  import Categories from "$lib/components/Categories.svelte";
  import { siteTitle } from "$lib/constants";

  export let title, location, floor, date, categories, thumbnail, images;

  const gallery = images ? images.toString().split(" ").map((img) => `/images/${img}`) : [];

  const seo = {
    title: `${title ?? location} | ${siteTitle}`,
    description: `A piano can be found for Unimelb at ${location}`,
    thumbnail,
  };
</script>

<Seo {...seo} />

<a class="back" href="/">← Back to the map</a>

<header class="post-head">
  <h1>{title ?? location}</h1>
  <dl class="meta">
    <div><dt>Where</dt><dd>{location}</dd></div>
    <div><dt>Level</dt><dd>{floor ?? "?"}</dd></div>
    <div><dt>Last checked</dt><dd>{date}</dd></div>
  </dl>
  <Categories {categories} />
</header>

{#if thumbnail}<img class="hero" src="/{thumbnail}" alt="{title ?? location}" />{/if}

<article>
  <slot />
</article>

{#if gallery.length}
  <div class="gallery">
    {#each gallery as src}
      <!-- svelte-ignore a11y-missing-attribute -->
      <img {src} loading="lazy" on:error={(e) => e.currentTarget.remove()} />
    {/each}
  </div>
{/if}

<p class="edit"><a class="button" href="/contact">Suggest a change</a></p>

<style>
  .back {
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
  }

  .post-head {
    margin: 1rem 0 1.5rem;
    padding: 1.5rem;
    border-radius: var(--radius);
    background: var(--card);
    border: 1px solid var(--line);
  }

  h1 {
    margin-top: 0;
    text-transform: capitalize;
  }

  .meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
    gap: 0.75rem;
    margin: 0 0 1rem;
  }

  dt {
    font-size: 0.85rem;
    color: var(--ink-soft);
  }

  dd {
    text-transform: capitalize;
    font-weight: 600;
  }

  article :global(h1) {
    font-size: 1.6rem;
  }

  .hero {
    width: 100%;
    max-height: 420px;
    object-fit: cover;
    border-radius: var(--radius);
    margin-bottom: 1.5rem;
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
    margin: 1.5rem 0;
  }

  .gallery img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 12px;
  }

  .edit {
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--line);
    text-align: right;
  }
</style>
