<script>
  import Seo from "$lib/components/Seo.svelte";
  import Categories from "$lib/components/Categories.svelte";
  import { siteTitle } from "$lib/constants";
  import { Gallery } from 'flowbite-svelte';

  export let data;
  export let title, location, floor, coordinates, date, categories, thumbnail, images;

let imagesobjects = []
  if (images) {
	let imagesobjects = images.toString().split(" ")
	imagesobjects = imagesobjects.map(img => { return{src: `../images/${img}`}});
  }

  const seo = {
    title: `${title ?? location} | ${siteTitle}`,
    description: `A piano can be found for Unimelb at ${location}`,
    thumbnail,
  };

  $: recentPosts = data.posts;
</script>

<Seo {...seo} />

<h1>{title??location}</h1>
<div><p class="date">Last checked: {date}</p><p class="location">{location} | Level {floor ?? "?"}</p></div>
<Categories {categories} />
<article>
  <slot />
</article>
<Gallery items={imagesobjects}/>
<hr>
<p class="edit"><a href="/contact" target="_blank">Suggest a change</a></p>

<style>
  .largegallery {
	margin: 0 -20vw;
  }
  .date {
    color: var(--text-color);
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }
  .edit {
    display: flex;
  }
  .edit a {
    margin-left: auto;
  }
  img {
    object-fit: cover;
    object-position: center;
  }
  p {
	margin: 0px;
    font-size: 1rem;
  }
  div {
	display: flex;
	justify-content: space-between;
	align-items: center;
  }
  .location {
	text-align: right;
	text-transform: capitalize;
	font-weight: bold;
  }
  .gallery {
	margin: -20% !important;
	display: grid;
	grid-template-columns: 1fr 1fr;
  }
  h1 {
	  text-transform: capitalize;
  }

  @media screen and (max-width: 800px) {
    h1 {
      font-size: 2rem;
    }
    img {
      height: 200px;
      object-fit: contain;
      object-position: center;
    }
  }

</style>
