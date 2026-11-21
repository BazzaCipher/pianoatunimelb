<script>
  import { footerText } from "$lib/constants";
  const year = new Date().getFullYear();
</script>

<footer>
  <p class="container">© {year}. {footerText}</p>
</footer>

<style>
  footer {
    border-top: 1px solid var(--line);
  }

  footer p {
    margin: 0;
    padding: 1.25rem 1rem 2rem;
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
</style>
