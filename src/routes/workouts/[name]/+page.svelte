<script>
	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ workout } = data);
</script>

<h1>{data.workout.title}</h1>
<div><a href="/workouts/{workout.name}/config">Edit</a></div>
<p>{workout.description}</p>

<h2>Sets</h2>
<table>
	{#each workout.sets as set, s}
		<tr><th scope="column" colspan="2">Set {s+1}</th></tr>
		{#each set as exercise}
			<tr>
				<td>{exercise.exercise}</td>
				<td>{exercise.duration}</td>
			</tr>
		{/each}
	{/each}
</table>

<nav><ul><li><a href="/workouts">Workouts</a></li></ul></nav>
