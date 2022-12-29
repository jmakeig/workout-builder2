import { api } from '$lib/server/api/impl';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		workouts: await api.list_workouts()
	};
}
