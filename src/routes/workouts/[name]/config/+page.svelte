<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Edit: {data.workout.title}</h1>

<form method="post">
	<input type="hidden" name="name" value={data.workout.name} />
	<div>
		<label for="title">Title</label><input id="title" name="title" value={data.workout.title} />
	</div>
	<div>
		<label for="description">Description</label><input
			id="description"
			name="description"
			value={data.workout.description}
		/>
	</div>
	<div>{data.workout.sets.length}</div>
	<button>Save</button>
	<a href="/workouts/{data.workout.name}">Cancel</a>
</form>
