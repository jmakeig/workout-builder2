const SIMULATED_DELAY = 250; // ms
function delay(ms = 0) {
	const wait = Math.max(0, ms + 250 * (Math.random() - 0.5));
	// const wait = 0;
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
			case 'INSERT INTO workouts VALUES ($stub)':
				console.log('Updating', params);
				const newWorkout = { name: nameFromTitle(params.stub.title), sets: [], ...params.stub };
				if (data.findIndex((workout) => newWorkout.name === workout.name) >= 0) {
					console.warn('Constraint violation', data);
					throw new Error(`Constraint violation: Workout '${newWorkout.name}' already exists`);
				}
				data.push(newWorkout);
				return newWorkout;
			case 'UPDATE workouts WHERE name = $name':
				console.log('Updating', params.workout);
				const index = data.findIndex((workout) => params.workout.name === workout.name);
				return (data[index] = params.workout);
			default:
				throw new Error(str);
		}
	}
};

/**
 * Turns a string into a URL-ready slug
 *
 * @param {string} title
 * @returns {string}
 */
function nameFromTitle(title) {
	const maxLength = 80;
	let len = 0,
		index = 0,
		slug = '';
	const tokens = title.split(/\W+/g);
	while (len < maxLength && index < tokens.length) {
		len += tokens[index].length;
		if (tokens[index].length > 0) {
			slug += (index > 0 ? '-' : '') + tokens[index++];
		} else {
			index++;
		}
	}
	return slug;
}

export const api = {
	async listWorkouts() {
		return db.query('SELECT FROM workouts');
	},
	async findWorkout(name) {
		return db.query('SELECT FROM workouts WHERE name = $name', { name });
	},
	async createWorkout(stub) {
		return db.update('INSERT INTO workouts VALUES ($stub)', { stub });
	},
	async updateWorkout(workout) {
		return db.update('UPDATE workouts WHERE name = $name', { workout });
	}
};
