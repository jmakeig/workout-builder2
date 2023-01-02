<script>
	///** @type {import('./$types').PageData} */
	// export let data;
	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<h1>New Workout</h1>

<form method="post">
	{#if form?.message}<div class="error">{form.message}</div>{/if}
	<div>
		<label for="title">Title</label><input id="title" name="title" value={form?.stub.title ?? ''} />
	</div>
	<div>
		<label for="description">Description</label>
		<textarea id="description" name="description">{form?.stub.description ?? ''}</textarea>
	</div>
	<button>Save</button>
	<a href="/workouts">Cancel</a>
</form>

<style>
	.error {
		color: red;
	}
</style>
