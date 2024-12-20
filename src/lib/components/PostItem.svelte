<script>
  import Categories from "$lib/components/Categories.svelte";
  export let post;
  $: ({ title, description, location, slug, categories, thumbnail } = post);
</script>

<div class="post-item">
  <a data-sveltekit-prefetch class="title" href="/posts/{slug}"
    ><h2>{title ?? location ?? ""}</h2></a>
  <Categories {categories} />
  {#if thumbnail}<div width="800" height="300">
	<img src="{thumbnail}" alt="{title}" id="thumbnail" />
  </div>{/if}
  {#if description}<p>{description ?? ""}</p>{/if}
</div>

<style>
  .post-item {
    margin-bottom: 2rem;
  }
  .title {
    text-decoration: none;
  }
  .title:hover {
    text-decoration: underline;
  }
  h2 {
    font-size: 1.8rem;
	text-transform: capitalize;
  }

  #thumbnail{
	margin: auto;
	display: block;
	border-radius: 15px;
    object-fit: cover;
    object-position: center;
  }

  @media screen and (max-width: 768px) {
    img {
      height: 200px;
      object-fit: contain;
      object-position: center;
    }
  }
</style>
