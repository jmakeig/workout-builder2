import { redirect } from '@sveltejs/kit';
import { api } from '$lib/server/api/local';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		workout: await api.find_workout(params.name)
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	async default({ request }) {
		const workout = await api.create_workout(to_workout_stub(await request.formData()));
		throw redirect(303, `/workouts/${workout.name}/config`);
	}
};

/**
 * 
 * @param {FormData} formData 
 * @returns {import('$lib/server/api/api').WorkoutStub}
 */
function to_workout_stub(formData) {
	return {
		title: formData.get('title'),
		description: formData.get('description')
	};
}
