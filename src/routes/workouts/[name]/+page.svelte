<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>{data.workout.title}</h1>
<div><a href="/workouts/{data.workout.name}/config">Edit</a></div>
<p>Description</p>
<h2>Sets</h2>
{#each data.workout.sets as set}
	{set.toString()}
{/each}

<nav><ul><li><a href="/workouts">Workouts</a></li></ul></nav>
