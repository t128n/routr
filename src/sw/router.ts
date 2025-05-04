import routes from "./routes";
import { store } from "./store";
import { prompt } from "./ai";

function isRequestRelevant(request: Request): boolean {
	// Searches will only use the GET method
	if (request.method !== "GET") {
		return false;
	}

	// All searches will include the `q` (query) parameter
	const url = new URL(request.url);
	if (!url.searchParams.has("q")) {
		return false;
	}

	// If all checks pass, the request is relevant
	// and should be handled by the service worker
	return true;
}

async function handleRequest(request: Request): Promise<Response> {
	const routeIndicator = (await store.get("general.routeIndicator")) as string;
	const defaultRoute = (await store.get("general.defaultRoute")) as string;

	const searchQuery = new URL(request.url).searchParams.get("q");
	if (!searchQuery) {
		return new Response("No search query provided", { status: 400 });
	}

	const { routeTag, isDoubleRoute, cleanQuery } = extractRoute(
		searchQuery,
		routeIndicator,
	);

	let route = routes.find((r) => r.t === routeTag);
	if (!route) {
		const defaultRouteObj = routes.find((r) => r.t === defaultRoute);
		route = defaultRouteObj;
	}

	if (!route) {
		return new Response("No matching route found", { status: 404 });
	}

	let finalQuery = cleanQuery;

	if (isDoubleRoute) {
		// If it's a double route, we need to use the Gemini API
		const apiKey = (await store.get("ai.gemini.apiKey")) as string;
		if (!apiKey) {
			return new Response("Gemini API key not set", { status: 403 });
		}

		const model = "gemini-2.5-flash";
		try {
			const response = await prompt(apiKey, model, [
				`
You are QueryCraft, a specialist in converting plain-language searches into laser-focused queries that exploit advanced operators and filters.

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
				`Search Platform: ${route.u}`,
				`User Query: ${cleanQuery}`,
			]);

			const responseText = response.candidates[0].content.parts[0].text;
			if (!responseText) {
				return new Response("No response from Gemini API", { status: 500 });
			}

			finalQuery = responseText;
		} catch (error) {
			return new Response(`Error: ${error}`, { status: 500 });
		}
	}

	const routeUrl = route.u.replace("{{{s}}}", encodeURIComponent(finalQuery));

	return Response.redirect(routeUrl, 302);
}

function extractRoute(
	searchQuery: string,
	routeIndicator: string,
): { routeTag: string; isDoubleRoute: boolean; cleanQuery: string } {
	// Split the query into tokens by whitespace
	const tokens = searchQuery.split(/\s+/);
	let routeTag = "";
	let isDoubleRoute = false;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		// 1) Double-indicator always wins, even if there's no tag after it
		if (token.startsWith(routeIndicator + routeIndicator)) {
			// slice off the two indicators; may be empty string
			const tag = token.slice(routeIndicator.length * 2);
			routeTag = tag; // may be ""
			isDoubleRoute = true;
			tokens.splice(i, 1);
			break;
		}

		// 2) Single-indicator only if there _is_ a tag
		if (token.startsWith(routeIndicator)) {
			const tag = token.slice(routeIndicator.length);
			if (tag) {
				routeTag = tag;
				isDoubleRoute = false;
				tokens.splice(i, 1);
				break;
			}
		}
	}

	const cleanQuery = tokens
		.filter((t) => t.trim() !== "")
		.join(" ")
		.trim();
	return {
		routeTag,
		isDoubleRoute,
		cleanQuery,
	};
}

export { isRequestRelevant, handleRequest };
