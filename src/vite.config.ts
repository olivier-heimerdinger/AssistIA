import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['app.localhost', 'localhost'],
		proxy: {
			'/appwrite': {
				target: 'http://appwrite',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/appwrite/, '')
			}
		}
	}
});
