type PromptPart = { text: string };
type Content = { role: "user" | "model" | "system"; parts: PromptPart[] };

/**
 * A single part of a candidate's content.
 */
export type CandidatePart = { text: string };

/**
 * The content of a candidate.
 */
export type CandidateContent = {
	role: "user" | "model" | "system";
	parts: CandidatePart[];
};

/**
 * A single candidate from the Gemini API response.
 */
export type Candidate = {
	content: CandidateContent;
	finishReason: string;
	avgLogprobs?: number;
};

/**
 * Only the relevant part of the Gemini API response.
 */
export type GeminiCandidatesResponse = {
	candidates: Candidate[];
};

export async function prompt(
	apiKey: string,
	model: string,
	prompt: string | string[],
): Promise<GeminiCandidatesResponse> {
	const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

	// Normalize prompt into contents array with role 'user'
	const prompts = Array.isArray(prompt) ? prompt : [prompt];
	const contents: Content[] = prompts.map((text) => ({
		role: "user",
		parts: [{ text }],
	}));

	const body = {
		contents,
	};

	const response = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Gemini API request failed (${response.status}): ${errorText}`,
		);
	}

	const json = await response.json();
	return { candidates: json.candidates } as GeminiCandidatesResponse;
}

/**
 * Tests if the API key and model are valid by making a simple request to the Gemini API.
 * @param apiKey The Gemini API key to test.
 * @param model The model to test access to.
 * @returns A promise that resolves to an object with a success boolean and optional error message.
 */
export async function testConnection(
	apiKey: string,
	model: string,
): Promise<{ success: boolean; message?: string }> {
	if (!apiKey.trim()) {
		return { success: false, message: "API key is required" };
	}

	try {
		// Use a very simple prompt to test connection
		const testPrompt = "Hello";
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
		
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [
					{
						role: "user",
						parts: [{ text: testPrompt }],
					},
				],
				generationConfig: {
					maxOutputTokens: 1, // Minimize tokens to speed up the test
				},
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			let errorMessage = `Connection failed (${response.status})`;
			
			try {
				// Try to parse the error response for more details
				const errorJson = JSON.parse(errorText);
				if (errorJson.error && errorJson.error.message) {
					errorMessage = errorJson.error.message;
				}
			} catch (e) {
				// If parsing fails, use the raw error text
				errorMessage += `: ${errorText}`;
			}
			
			return { success: false, message: errorMessage };
		}

		return { success: true, message: "Connection successful" };
	} catch (error) {
		return { 
			success: false, 
			message: error instanceof Error 
				? error.message 
				: "Unknown error occurred while testing connection" 
		};
	}
}
