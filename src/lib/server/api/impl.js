export { api } from './local';
/** @typedef {import('$lib/validation').ValidationResult} ValidationResult */

/** Base type for client- and server-side validations. */
export class ValidationError extends Error {
	/**
	 * @constructor
	 * @param {string} message
	 * @param {{cause: ValidationResult[]}} [options = { cause: []}]
	 */
	constructor(message, options = { cause: [] }) {
		super(message, options);
		this.name = this.constructor.name;
	}
	/**
	 * 
	 * @param {string} name 
	 * @returns {ValidationResult[]}
	 */
	validations_for(name) {
		/** @type {ValidationResult[]} */
		// @ts-ignore
		const validations = this.cause;
		return validations.filter(v => v.for === name);
	}
}
export class NotFoundError extends ValidationError {}
export class ConstraintViolationError extends ValidationError {}
