<script>
	/** @type {import('./$types').PageData} */
	export let data;

	let tmp = [
		[
			{ exercise: { name: 'jump', title: 'Jump' }, duration: 30 },
			{ exercise: { name: 'squat', title: 'Squat' }, duration: 30 },
			{ exercise: { name: 'run', title: 'Run' }, duration: 30 }
		],
		[
			{ exercise: { name: 'plank', title: 'Plank' }, duration: 30 },
			{ exercise: { name: 'jumping-jack', title: 'Jumping Jack' }, duration: 30 },
			{ exercise: { name: 'push-up', title: 'Push-up' }, duration: 30 },
			{ exercise: { name: 'toe-touch', title: 'Toe Touch' }, duration: 30 }
		]
	];
</script>

<h1>Edit: {data.workout.title}</h1>

<form method="post">
	<input type="hidden" name="name" value={data.workout.name} />
	<div>
		<label for="title">Title</label><input
			id="title"
			name="title"
			bind:value={data.workout.title}
		/>
	</div>
	<div>
		<label for="description">Description</label>
		<input id="description" name="description" bind:value={data.workout.description} />
	</div>
	<!-- https://remix.run/docs/en/v1/pages/faq#how-can-i-have-structured-data-in-a-form -->
	<!-- const queryString = new URLSearchParams(new FormData(myForm)).toString() -->
	{#each tmp as set, s}
		<fieldset>
			<legend>Set {s + 1}</legend>
			{#each set as instance, i}
				<div>
					<label for="set{s}-exercise{i}">Exercise</label>
					{instance.exercise.name}
					<select
						id="sets[{s}][{i}].exercise"
						name="sets[{s}][{i}]"
						bind:value={instance.exercise.name}
					>
						<option value="jump">Jump</option>
						<option value="squat">Squat</option>
						<option value="run">Run</option>
						<option value="plank">Plank</option>
						<option value="jumping-jack">Jumping Jack</option>
						<option value="push-up">Push-up</option>
						<option value="toe-touch">Toe Touch</option>
					</select>
					<label for="sets[{s}][{i}]">Duration</label>
					<input
						type="number"
						id="sets[{s}][{i}].duration"
						name="sets[{s}][{i}].duration"
						min="1"
						max="500"
						bind:value={instance.duration}
					/>
				</div>
			{/each}
			<!--
			<div>
				<label for="set0-exercise1">Exercise</label>
				<select id="set0-exercise1" name="set0-exercise">
					<option value="jump">Jump</option>
					<option value="squat" selected>Squat</option>
					<option value="run">Run</option>
				</select>
				<label for="set0-duration1">Duration</label>
				<input type="number" id="set0-duration1" name="set0-duration" min="1" max="500" />
			</div>
			<div>
				<label for="set0-exercise2">Exercise</label>
				<select id="set0-exercise2" name="set0-exercise">
					<option value="jump">Jump</option>
					<option value="squat">Squat</option>
					<option value="run" selected>Run</option>
				</select>
				<label for="set0-duration2">Duration</label>
				<input type="number" id="set0-duration2" name="set0-duration" min="1" max="500" />
			</div>
			-->
		</fieldset>
	{/each}
	<div class="form-actions">
		<button formaction="?/save">Save</button>
		<button
			type="button"
			on:click={(evt) => {
				// console.log(evt);
				tmp = [...tmp, []];
			}}>Add Set</button
		>
		<button formaction="?/delete">Delete</button>
	</div>
	<nav>
		<ul>
			<li>
				<a href="/workouts/{data.workout.name}">Cancel</a>
			</li>
		</ul>
	</nav>
</form>
