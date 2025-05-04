import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCwIcon, SearchIcon } from "lucide-react";

import routes from "@/sw/routes";
import { VirtualizedCombobox } from "@/components/ui/virtualized-combobox";
import { Label } from "@/components/ui/label";
import { useStoreValue } from "@/hooks/use-store-value";
import { Textarea } from "@/components/ui/textarea";

export default function App() {
	const {
		value: routeIndicator,
		update: setRouteIndicator,
		reset: resetRouteIndicator,
	} = useStoreValue("general.routeIndicator");
	const {
		value: defaultRoute,
		update: setDefaultRoute,
		reset: resetDefaultRoute,
	} = useStoreValue("general.defaultRoute");
	const {
		value: geminiApiKey,
		update: setGeminiApiKey,
		reset: resetGeminiApiKey,
	} = useStoreValue("ai.gemini.apiKey");
	const {
		value: geminiPrompt,
		update: setGeminiPrompt,
		reset: resetGeminiPrompt,
	} = useStoreValue("ai.gemini.prompt");
	const {
		value: geminiModel,
		update: setGeminiModel,
		reset: resetGeminiModel,
	} = useStoreValue("ai.gemini.model");

	function handleReset() {
		resetRouteIndicator();
		resetDefaultRoute();
		resetGeminiApiKey();
		resetGeminiPrompt();
		resetGeminiModel();
	}

	return (
		<>
			<div className="flex flex-col min-h-dvh w-vw selection:bg-pink-500 selection:text-pink-50">
				<AppHeader />
				<main className="flex-1 flex flex-col p-4">
					<div className="flex flex-col w-content mx-auto">
						<div className="py-8">
							<div className="flex flex-col gap-2">
								<h2>Search</h2>
								<form action={`${import.meta.env.BASE_URL}`} className="flex">
									<Input
										autoFocus
										name="q"
										placeholder="Search..."
										className="rounded-r-none"
									/>
									<Button className="rounded-l-none" type="submit">
										<SearchIcon className="w-4 h-4" />
									</Button>
								</form>
								<p className="text-sm">
									or configure routr to be your default search engine in your
									browser:
								</p>
								<Input
									value={`${window.location}?q=%s`}
									className="border-dashed"
									readOnly
									onClick={(e) => {
										(e.target as HTMLInputElement).select();
										navigator.clipboard.writeText(
											(e.target as HTMLInputElement).value,
										);
										toast.info("Search URL copied to clipboard");
									}}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-4">
							<h2>Settings</h2>
							<div className="flex flex-col gap-2">
								<Label>Route Indicator</Label>
								<Input
									placeholder="Enter default value..."
									value={routeIndicator}
									onChange={(e) => setRouteIndicator(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label>Select a Default Search Provider</Label>
								<VirtualizedCombobox
									searchPlaceholder="Select a search provider..."
									emptyPlaceholder="No search providers found."
									options={routes
										.sort((a, b) => a.t.localeCompare(b.t))
										.map((r) => {
											const tag = r.t;
											const label = r.s;
											const urlDomainMatch = r.u.match(
												/^(?:[a-z]+:\/\/(?:www\.)?|www\.)?([^:\/?#]+)/,
											);
											const domain = urlDomainMatch
												? urlDomainMatch[1]
												: "unknown";

											return {
												label: `[${routeIndicator}${tag}] ${label} (${domain})`,
												value: r.t,
											};
										})}
									value={defaultRoute}
									onValueChange={(value) => {
										setDefaultRoute(value);
									}}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label>Gemini API Key</Label>
								<Input
									placeholder="Enter your API key..."
									value={geminiApiKey}
									type="password"
									onChange={(e) => setGeminiApiKey(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label>Gemini API Model</Label>
								<Input
									readOnly
									placeholder="Enter your model..."
									value={geminiModel}
									type="text"
									onChange={(e) => setGeminiModel(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label>Gemini API Prompt</Label>
								<Textarea
									readOnly
									placeholder="Enter your prompt..."
									value={geminiPrompt}
									onChange={(e) => setGeminiPrompt(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Button variant="ghost" onClick={handleReset}>
									<RotateCwIcon className="w-4 h-4" />
									<span>Reset Settings</span>
								</Button>
							</div>
						</div>
					</div>
				</main>
				<AppFooter />
			</div>
			<Toaster />
		</>
	);
}
