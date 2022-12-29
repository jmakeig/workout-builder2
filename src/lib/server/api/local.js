const SIMULATED_DELAY = 250; // ms
function delay(ms = 0) {
	const wait = Math.max(0, ms + 250 * (Math.random() - 0.5));
	console.log(`Waiting ${wait.toFixed(0).toLocaleString()}ms`);
	return new Promise((resolve) => setTimeout(resolve, wait));
}

const data = [{ name: 'uno', title: 'Uno', description: '', sets: [] }];

const db = {
	async query(str, params = {}) {
		await delay(250);
		switch (str) {
			case 'SELECT FROM workouts':
				return data;
			case 'SELECT FROM workouts WHERE name = $name':
				return data.find((workout) => params.name === workout.name);
			default:
				throw new Error(str);
		}
	},
	async update(str, params = {}) {
		await delay(750);
		switch (str) {
			case 'UPDATE workouts WHERE name = $name':
				console.log('Updating', params.workout);
				const index = data.findIndex((workout) => params.workout.name === workout.name);
				return (data[index] = params.workout);
			default:
				throw new Error(str);
		}
	}
};

export const api = {
	async listWorkouts() {
		return db.query('SELECT FROM workouts');
	},
	async findWorkout(name) {
		return db.query('SELECT FROM workouts WHERE name = $name', { name });
	},
	async updateWorkout(workout) {
		return db.update('UPDATE workouts WHERE name = $name', { workout });
	}
};
