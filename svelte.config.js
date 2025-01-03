import { mdsvex } from "mdsvex";
import mdsvexConfig from "./mdsvex.config.js";
import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";
import { importAssets } from "svelte-preprocess-import-assets";
// const dev = process.env.NODE_ENV === "development";

const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],

  kit: {
    adapter: adapter(),
    // Enable below line and change /yuyutsu to /<your-repo-name> to host the site on github pages
    // paths: {
    //   base: dev ? "" : "/yuyutsu",
    // },
    // appDir: "app",
  },
  preprocess: [importAssets(), preprocess({}), mdsvex(mdsvexConfig)],
};

export default config;
