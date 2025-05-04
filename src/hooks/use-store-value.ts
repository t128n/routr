import { useState, useEffect, useCallback } from "react";
import { store } from "@/sw/store";
import type { DefaultValues, StoreKey } from "@/sw/store";

/**
 * Optimistic React hook for IndexedDB-backed store.
 * Lazily fetches initial value (or default) and keeps UI optimistic on updates.
 */
export function useStoreValue<K extends StoreKey>(
	key: K,
	overrideDefault?: DefaultValues[K],
) {
	// Initialize state optimistically: use overrideDefault if provided, else default
	const initial =
		overrideDefault !== undefined ? overrideDefault : store.DEFAULTS[key];
	const [value, setValue] = useState<DefaultValues[K]>(initial);

	useEffect(() => {
		let canceled = false;
		// Lazy fetch from IndexedDB
		store.get(key, overrideDefault).then((v) => {
			if (canceled) return;
			if (v !== undefined && v !== value) {
				setValue(v);
			}
		});
		return () => {
			canceled = true;
		};
	}, [key, overrideDefault, value]);

	// Memoized setter that updates both state and DB
	const update = useCallback(
		(newValue: DefaultValues[K]) => {
			// Optimistic update
			setValue(newValue);
			// Persist to IndexedDB
			store.set(key, newValue).catch((err) => {
				console.error("Failed to persist store value for key", key, err);
			});
		},
		[key],
	);

	// Optional: delete resets to default
	const reset = useCallback(() => {
		const def = store.DEFAULTS[key];
		setValue(def);
		store.delete(key).catch((err) => {
			console.error("Failed to delete store value for key", key, err);
		});
	}, [key]);

	return { value, update, reset };
}
