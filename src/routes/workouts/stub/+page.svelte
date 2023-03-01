<!-- https://svelte.dev/repl/d773581c3a0a4718ba602c0b415da32e?version=3.55.1 -->
<script>
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { interpret, assign } from 'xstate';
	import { flash } from './flash';

	import { createService } from './machine';

	let data = {
		workout: {
			sets: [
				[
					{ exercise: 'run', duration: 10 },
					{ exercise: 'jump', duration: 20 },
					{ exercise: 'squat', duration: 30 },
					{ exercise: 'kick', duration: 40 }
				],
				[
					{ exercise: 'push-up', duration: 15 },
					{ exercise: 'lunge', duration: 25 },
					{ exercise: 'burpee', duration: 35 }
				]
			]
		}
	};

	function mapToExercise(sets, to) {
		console.log('mapToExercise', to);
		if (to.s < 0) throw new RangeError('negative');
		if (to.s > sets.length - 1) throw new RangeError('positive');
		if (to.s === 0 && to.e < 0) throw new RangeError('negative');
		if (to.s === sets.length - 1 && to.e > sets[to.s].length - 1) throw new RangeError('positive');

		//console.log(to.e, sets[to.s].length);
		if (to.e === -1) return { s: to.s - 1, e: sets[to.s - 1].length };
		if (to.e - sets[to.s].length === 0) return { s: to.s + 1, e: 0 };
		return to;
	}
	function createWorkout(w) {
		const { subscribe, set, update } = writable(w);
		return {
			subscribe,
			set,
			update,
			move(from, to) {
				let t = to; // HACK!
				update((old) => {
					const sets = structuredClone(old.sets);
					try {
						t = mapToExercise(sets, to);
					} catch (error) {
						//console.error('Caught RangeError');
						if (error instanceof RangeError) return { ...old };
						else throw error;
					}
					const [exercise] = sets[from.s].splice(from.e, 1);
					sets[t.s].splice(t.e, 0, exercise);
					return { ...old, sets };
				});

				console.log('workout.move', from, to, t);
				return t;
			},
			delete(from) {
				update((old) => {
					const sets = structuredClone(old.sets);
					const [exercise] = sets[from.s].splice(from.e, 1);
					return { ...old, sets };
				});
				return undefined;
			},
			add(to) {
				update((old) => {
					const sets = structuredClone(old.sets);
					const exercise = { exercise: 'asdf', duration: 0 };
					sets[to.s].splice(to.e, 0, exercise);
					return { ...old, sets };
				});
				return to;
			},
			change(to, exercise) {
				update((old) => {
					const sets = structuredClone(old.sets);
					sets[to.s][to.e] = { ...sets[to.s][to.e], ...exercise };
					return { ...old, sets };
				});
				return to;
			}
		};
	}
	const workout = createWorkout(data.workout);
	const config = {
		actions: logActions({
			renderFocus: async (context, event) => {
				if (context.activeRow) {
					await tick();
					const row = activeRow(context);
					if (!row) throw new Error('Invalid active row', context?.activeRow);
					if (!row?.contains(document.activeElement)) {
						console.log('changing focus', context.activeRow, row);
						row.focus();
					}
				}
			},
			setActiveRow: assign({ activeRow: (context, { s, e }) => ({ s, e }) }),
			unsetActiveRow: assign({ activeRow: () => null }),
			move: assign({
				activeRow: (context, { from, to }) => workout.move(from, to)
			}),
			beginTransaction: assign({
				cachedModel: () => $workout.sets
			}),
			commit: () => console.log('no-op'),
			rollback: assign({
				cachedModel: ({ cachedModel }) => {
					workout.update((old) => {
						return { ...old, sets: cachedModel };
					});
					return null;
				}
			})
		}),
		guards: {
			isEligible: () => true,
			isDone: () => true,
			isClean: () => true
		}
	};
	const service = createService(workout, config).start();

	// HACK
	function activeRow({ activeRow }) {
		const selector = `tr[data-s="${activeRow.s}"][data-e="${activeRow.e}"]`;
		return document.querySelector(selector);
	}

	function equals(a, b) {
		if (a === undefined || b === undefined) return false;
		if (null === a && null === b) return true;
		return a.s !== undefined && a.s === b.s && a.e !== undefined && a.e === b.e;
	}

	// HACK
	function hasDifferentParent({ target, currentTarget, relatedTarget }) {
		return (
			!currentTarget?.contains(relatedTarget) &&
			(target == currentTarget || currentTarget?.contains(target))
		);
	}

	function logActions(actions, bypass = false) {
		if (bypass) return actions;
		const out = {};
		for (const p in actions) {
			if ('function' === typeof actions[p]) {
				out[p] = function (...params) {
					console.info(`ACTION: ${p}`, ...params);
					return actions[p](...params);
				};
			} else {
				out[p] = actions[p];
			}
		}
		return out;
	}

	function handleKeyboard(event) {
		const { s, e } = $service.context.activeRow;
		switch (event.code) {
			case 'Space':
				if ($service.matches('FOCUSED.VIEWING')) service.send(['edit', 'start']);
				else if ($service.matches('FOCUSED.EDITING.MOVING.ACTIVE')) service.send(['cancel']);
				break;
			case 'ArrowUp':
				if ($service.matches('FOCUSED.EDITING.MOVING.ACTIVE')) {
					service.send([
						{
							type: 'move',
							from: { s, e },
							to: { s, e: e - 1 }
						},
						'done' // This works but we want to go back to FOCUSED.MOVING.ACTIVE on the new activeRow
					]);
				}
				break;
			case 'ArrowDown':
				if ($service.matches('FOCUSED.EDITING.MOVING.ACTIVE')) {
					service.send([
						{
							type: 'move',
							from: { s, e },
							to: { s, e: e + 1 }
						},
						'done' // This works, but we want to go back to FOCUSED.MOVING.ACTIVE on the new activeRow
					]);
				}
				break;
			default:
		}
	}
