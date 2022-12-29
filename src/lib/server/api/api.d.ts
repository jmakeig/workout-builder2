import { Workout, WorkoutStub } from '$lib/types';

export interface API {
	list_workouts: () => Promise<Workout[]>;
	find_workout: (name: string) => Promise<Workout>;
	update_workout: (workout: Workout) => Promise<Workout>;
	create_workout: (workout: WorkoutStub) => Promise<Workout>;
	// validate_workout: (item: Item) => Promise<Validation[]>;
	// close: () => void;
}
