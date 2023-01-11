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
 * @template A
 * @typedef { Writable <A> | Readable<A> } AnyStore<A>
 */

/**
 * @template In
 * @template Out
 * @param {AnyStore<In>} store
 * @param {(value: In) => Promise<Out>} transform
 */
export function derived_async(store, transform) {
	/** @type {Array<Subscriber<Out>>}} */
	let subscribers = [];

	store.subscribe((value) =>
		transform(value)
			.then((result) => {
				console.log('sub result', result);
				for (const f of subscribers) {
					f(result);
				}
			})
			// .catch((error) => {
			// 	console.error(error);
			// })
	); // TODO: .catch()
	return {
		/**
		 * @param {Subscriber<Out>} f
		 * @returns {() => void }
		 */
		subscribe(f) {
			console.log('subscribed');
			subscribers.push(f);
			return () => {
				// Is the identity of f sufficient here?
				subscribers = subscribers.filter((item) => item !== f);
			};
		}
	};
}
