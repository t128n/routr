import routes from "/routr/routes.js";

//#region Service Worker Lifecycle

/**
 * Service Worker Lifecycle: Install
 * @description Handles the install event and activates the new worker immediately.
 */
self.addEventListener("install", () => {
	// Activate worker immediately after installation
	self.skipWaiting();
});

/**
 * Request Interceptor
 * @description This service worker re-routes requests to the user-configured search engine.
 * @param {FetchEvent} event
 */
self.addEventListener("fetch", (event) => {
	// Only intercept requests with a query parameter
	if (!isRequestRelevant(event.request)) return fetch(event.request);

	console.debug("Intercepting request:", event.request.url);

	event.respondWith(handleRequest(event.request));
});

//#endregion

//#region Utility Functions

const DEFAULT_PREFIX = "!";
const DEFAULT_ROUTE = "g";

async function handleRequest(request) {
	const query = decodeURIComponent(new URL(request.url).searchParams.get("q"));
	let route = findRoute(DEFAULT_PREFIX, query);
	if (!route) {
		route = DEFAULT_ROUTE;
	}

	const isDoubleRoute = route.startsWith(DEFAULT_PREFIX.repeat(2));

	let searchEngine = routes.find(
		(route) => route.t === route.replaceAll(DEFAULT_PREFIX, ""),
	);
	if (!searchEngine) {
		searchEngine = routes.find(
			(route) => route.t === DEFAULT_ROUTE.replaceAll(DEFAULT_PREFIX, ""),
		);	
	}

	let processedQuery = cleanQuery(query, route);

	if (isDoubleRoute) {
		processedQuery = await optimizeQuery(processedQuery, request.url);
	}

	const searchUrl = searchEngine.url.replace(
		"%s",
		encodeURIComponent(processedQuery),
	);

	return Response.redirect(searchUrl, 302);
}

/**
 * Cleans a query string by removing a specified route prefix.
 *
 * @param {string} query - The query string to clean.
 * @param {string} route - The route prefix to remove from the query string.
 * @returns {string} The cleaned query string with the route prefix removed and any leading/trailing whitespace trimmed.
 */
function cleanQuery(query, route) {
	// Remove the route prefix from the query
	const cleanedQuery = query.replace(new RegExp(`${escapeRegex(route)}`), "");
	return cleanedQuery.trim();
}

/**
 * Optimizes a search query using the Gemini API to be more concise and effective.
 *
 * @async
 * @function optimizeQuery
 * @param {string} query - The original search query to optimize.
 * @returns {Promise<string>} A promise that resolves to the optimized query string, or the original query if optimization fails.
 * @throws {Error} If the Gemini API key is not set or if there is an error during the API call.
 */
async function optimizeQuery(query, rawUrl) {
	const prompt = `Optimize the following search query for maximum effectiveness and conciseness on major search engines. Focus on core keywords, clarity, and relevance. Incorporate appropriate search operators (e.g., site:, intitle:, filetype:, "", -, OR, AND, ..) where they significantly improve result targeting. The goal is a highly precise and efficient query string. Return a JSON object with an 'optimized_query' field containing only the optimized query string. Do not include any explanations or extra fields outside the specified JSON structure.\n\nOriginal query: \"${query}\"`;

	const urlObj = new URL(rawUrl);
	const apiKey = urlObj.searchParams.get("api");
	if (!apiKey) {
		console.warn("Gemini API key not set. Returning original query.");
		return `${query} (Warning: Gemini API key not set)`;
	}

	const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(atob(apiKey))}`;

	const body = {
		contents: [
			{
				parts: [{ text: prompt }],
			},
		],
		generationConfig: {
			response_mime_type: "application/json",
			response_schema: {
				type: "OBJECT",
				properties: {
					optimized_query: { type: "STRING" },
				},
			},
		},
	};

	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			console.error(
				"Gemini API error:",
				response.status,
				await response.text(),
			);
			return query;
		}

		const data = await response.json();
		const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
		const parsed = JSON.parse(text || "{}");
		return parsed.optimized_query || query;
	} catch (e) {
		console.error("Failed to optimize query:", e);
		return query;
	}
}

/**
 * Checks if a given request is relevant based on its method and query parameters.
 * A request is considered relevant if it is a GET request and contains a query parameter.
 *
 * @param {Request} request - The request object to check.
 * @returns {boolean} - True if the request is a GET request and contains a query parameter, false otherwise.
 */
function isRequestRelevant(request) {
	const url = new URL(request.url);
	const query = url.searchParams.get("q");

	// Check if the request is relevant
	return request.method === "GET" && query;
}

/**
 * Escapes characters that have special meaning in regular expressions.
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
function escapeRegex(str) {
	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape for most characters, handle ']' and '-' specially.
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

/**
 * Finds a single "route" (prefixed token) in a string.
 * A route consists of 1 or 2 occurrences of the prefix character,
 * followed by zero or more non-whitespace characters, treated as a whole word.
 * Returns the first matched route token, or null if none found or inputs are invalid.
 *
 * @param {string} prefixChar - The single character to use as the prefix (e.g., '!', '$', '&').
 * @param {string} text - The text to search within.
 * @returns {string|null} The first matched route token, or null if not found or inputs are invalid.
 */
function findRoute(prefixChar, text) {
	if (
		typeof prefixChar !== "string" ||
		prefixChar.length !== 1 ||
		typeof text !== "string"
	) {
		console.error(
			"Invalid input: prefixChar must be a single character string, text must be a string.",
		);
		return [];
	}

	const escapedPrefix = escapeRegex(prefixChar);

	const regex = new RegExp(
		`(?:^|\\s)(${escapedPrefix}{1,2}\\S*)(?=\\s|$)`,
		"g",
	);

	const matchResult = regex.exec(text);

	return matchResult ? matchResult[1] : null;
}

//#endregion
