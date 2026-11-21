<script>
  export let categories;
</script>

<ul class="chips">
  {#each categories as category}
    <li>
      <a class="chip" class:sus={category === "sus"} href={`/categories?c=${encodeURIComponent(category)}`}>{category === "sus" ? "unconfirmed" : category}</a>
    </li>
  {/each}
</ul>

<style>
  a:hover {
    color: var(--hover-fg);
    background: var(--hover-bg);
  }
</style>
