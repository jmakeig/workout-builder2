/** A workout has some identifying metadata and a set of exercises */
export interface Workout extends WorkoutStub {
	/** The unique, human-readable, URL-compatible identifier. Usually of the form `some-name-here`. */
	name: string;
	/** The groups of exercises */
	/** The readable label  */
	title: string;
	/** A short characterization */
	description: string;
	/** Groups of exercises */
	sets: ExerciseSet[];
	// rest_duration: number;
	created_at?: Date;
	updated_at?: Date;
}
/** An unsaved Workout. The `name` and `updated_at` properties are set by the database. */
export interface WorkoutStub extends Omit<Workout, "name"> {}

interface ExerciseSet extends Array<ExerciseInstance> {}

interface ExerciseInstance {
	exercise: string | Exercise;
	/** Time to run the exercise in seconds  */
	duration: number; // seconds
	/** Optional comments about the exercise */
	notes?: string;
}

export interface Exercise {
	name: string;
	title: string;
	instructions: string;
	// image
	// has_jumping
	// special_equipment
}
