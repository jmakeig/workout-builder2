<script>
	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ workout } = data);
</script>

<h1>{data.workout.title}</h1>
<div><a href="/workouts/{workout.name}/config">Edit</a></div>
<p>{workout.description}</p>

<h2>Sets</h2>
{#each workout.sets as set}
	{set.toString()}
{/each}

<nav><ul><li><a href="/workouts">Workouts</a></li></ul></nav>
