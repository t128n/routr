import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VirtualizedCombobox } from "@/components/ui/virtualized-combobox";
import { useStoreValue } from "@/hooks/use-store-value";
import routes from "@/sw/routes";
import { CogIcon, RotateCwIcon } from "lucide-react";

function Settings() {
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
		<Sheet>
			<SheetTrigger>
				<Button variant="outline" size="icon">
					<CogIcon className="w-4 h-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="min-w-[120ch]">
				<SheetHeader>
					<SheetTitle>Settings</SheetTitle>
					<SheetDescription>
						Configure routr to your liking. You can reset settings to their
						default values.
					</SheetDescription>
				</SheetHeader>
				<div className="flex flex-col gap-4 px-4">
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
									const domain = urlDomainMatch ? urlDomainMatch[1] : "unknown";

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
							placeholder="Enter your model..."
							value={geminiModel}
							type="text"
							onChange={(e) => setGeminiModel(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label>Gemini API Prompt</Label>
						<Textarea
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
			</SheetContent>
		</Sheet>
	);
}

export { Settings };
