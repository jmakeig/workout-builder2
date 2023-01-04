import { ConstraintViolationError, NotFoundError } from './impl';
import { error } from '@sveltejs/kit';

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
	 * @returns {Promise<Workout | undefined>}
	 * @throws ConstraintViolationError
	 */
	async update(str, params = {}) {
		await delay(750);
		switch (str) {
			case 'INSERT INTO workouts VALUES ($stub)':
				console.log('Updating', params);
				const stub = { name: name_from_title(params.stub.title), sets: [], ...params.stub };
				if (data.findIndex((workout) => stub.name === workout.name) >= 0) {
					throw new ConstraintViolationError(
						`Constraint violation: Workout '${stub.name}' already exists`,
						stub
					);
				}
				data.push(stub);
				return stub;
			case 'UPDATE workouts WHERE name = $name':
				console.log('Updating', params.workout);
				const index = data.findIndex((workout) => params.workout.name === workout.name);
				return (data[index] = params.workout);
			case 'DELETE FROM workouts WHERE name = $name': {
				const index = data.findIndex((workout) => params.name === workout.name);
				data.splice(index, 1);
				return;
			}
			default:
				throw new Error(`Invalid SQL: '${str}'`);
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
			slug += (index > 0 ? '-' : '') + tokens[index++].toLowerCase();
		} else {
			index++;
		}
	}
	return slug;
}

/** @type {import('./api').API} */
export const api = {
	async list_workouts() {
		const workouts = await db.query('SELECT FROM workouts');
		if (undefined === workouts || !Array.isArray(workouts)) {
			throw new Error('Unexpected database response');
		}
		return workouts;
	},
	async find_workout(name) {
		const workout = await db.query('SELECT FROM workouts WHERE name = $name', { name });
		if (undefined === workout) {
			throw new NotFoundError(`Workout not found for name: ${name ?? ''}`);
		}
		if (Array.isArray(workout)) {
			throw new Error('Unexpected database response');
		}
		return workout;
	},
	async create_workout(stub) {
		const workout = await db.update('INSERT INTO workouts VALUES ($stub)', { stub });
		if (undefined === workout) {
			throw new Error('Unexpected database response');
		}
		return workout;
	},
	async update_workout(workout) {
		const result = await db.update('UPDATE workouts WHERE name = $name', { workout });
		if (undefined === result) {
			throw new Error('Unexpected database response');
		}
		return result;
	},
	async delete_workout(name) {
		return db.update('DELETE FROM workouts WHERE name = $name', { name });
	}
};
