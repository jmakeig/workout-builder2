import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return { name: params.name };

	// throw error(404, 'Not found');
}
