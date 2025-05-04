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

		const model = (await store.get("ai.gemini.model")) as string;
		try {
			const response = await prompt(apiKey, model, [
				(await store.get("ai.gemini.prompt")) as string,
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
