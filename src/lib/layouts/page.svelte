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
<h1>{title}</h1>
{/if}
<slot />
