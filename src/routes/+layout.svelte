<script>
  import "$lib/css/global.css";
  import { page } from "$app/stores";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";

  $: isHome = $page.url.pathname == "/";
</script>

<Header />
{#if isHome}
  <slot />
{:else}
  <main class="container page">
    <slot />
  </main>
  <Footer />
{/if}

<style>
  .page {
    padding-top: 1.5rem;
    padding-bottom: 3rem;
    min-height: calc(100dvh - var(--header-h) - 6rem);
  }
</style>
