import { api } from '$lib/server/api/impl';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		workout: await api.find_workout(params.name)
	};
}
