/** A workout has some identifying metadata and a set of exercises */
export interface Workout extends WorkoutStub {
	/** The unique, human-readable, URL-compatible identifier. Usually of the form `some-name-here`. */
	name: string;
	/** The groups of exercises */
	sets: ExerciseSet[];
	// rest_duration: number;
}

export interface WorkoutStub {
	/** The readable label  */
	title: string;
	/** A short characterization */
	description: string;
}

interface ExerciseSet extends Array<ExerciseInstance> {}

interface ExerciseInstance {
	exercise: Exercise;
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
