const SIMULATED_DELAY = 250; // ms
/**
 * @param {number} ms
 * @returns {Promise<any>}
 */
function delay(ms = 0) {
	const wait = Math.max(0, ms + 250 * (Math.random() - 0.5));
	// const wait = 0;
	console.log(`Waiting ${wait.toFixed(0).toLocaleString()}ms`);
	return new Promise((resolve) => setTimeout(resolve, wait));
}

/** @typedef { import('$lib/types').Workout } Workout */

/** @type {Workout[]} */
const data = [{ name: 'uno', title: 'Uno', description: '', sets: [] }];

const db = {
	/**
	 *
	 * @param {string} str
	 * @param {any} params
	 * @returns {Promise<Workout[] | Workout | undefined>}
	 */
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
	/**
	 *
	 * @param {string} str
	 * @param {any} params
	 * @returns {Promise<Workout>}
	 */
	async update(str, params = {}) {
		await delay(750);
		switch (str) {
			case 'INSERT INTO workouts VALUES ($stub)':
				console.log('Updating', params);
				const newWorkout = { name: name_from_title(params.stub.title), sets: [], ...params.stub };
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
function name_from_title(title) {
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

/** @type {import('./api').API} */
export const api = {
	async list_workouts() {
		return db.query('SELECT FROM workouts');
	},
	async find_workout(name) {
		return db.query('SELECT FROM workouts WHERE name = $name', { name });
	},
	async create_workout(stub) {
		return db.update('INSERT INTO workouts VALUES ($stub)', { stub });
	},
	async update_workout(workout) {
		return db.update('UPDATE workouts WHERE name = $name', { workout });
	}
};
