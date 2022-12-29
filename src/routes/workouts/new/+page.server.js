import { redirect } from '@sveltejs/kit';
import { api } from '$lib/server/api/local';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		workout: await api.findWorkout(params.name)
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	async default({ request }) {
		const workout = await api.createWorkout(toWorkoutStub(await request.formData()));
		throw redirect(303, `/workouts/${workout.name}/config`);
	}
};

function toWorkoutStub(formData) {
	return {
		title: formData.get('title'),
		description: formData.get('description')
	};
}
