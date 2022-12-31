<script>
	///** @type {import('./$types').PageData} */
	// export let data;
</script>

<h1>New Workout</h1>

<form method="post">
	<!-- No name -->
	<div>
		<label for="title">Title</label><input id="title" name="title" value="" />
	</div>
	<div>
		<label for="description">Description</label><input
			id="description"
			name="description"
			value=""
		/>
	</div>
	<button>Save</button>
	<a href="/workouts">Cancel</a>
</form>
