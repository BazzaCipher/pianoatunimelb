import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  // microfuzz is CJS; bundling it for SSR gives a working default import under Node
  ssr: { noExternal: ["@nozbe/microfuzz"] },
};

export default config;
