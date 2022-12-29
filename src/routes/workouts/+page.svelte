<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>List Workouts</h1>

<p><a href="/workouts/new">Create a new workout</a></p>

<ul>
	{#each data.workouts as workout}
		<li><a href="/workouts/{workout.name}">{workout.title}</a></li>
	{/each}
</ul>
