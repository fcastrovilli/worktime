import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { ssp } from 'sveltekit-search-params/plugin';

export default defineConfig({
	plugins: [ssp(), sveltekit()]
});
