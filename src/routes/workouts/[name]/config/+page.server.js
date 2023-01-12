import { error, redirect } from '@sveltejs/kit';
import { api, NotFoundError, ValidationError } from '$lib/server/api/impl';
import { parse } from 'qs';

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
				console.error('CAUGHT!', error);
			});
	},
	async delete(event) {
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
	// @ts-ignore
	const query_string = new URLSearchParams(formData).toString();
	/** @type {Workout} */
	// @ts-ignore
	const workout = parse(query_string, { allowDots: true });

	// UGLY: Turn duration strings into numbers
	for (const set of workout.sets) {
		for (const exercise of set) {
			exercise.duration = parseInt(String(exercise.duration), 10);
		}
	}
	// @ts-ignore
	return workout;
}
