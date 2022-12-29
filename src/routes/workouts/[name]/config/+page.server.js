import { redirect } from '@sveltejs/kit';
import { api } from '$lib/server/api/impl';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		workout: await api.find_workout(params.name)
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	async default({ request }) {
		const workout = await api.update_workout(to_workout(await request.formData()));
		throw redirect(303, `/workouts/${workout.name}`);
	}
};

/** @typedef {import('$lib/types').Workout} Workout */

/**
 *
 * @param {FormData} formData
 * @returns {Workout}
 */
function to_workout(formData) {
	return {
		name: formData.get('name'),
		title: formData.get('title'),
		description: formData.get('description'),
		sets: []
	};
}
