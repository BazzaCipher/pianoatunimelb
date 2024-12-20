import { defineConfig } from 'vite'
import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "@zerodevx/svelte-img/vite"

/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [sveltekit(), imagetools({
		profiles: {
			thmb: new URLSearchParams('w=640&format=webp;jpg'),
		}
	})],
})

