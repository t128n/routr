import { openDB, type IDBPDatabase, type DBSchema } from "idb";

export interface DefaultValues {
	"general.routeIndicator": string;
	"general.defaultRoute": string;
	"ai.gemini.apiKey": string;
	"ai.gemini.prompt": string;
	"ai.gemini.model": string;
}

export const DEFAULTS: DefaultValues = {
	"general.routeIndicator": "!",
	"general.defaultRoute": "g",
	"ai.gemini.apiKey": "",
	"ai.gemini.prompt": `You are Routr, a specialist in converting plain-language searches into laser-focused queries that exploit advanced operators and filters.

1. **Identify Platform & Capability**  
- Read the **Search Platform** string.  
- Use only syntax native to that platform; if unrecognized, default to cross-engine operators (Boolean AND/OR/NOT, quotes for exact matches, site:, intitle:, inurl:, filetype:, wildcards *).

2. **Infer Intent & Facets**  
- Parse the user query for: primary topic, desired content type (news, academic paper, tutorial, file, etc.), authoritative sources, language, geography, and timeframe.  
- Translate inferred facets into corresponding operators (e.g., date ranges, language filters, country domains, site:gov).  
- Add or exclude domains (site:example.com OR -site:irrelevant.com) to heighten relevance.

3. **Operator Application**  
- Wrap exact phrases in double quotes.  
- Use Boolean logic and parentheses for clarity.  
- Apply intitle:, inurl:, filetype:, OR site: filters where they sharpen focus.  
- Introduce wildcards * only when they meaningfully broaden recall.

4. **Synonym & Variant Handling**  
- When it aids recall, OR-chain likely synonyms or abbreviations.  
- Preserve all user-supplied terms; never delete them.

5. **Conciseness & Precision**  
- Remove filler words (e.g., "the", "a", "how to") unless required for exact meaning.  
- Keep the final query succinct—no unnecessary spaces or duplicated operators.

6. **Structured Output**  
- Return **one single line** containing only the optimized query string.  
- **Do not** add explanations, prefixes, code fences, or extra text.

7. **Fail-Safe**  
- If no enhancement is possible, echo the original query unchanged—but still on one line.`,
	"ai.gemini.model": "gemini-2.5-flash",
};

export type StoreKey = keyof DefaultValues;
type RecordType<K extends StoreKey = StoreKey> = {
	key: K;
	value: DefaultValues[K];
};

interface StoreSchema extends DBSchema {
	store: {
		key: StoreKey;
		value: RecordType; // union of { key: StoreKey; value: DefaultValues[StoreKey] }
	};
}

let dbPromise: Promise<IDBPDatabase<StoreSchema>> | null = null;

function getDB() {
	if (!dbPromise) {
		dbPromise = openDB<StoreSchema>("routr", 1, {
			upgrade(db, _oldVersion, _newVersion, tx) {
				// create store if missing
				if (!db.objectStoreNames.contains("store")) {
					db.createObjectStore("store", { keyPath: "key" });
				}

				// seed defaults
				const os = tx.objectStore("store");
				for (const key of Object.keys(DEFAULTS) as StoreKey[]) {
					os.get(key).then((record) => {
						if (record === undefined) {
							os.add({ key, value: DEFAULTS[key] });
						}
					});
				}
			},
			terminated() {
				dbPromise = null;
			},
		}).catch((err) => {
			dbPromise = null;
			throw err;
		});
	}
	return dbPromise;
}

//
// 3) Export a single `store` object
//
export const store = {
	async set<K extends StoreKey>(
		key: K,
		value: DefaultValues[K],
	): Promise<void> {
		const db = await getDB();
		// `put` accepts our { key, value } record
		await db.put("store", { key, value } as RecordType<K>);
	},

	async get<K extends StoreKey>(
		key: K,
		overrideDefault?: DefaultValues[K],
	): Promise<DefaultValues[K] | undefined> {
		const db = await getDB();
		const record = await db.get("store", key);
		if (record !== undefined) {
			return (record as RecordType<K>).value;
		}
		if (overrideDefault !== undefined) {
			return overrideDefault;
		}
		return DEFAULTS[key];
	},

	async delete(key: StoreKey): Promise<void> {
		const db = await getDB();
		await db.delete("store", key);
	},

	async clear(): Promise<void> {
		const db = await getDB();
		await db.clear("store");
	},

	DEFAULTS,
};