</script>

<div>
	{#each $workout.sets as set, s (s)}
		<h2 use:flash>Set {s + 1}: {set.length} exercises</h2>
		<table use:flash>
			<thead>
				<tr>
					<th>#</th>
					<th>Exercise</th>
					<th>Duration</th>
					<th>…</th>
				</tr>
			</thead>
			<tbody>
				{#each set as exercise, e (`${s}-${e}`)}
					<tr
						tabindex={s}
						data-s={s}
						data-e={e}
						class:ordering={($service.matches('FOCUSED.EDITING.MOVING.ACTIVE') ||
							$service.matches('FOCUSED.EDITING.MOVING.PROPOSING')) &&
							equals($service.context.activeRow, { s, e })}
						on:focusin|stopPropagation={(event) => {
							if (hasDifferentParent(event)) service.send('focus', { s, e });
						}}
						on:focusout|capture|stopPropagation={(event) => {
							if (!activeRow($service.context)?.contains(event.relatedTarget)) service.send('blur');
						}}
						on:keydown|self|preventDefault={handleKeyboard}
						draggable={true}
						on:dragstart={(event) => {
							service.send(['edit', 'start']);
							event.dataTransfer.setData('text/plain', `[${s}][${e}]`);
						}}
						on:dragenter|preventDefault={(event) => {}}
						on:dragover|preventDefault={(event) => {}}
						on:dragleve|preventDefault={(event) => console.log(event.type, event)}
						on:drop|preventDefault={(event) => {
							console.log(event.type, event.target.closest('tr'), event);
							const [, fromS, fromE] = /\[(\d+)\]\[(\d+)\]/g.exec(
								event.dataTransfer.getData('text/plain')
							);
							console.log({ s: fromS, e: fromE }, { s, e });
							service.send([
								{
									type: 'move',
									from: { s: fromS, e: fromE },
									to: { s, e }
								},
								'done'
							]);
						}}
						on:dragend={(event) => {
							if ('none' === event.dataTransfer.dropEffect) {
								service.send('cancel');
							}
						}}
					>
						<th
							style={s === $service.context.activeRow?.s && e === $service.context.activeRow?.e
								? 'background: pink;'
								: ''}>{e + 1}</th
						>
						<td>
							<select
								name={`sets[${s}][${e}].exercise`}
								value={exercise.exercise}
								disabled={false}
								on:change={(event) => workout.update({ s, e }, { exercise: event.target.value })}
							>
								<option value="burpee">Burpee</option>
								<option value="jump">Jump</option>
								<option value="kick">Kick</option>
								<option value="lunge">Lunge</option>
								<option value="push-up">Push-Up</option>
								<option value="run">Run</option>
								<option value="squat">Squat</option>
							</select>
						</td>
						<td
							><input
								name={`sets[${s}][${e}].duration`}
								type="number"
								value={exercise.duration}
								disabled={false}
								on:change={(event) =>
									workout.update({ s, e }, { duration: parseInt(event.target.value, 10) })}
							/></td
						>
						<td class="actions">
							<button
								type="button"
								on:click={(event) => {
									/* https://xstate.js.org/docs/fr/guides/interpretation.html#batched-events */
									service.send([
										'edit',
										'start',
										{
											type: 'move',
											from: { s, e },
											to: { s, e: e - 1 }
										},
										'done'
									]);
								}}
								disabled={0 === s + e}>⬆︎</button
							>
							<button
								type="button"
								on:click={(event) => {
									/* https://xstate.js.org/docs/fr/guides/interpretation.html#batched-events */
									service.send([
										'edit',
										'start',
										{
											type: 'move',
											from: { s, e },
											to: { s, e: e + 1 }
										},
										'done'
									]);
								}}
								disabled={s === $workout.sets.length - 1 && e === $workout.sets[s].length - 1}
								>⬇︎</button
							>
							<button type="button" on:click={(event) => workout.delete({ s, e })}>✘</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div>
			<button type="button" on:click={(event) => workout.add({ s, e: set.length })}>Add</button>
		</div>
	{/each}
</div>

<hr />
<h2>Machine</h2>
<pre>{JSON.stringify($service.value, null, 2)}
{JSON.stringify($service.context, null, 2)}</pre>
<h2>Data</h2>
<pre use:flash>{JSON.stringify($workout, null, 2)}</pre>

<style>
	:global(body) {
		font-size: 8px;
	}
	table {
		width: 100%;
		margin: 1em 0;
		border-collapse: collapse;
	}
	th,
	td {
		padding: 1em;
		border: solid 0.5px #ccc;
	}
	tr:focus,
	tr:focus-visible,
	tr:focus-within {
		/* https://css-tricks.com/copy-the-browsers-native-focus-styles/ */
		outline: 5px auto Highlight;
		outline: 5px auto -webkit-focus-ring-color;
	}
	tr.ordering {
		background: #eee;
	}
	tr.ordering .actions * {
		visibility: hidden;
	}
	input[type='number'] {
		width: 6em;
		text-align: right;
	}
</style>
