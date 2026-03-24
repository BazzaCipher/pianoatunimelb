<script>
  import Seo from "$lib/components/Seo.svelte";
  import { siteTitle } from "$lib/constants";
  export let title, description;
  const seo = {
    title: title ? `${title} | ${siteTitle}` : siteTitle,
    description,
	canonical: 'https://piano.bazza.space'
  };
</script>

<Seo {...seo} />
{#if title}
<h3 id="smalltitle">{title}</h3>
<hr>
{/if}
<div>
	<slot />
</div>

<style>
	#smalltitle {
		text-align: center;
	}
</style>
