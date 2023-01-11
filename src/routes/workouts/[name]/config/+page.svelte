<!--svelte:options immutable={true}/-->
<script>
	// https://svelte.dev/repl/7fccf657414f47749a0272f52aceb4f1?version=3.55.1
	import { writable } from 'svelte/store';
	import { derived_async } from '$lib/state';
	import { validate_workout, valid, named } from '$lib/validation';

	// TODO: Do I even need this? It’s just on:input={evt => updater(evt.target.value)}.
	//       Is the deep update logic generalizable?
	
	/**
	 * @param {HTMLInputElement} node
	 * @param {(value: any) => any} updater
	 * @returns {{destroy: () => void}}
	 */
	function deep(node, updater) {
		function input_listener() {
			return updater(node.value);
		}
		node.addEventListener('input', input_listener);
		return {
			destroy() {
				node.removeEventListener('input', input_listener);
			}
		};
	}

	/*
	let data = {
		workout: {
			name: 'asdf',
			title: 'Asdf',
			description: 'Here is some long-form text to describe it.',
			sets: [
				[
					{ exercise: 'jump', duration: 30 },
					{ exercise: 'run', duration: 60 },
					{ exercise: 'jumping-jack', duration: 30 }
				],
				[{ exercise: 'jump', duration: 15 }]
			]
		}
	};
	*/

	export let data;

	/** @typedef {import("$lib/types").Workout} Workout */
	/** @type {import("svelte/store").Writable<Workout>} */
	const workout = writable(data.workout);
	//const validations = derived(workout, $w => []);
	const validations = derived_async(workout, validate_workout);
</script>

<h2>Workout</h2>
<pre>{JSON.stringify($workout, null, 2)}</pre>
<!--
<h2>FormData</h2>
<pre>{qs}</pre>
-->
<form>
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
								<!--label for="workout.sets[{s}][{e}].exercise">Exercise</label-->
								<select
									id="workout.sets[{s}][{e}].exercise"
									name="workout.sets[{s}][{e}].exercise"
									bind:value={exercise.exercise}
								>
									<option value="run">Run</option>
									<option value="jump">Jump</option>
									<option value="jumping-jack">Jumping Jack</option>
								</select>
							</td>
							<td>
								<!--label for="workout.sets[{s}][{e}].duration">Exercise</label-->
								<input
									type="number"
									id="workout.sets[{s}][{e}].duration"
									name="workout.sets[{s}][{e}].duration"
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
		</fieldset>
	{/each}
</form>

<style>
	pre {
		height: 10em;
		overflow: auto;
		border: solid 0.5px #ccc;
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
