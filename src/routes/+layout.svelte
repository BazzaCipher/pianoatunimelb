<script>
  import "$lib/css/global.css";
  import SidebarToggle from "$lib/components/SidebarToggle.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { isSidebarOpen } from "$lib/stores";
  import { page } from "$app/stores"
  import Header from "$lib/components/Header.svelte";
  import CalltoAction from "$lib/components/CalltoAction.svelte";

  export let data;
  $: dynamicClass = $page.url.pathname == "/" ? 'displayInline': 'displayOther';
  $: ({ posts } = data);
</script>

<div class="wrapper overflow-hidden">
  <Sidebar />
  <main class:show={$isSidebarOpen}>
    <SidebarToggle />
    <Header />
	<CalltoAction />
	<div class="container {dynamicClass}" id="checkedinlineelement">
		<slot />
	</div>
  </main>
</div>

<style>
  .wrapper {
    display: flex;
    overflow: hidden;
  }

  main {
    width: 100%;
  }

  .container {
	margin: 0;
	padding: 0;
  }

  .displayInline {
    display: inline;
  }

  .displayOther {
    margin: 2rem auto;
  }

</style>
