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
