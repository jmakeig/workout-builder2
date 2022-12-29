import { Workout } from '$lib/types';

export type WorkoutStub = {
	title: string;
	description: string;
};

export type API = {
	list_workouts: () => Promise<Workout[]>;
	find_workout: (name: string) => Promise<Workout | undefined>;
	update_workout: (workout: Workout) => Promise<Workout>;
	create_workout: (workout: WorkoutStub) => Promise<Workout>;
	// validate_workout: (item: Item) => Promise<Validation[]>;
	// close: () => void;
};
