import { api } from '$lib/server/api/local';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		workout: await api.findWorkout(params.name)
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		return api.updateWorkout(toWorkout(await request.formData()));
	}
};

function toWorkout(formData) {
	return {
		name: formData.get('name'),
		title: formData.get('title'),
		description: formData.get('description'),
		sets: []
	};
}
