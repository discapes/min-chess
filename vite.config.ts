import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [
		{
			name: 'custom-headers',
			configureServer(server) {
				server.middlewares.use(async (req, res, next) => {
					res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
					res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
					next();
				});
			}
		},
		sveltekit()
	],
	server: {
		headers: {
			/* for some reason, headers set here don't apply, so we make a custom middleware */
		}
	}
};

export default config;
