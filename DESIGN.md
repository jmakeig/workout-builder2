# Routes

* `/workouts`: List all workouts for a given user
	* `./new`: Create a workout
		* GET: Data entry
		* POST: Save stub -> redirects to `./[name]/config` for editing with sets
	* `./[name]`: Run a workout
		* GET
		* `./config`: Configure a single workout
			* GET: Data entry
			* POST: Update config
			* POST: Remove the config
* `/exercises`: List all exercises available for any user
	* `./[name]`
		* `./edit`: Edit an excercise (TODO: Who can edit an exercise? Creator? Admin?)
			* GET: Data entry
			* POST: Update exercise
			* POST: Remove the exercise
		* `./approval`: Workflow to make exercise available globally
			* GET: Show status and toggle approval
			* POST: Update approval status
		* `./metrics`: Usage metrics