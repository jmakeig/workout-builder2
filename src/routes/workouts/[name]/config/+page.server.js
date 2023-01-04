import { error, redirect } from '@sveltejs/kit';
import { api, NotFoundError, ValidationError } from '$lib/server/api/impl';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
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

/** @type {import('./$types').Actions} */
export const actions = {
	async save({ request }) {
		return api
			.update_workout(to_workout(await request.formData()))
			.then((workout) => {
				throw redirect(303, `/workouts/${workout.name}`);
			})
			.catch((error) => {
				console.error('CAUGHT!');
			});
	},
	async delete(event) {
		console.log(event.params);
		await api.delete_workout(event.params.name);
		throw redirect(303, `/workouts`);
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
		/** @type any */
		name: formData.get('name'),
		/** @type any */
		title: formData.get('title'),
		/** @type any */
		description: formData.get('description'),
		sets: []
	};
}
