import { validate_workout } from '$lib/validation';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { ConstraintViolationError, NotFoundError, ValidationError } from './impl';

const SIMULATED_DELAY = 250; // ms

/**
 * @param {number} ms
 * @returns {Promise<any>}
 */
function delay(ms = 0) {
	if (0 === ms) return Promise.resolve();
	const wait = Math.max(0, ms + 250 * (Math.random() - 0.5));
	// const wait = 0;
	// console.log(`Waiting ${wait.toFixed(0).toLocaleString()}ms`);
	return new Promise((resolve) => setTimeout(resolve, wait));
}

/** @typedef { import('$lib/types').Workout } Workout */

/** @type {Workout[]} */
const data = [
	{
		name: '15-minute-cardio',
		title: '15-Minute Cardio',
		description: '',
		sets: [
			[
				{ exercise: 'jump', duration: 30 },
				{ exercise: 'run', duration: 60 },
				{ exercise: 'jumping-jack', duration: 30 }
			],
			[{ exercise: 'jump', duration: 15 }]
		]
	}
];

/**
 * `new` is used in the URL for new workouts
 *
 * @param {string} name
 * @returns {boolean}
 */
function is_reserved(name) {
	return ['new'].includes(name);
}

const db = {
	/**
	 *
	 * @param {string} str
	 * @param {any} params
	 * @returns {Promise<Workout[] | Workout | undefined>}
	 */
	async query(str, params = {}) {
		await delay(SIMULATED_DELAY);
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
		await delay(SIMULATED_DELAY * 3);
		switch (str) {
			case 'INSERT INTO workouts VALUES ($stub)':
				// console.log('Updating', params);
				const stub = { name: name_from_title(params.stub.title), sets: [], ...params.stub };
				if (is_reserved(stub.name)) {
					throw new ConstraintViolationError(
						`Constraint violation: 'new' is a reserved name`,
						stub
					);
				}
				if (data.findIndex((workout) => stub.name === workout.name) >= 0) {
					throw new ConstraintViolationError(
						`Constraint violation: Workout '${stub.name}' already exists`,
						stub
					);
				}
				data.push(stub);
				return stub;
			case 'UPDATE workouts WHERE name = $name':
				// console.log('Updating', params.workout);
				const index = data.findIndex((workout) => params.workout.name === workout.name);
				// console.log(index);
				if (index < 0) {
					throw new ValidationError(`Workout ${params?.name} not found.`);
				}
				const validations = await validate_workout(params.workout);
				if (validations.length > 0) {
					throw new ValidationError('Nope', { cause: validations });
				}
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
	// https://stackoverflow.com/a/66721429
	const tokens = title.split(/[^\p{L}\p{N}]+/gu);
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
		// console.log('updating', JSON.stringify(workout, null, 2));
		const result = await db.update('UPDATE workouts WHERE name = $name', { workout });
		// console.log('SHOULDN’T SEE result', result);
		if (undefined === result) {
			throw new Error('Unexpected database response');
		}
		return result;
	},
	async delete_workout(name) {
		return db.update('DELETE FROM workouts WHERE name = $name', { name });
	}
};
