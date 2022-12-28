const SIMULATED_DELAY = 250; // ms
function delay(ms = 0) {
	const wait = Math.max(0, ms + 250 * (Math.random() - 0.5));
	return new Promise((resolve) => setTimeout(resolve, wait));
}

const data = [{ name: 'uno' }];

const db = {
	async query(str, params = {}) {
		await delay(250);
		switch (str) {
			case 'SELECT FROM workouts':
				return data;
			case 'SELECT FROM workouts WHERE name = $name':
				return data.find((workout) => params.name === workout.name);
			default:
				break;
		}
	},
	async update(value) {
		await delay(750);
	}
};

export const api = {
	async listWorkouts() {
		return db.query('SELECT FROM workouts');
	},
	async findWorkout(name) {
		return db.query('SELECT FROM workouts WHERE name = $name', { name });
	}
};
