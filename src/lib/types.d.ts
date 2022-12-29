export type Workout = {
	/** The unique, human-readable, URL-compatible identifier. Usually of the form `some-name-here`. */
	name: string;
	/** The readable label  */
	title: string;
	/** A short characterization */
	description: string;
	/** The groups of exercises */
	sets: Set[];
};

type Set = {};
