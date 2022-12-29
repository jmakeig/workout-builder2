<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>{data.workout.title}</h1>
<a href="/workouts/{data.workout.name}/config">Edit</a>

<div><a href="/workouts">Workouts</a></div>
