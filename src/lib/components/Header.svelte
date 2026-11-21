<script>
  import { onMount, tick } from "svelte";
  import { page } from "$app/stores";
  import { menu, siteTitle, siteDescription } from "$lib/constants";

  $: pathname = $page.url.pathname;
  const isActive = (url, path) => (url === "/" ? path === "/" || path.startsWith("/posts") : path.startsWith(url));

  // Sliding pill: follows the hovered link, falls back to the current page's link
  let nav;
  let mounted = false;
  let ready = false; // no slide for the first placement
  let hot = null;
  let pill = { x: 0, w: 0 };

  function moveTo(a) {
    if (!a) return;
    hot = a.getAttribute("href");
    pill = { x: a.offsetLeft, w: a.offsetWidth };
  }
  const reset = () => moveTo(nav?.querySelector("a[aria-current]"));

  $: if (mounted) pathname, tick().then(reset);
  onMount(() => {
    reset();
    mounted = true;
    requestAnimationFrame(() => requestAnimationFrame(() => (ready = true)));
  });
</script>

<svelte:window on:resize={reset} />

<header>
  <a class="brand" href="/" aria-label="{siteDescription}, home">
    <span class="logo">{siteTitle}</span>
    <span class="tag">Pianos at Unimelb</span>
  </a>
  <nav aria-label="Main" bind:this={nav} on:mouseleave={reset} class:mounted class:ready>
    <span class="pill" style="transform: translateX({pill.x}px); width: {pill.w}px" aria-hidden="true" />
    {#each menu as { title, url }}
      <a
        href={url}
        class:on={mounted ? hot === url : isActive(url, pathname)}
        aria-current={isActive(url, pathname) ? "page" : undefined}
        on:mouseenter={(e) => moveTo(e.currentTarget)}
        on:focus={(e) => moveTo(e.currentTarget)}
        on:blur={reset}>{title}</a>
    {/each}
  </nav>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 1100;
    height: var(--header-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0 1.25rem;
    background: var(--glass);
    backdrop-filter: blur(14px) saturate(1.3);
    -webkit-backdrop-filter: blur(14px) saturate(1.3);
    border-bottom: 1px solid var(--line);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--ink);
  }

  .logo {
    font: 400 2.3rem/1 var(--script);
    font-variant-numeric: lining-nums;
    color: var(--accent);
    padding-top: 0.2rem;
  }

  .tag {
    font: 600 1.05rem var(--serif);
    font-variant-numeric: lining-nums;
    color: var(--ink-soft);
  }

  nav {
    position: relative;
    display: flex;
    gap: 0.25rem;
  }

  .pill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 999px;
    background: var(--ebony);
    opacity: 0;
  }

  .ready .pill {
    transition: transform 280ms cubic-bezier(0.3, 0.8, 0.3, 1), width 280ms cubic-bezier(0.3, 0.8, 0.3, 1);
  }

  .mounted .pill {
    opacity: 1;
  }

  nav a {
    position: relative;
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--ink-soft);
    text-decoration: none;
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    transition: color 200ms ease;
  }

  /* Before hydration there is no pill, so the active link paints its own background */
  nav:not(.mounted) a.on {
    background: var(--ebony);
  }

  nav a.on {
    color: var(--ivory);
  }

  @media (max-width: 640px) {
    header { padding: 0 0.6rem; gap: 0.5rem; }
    .tag { display: none; }
    .logo { font-size: 1.75rem; }
    nav { gap: 0; }
    nav a { font-size: 0.8rem; padding: 0.35rem 0.45rem; }
  }

  @media (max-width: 380px) {
    header { padding: 0 0.4rem; }
    .logo { font-size: 1.45rem; }
    nav a { font-size: 0.76rem; padding: 0.3rem 0.36rem; }
  }
</style>
