/**
 * @template W
 * @typedef {import("svelte/store").Writable<W>} Writable<W>
 */

/**
 * @template R
 * @typedef {import("svelte/store").Readable<R>} Readable<R>
 */

/**
 * @template S
 * @typedef {import("svelte/store").Subscriber<S>} Subscriber<S>
 */

/**
 * @template In
 * @template Out
 * @param {Readable<In>} store A store to listen for changes
 * @param {(value: In) => Promise<Out>} transform The function to transform from `In` to `Out`
 * @param {Out | undefined} [initial_value] the initial value, before any subscribers are attached
 */
export function derived_async(store, transform, initial_value) {
	/** @type {Array<Subscriber<Out>>}} */
	let subscribers = [];

	store.subscribe((value) =>
		transform(value).then((result) => {
			for (const f of subscribers) {
				console.log('Calling validation subscriber');
				f(result);
			}
		})
	); // TODO: .catch()
	return {
		/**
		 * @param {Subscriber<Out>} f
		 * @returns {() => void }
		 */
		subscribe(f) {
			// Initialize before first subsriptions
			if (undefined !== initial_value) {
				console.log('calling initial value');
				f(initial_value);
			}
			subscribers.push(f);
			return () => {
				// Is the identity of f sufficient here?
				subscribers = subscribers.filter((item) => item !== f);
			};
		}
	};
}
