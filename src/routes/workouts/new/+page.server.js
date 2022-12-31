import { redirect } from '@sveltejs/kit';
import { api } from '$lib/server/api/impl';

///** @type {import('./$types').PageServerLoad} */
// export async function load({ params }) {
// 	return {
// 		…
// 	};
// }

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
 * @returns {import('$lib/types').WorkoutStub}
 */
function to_workout_stub(formData) {
	return {
		/** @type any */
		title: formData.get('title'),
		/** @type any */
		description: formData.get('description')
	};
}
