import { redirect, fail } from '@sveltejs/kit';
import { api, ValidationError } from '$lib/server/api/impl';

/** @type {import('./$types').Actions} */
export const actions = {
	async default({ request }) {
		const stub = to_workout_stub(await request.formData());
		try {
			const workout = await api.create_workout(stub);
			throw redirect(303, `/workouts/${workout.name}/config`);
		} catch (error) {
			if (error instanceof ValidationError) {
				console.warn('ConstraintViolationError');
				return fail(409, { stub, message: `Nope` });
			}
			throw error;
		}
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
