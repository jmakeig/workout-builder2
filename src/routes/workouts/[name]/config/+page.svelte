<!--svelte:options immutable={true}/-->
<script>
	// https://svelte.dev/repl/7fccf657414f47749a0272f52aceb4f1?version=3.55.1
	import { writable } from 'svelte/store';
	import { derived_async } from '$lib/state';
	import { validate_workout, valid, named } from '$lib/validation';
	import { add_styles } from 'svelte/internal';
	import { unchangedTextChangeRange } from 'typescript';

	/** @typedef {import("$lib/types").Workout} Workout */
	/** @typedef {import('$lib/types').ExerciseSet} ExerciseSet */
	/** @typedef {import('$lib/types').ExerciseInstance} ExerciseInstance */
	/** @typedef {import('$lib/validation').ValidationResult} ValidationResult */

	/**
	 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement } node
	 * @param {(value: any) => void} updater
	 * @returns {{destroy: () => void}}
	 */
	function deep(node, updater) {
		function input_listener() {
			updater(node.value);
		}
		node.addEventListener('input', input_listener);
		return {
			destroy() {
				node.removeEventListener('input', input_listener);
			}
		};
	}

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	/** @type {import("svelte/store").Writable<Workout>} */
	//const workout = writable(form?.workout ?? data.workout);

	/**
	 * @param {Workout} value
	 * @return {import('svelte/store').Writable<Workout> & 
							{
								add_set: (index?: number) => void, 
								remove_set: (index: number) => void,
								add_exercise: (set_index: number, exercise_index?: number) => void
							}
						}
	 */
	function create_workout_store(value) {
		const { subscribe, set, update } = writable(value);
		return {
			subscribe,
			set,
			update,
			add_set(index) {
				/** @type {ExerciseInstance}*/
				const empty_exercise = { exercise: '', duration: 0 };
				/** @type {ExerciseSet} */
				const new_set = [empty_exercise];
				update((current) => {
					/** @type {ExerciseSet[]} */
					const copy = [...current.sets];
					if (undefined === index) {
						copy.push(new_set);
					} else if (index >= 0 && index < copy.length) {
						copy.splice(index, 0, new_set);
					} else {
						throw new RangeError(`Invalid index ${index}`);
					}
					current.sets = copy;
					return current;
				});
			},
			remove_set(index) {
				update((current) => {
					const copy = [...current.sets];
					copy.splice(index, 1);
					current.sets = copy;
					return current;
				});
			},
			add_exercise(set_index, exercise_index) {
				/** @type {ExerciseInstance} */
				const new_exercise = { exercise: '', duration: 30 };
				update((current) => {
					const copy = [...current.sets];
					const set = [...copy[set_index]];
					if (undefined === exercise_index) {
						set.push(new_exercise);
					} else if (exercise_index >= 0 && exercise_index < set.length) {
						set.splice(exercise_index, 0, new_exercise);
					} else {
						throw new RangeError();
					}
					copy[set_index] = set;
					current.sets = copy;
					return current;
				});
			}
		};
	}
	const workout = create_workout_store(form?.workout ?? data.workout);

	/** @type {import("svelte/store").Readable<ValidationResult[]>} */
	// @ts-ignore
	const validations = derived_async(workout, validate_workout, form?.validations);
</script>

<svelte:head>
	<title>{['Workout', $workout.title].join(' • ')}</title>
</svelte:head>

<h2>Workout</h2>
<pre>{JSON.stringify($workout, null, 2)}</pre>
<pre>{JSON.stringify($validations, null, 2)}</pre>
<!--
<h2>FormData</h2>
<pre>{qs}</pre>
-->
<form method="post">
	<input type="hidden" name="name" bind:value={$workout.name} />
	<div class="control">
		<label for="title">Title</label>
		<input
			type="text"
			id="title"
			name="title"
			bind:value={$workout.title}
			use:valid={$validations}
		/>
	</div>
	<div class="control">
		<label for="description">Description</label>
		<textarea
			id="description"
			name="description"
			bind:value={$workout.description}
			use:valid={$validations}
		/>
	</div>
	{#each $workout.sets as set, s}
		<fieldset>
			<legend>Set {s + 1}</legend>
			<table>
				<thead><tr><th>Exercise</th><th>Duration</th></tr></thead>
				<tbody>
					{#each set as exercise, e}
						<tr>
							<td>
								<select
									id="sets[{s}][{e}].exercise"
									name="sets[{s}][{e}].exercise"
									value={exercise.exercise}
									use:deep={(v) => {
										$workout.sets[s][e].exercise = v;
										$workout.sets = [...$workout.sets];
									}}
								>
									<option value="" />
									<option value="run">Run</option>
									<option value="jump">Jump</option>
									<option value="jumping-jack">Jumping Jack</option>
								</select>
							</td>
							<td>
								<input
									type="number"
									id="sets[{s}][{e}].duration"
									name="sets[{s}][{e}].duration"
									value={exercise.duration}
									min="5"
									max={60 * 60}
									step="5"
									placeholder="seconds"
									use:deep={(v) => {
										$workout.sets[s][e].duration = v;
										$workout.sets = [...$workout.sets];
									}}
								/>
								{#if 0 === e} seconds {/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div>
				<button type="button" on:click={(evt) => workout.add_exercise(s)}>Add exercise</button>
			</div>
		</fieldset>
	{/each}
	<div><button type="button" on:click={(evt) => workout.add_set()}>Add set</button></div>
	<div>
		<button formaction="?/save" disabled={$validations?.length > 0}>Save</button>
	</div>
</form>

<style>
	pre {
		height: 10em;
		overflow: auto;
		border: solid 0.5px #ccc;
		font-size: 0.75em;
	}
	.control {
		margin: 1em 0;
		display: flex;
		align-items: baseline;
	}
	.control > label {
		width: 8em;
	}
	input,
	textarea,
	select {
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
	}
	.control > input,
	/* .control > select, */
	.control > textarea {
		flex-grow: auto;
		width: 100%;
	}
	.control > textarea {
		min-height: 6em;
	}
	fieldset {
		margin: 1em 0;
		border: solid 0.5px #ccc;
	}
	input:not([type]),
	input[type='text'],
	textarea {
		transition-property: background-color, color, border-color;
		transition-duration: 0.1s;
		transition-timing-function: ease-in;
	}
	input[type='text']:read-only,
	textarea:read-only {
		border-color: transparent;
		pointer-events: none;
	}
	input[type='text']:invalid,
	textarea:invalid {
		background-color: #ffe4e6;
		color: #e11d48;
		border-color: #e11d48;
	}
	input[type='number'] {
		text-align: right;
	}
	table th,
	table td {
		padding: 0.25em;
	}
	table thead th {
		text-align: left;
	}
</style>
