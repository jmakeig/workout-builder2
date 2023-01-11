/** @typedef {import("$lib/types").Workout} Workout */
/** @typedef {import("$lib/types").WorkoutStub} WorkoutStub */
/** @typedef {import("$lib/l10n").Message} Message */
/** @typedef {{for: string, message: Message}} ValidationResult */

import { local } from './l10n';

/**
 *
 * @param {Workout} workout
 * @returns {Promise<ValidationResult[]>}
 */
export async function validate_workout(workout) {
	/** @type  { { (workout: Workout): ValidationResult[]; } [] } */
	const rules = [
		(w) => {
			if (!w.title.match(/[\p{L}\p{N}]+/gu)) {
				return [
					{
						for: 'title',
						message: { en: 'Title must contain characters' }
					}
				];
			}
			return [];
		}
		// each set instance must have an exercise
		// each set instance
	];

	return rules.flatMap((rule) => rule(workout));
}

/**
 *
 * @param {Array<any>} validation `{ for: '', message: ''}`
 * @param {string} name
 * @returns
 */
export function named(validation, name) {
	if (!Array.isArray(validation)) return validation;
	if (!name) return validation;
	return validation.filter((v) => name === v.for);
}

function update_validation(node, validations) {
	const { name } = node;
	console.log(validations);
	const my_validations = named(validations, name);
	// ? becuase (I think) validations could be undefined in the tick before the Promise is resolved (?)
	if (my_validations?.length > 0) {
		node.setCustomValidity(local(my_validations[0].message));
		node.setAttribute('aria-invalid', 'true');
		//node.setAttribute('aria-errormessage', `${name}-error`);
		/* aria-errormessage is a reference to another element. That element should also have a role="alert" and/or aria-live="polite" */
	} else {
		node.setCustomValidity('');
		node.setAttribute('aria-invalid', 'false');
		//node.removeAttribute('aria-errormessage');
	}
	//node.form?.reportValidity();
}

export function valid(node, initial) {
	const { title } = node;
	update_validation(node, initial);
	return {
		update(validation) {
			update_validation(node, validation);
		},
		destroy() {
			node.setCustomValidity('');
			node.title = title;
		}
	};
}
