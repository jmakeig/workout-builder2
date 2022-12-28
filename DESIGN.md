# Routes

* `/workouts`: List all workouts
	* `./new`: Create a workout
		* GET: Data entry
		* POST: Save -> redirect to `./[name]/config`
	* `./[name]`: Run a workout
		* GET
	* `./[name]/config`: Configure a single workout
		* GET: Data entry
		* POST: Update config
		* POST: Remove the config