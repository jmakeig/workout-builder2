import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// YIKES!
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
