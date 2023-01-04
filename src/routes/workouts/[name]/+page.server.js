import { error } from '@sveltejs/kit';
import { api, NotFoundError } from '$lib/server/api/impl';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	// return {
	// 	workout: await api.find_workout(params.name)
	// };
	try {
		const workout = await api.find_workout(params.name);
		return { workout };
	} catch (err) {
		console.warn(err);
		if (err instanceof NotFoundError) {
			throw error(404);
		}
		throw err;
	}
}
