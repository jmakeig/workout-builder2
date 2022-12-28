import { api } from '$lib/server/api/local';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		workout: await api.findWorkout(params.name)
	};
}
