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
import { CogIcon, RotateCwIcon, InfoIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

function Settings() {
	const [showApiKey, setShowApiKey] = useState(false);
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
				<Button variant="outline" size="icon" title="Settings (⌘,)" className="relative">
					<CogIcon className="w-4 h-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="min-w-[120ch] overflow-y-auto">
				<SheetHeader className="sticky top-0 bg-background z-10 p-6 border-b">
					<SheetTitle className="text-2xl">Settings</SheetTitle>
					<SheetDescription>
						Configure routr to your liking. Press ⌘, to open settings anytime.
					</SheetDescription>
				</SheetHeader>
				<div className="flex flex-col gap-8 p-6">
					{/* General Settings */}
					<section className="space-y-6">
						<div>
							<h2 className="text-lg font-semibold mb-2">General Settings</h2>
							<p className="text-sm text-muted-foreground mb-4">
								Configure how routr behaves and appears.
							</p>
						</div>
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Label htmlFor="route-indicator">Route Indicator</Label>
									<HoverCard>
										<HoverCardTrigger>
											<InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
										</HoverCardTrigger>
										<HoverCardContent>
											<p>The prefix used to indicate a route (e.g., '!g' or '$g')</p>
										</HoverCardContent>
									</HoverCard>
								</div>
								<Input
									id="route-indicator"
									placeholder="e.g., g"
									value={routeIndicator}
									onChange={(e) => setRouteIndicator(e.target.value)}
									className="max-w-xs"
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Label htmlFor="default-route">Default Search Provider</Label>
									<HoverCard>
										<HoverCardTrigger>
											<InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
										</HoverCardTrigger>
										<HoverCardContent>
											<p>The search engine that will be used when no route is specified</p>
										</HoverCardContent>
									</HoverCard>
								</div>
								<VirtualizedCombobox
									searchPlaceholder="Search providers..."
									emptyPlaceholder="No providers found."
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
									onValueChange={setDefaultRoute}
								/>
							</div>
						</div>
					</section>

					{/* AI Settings */}
					<section className="space-y-6">
						<div>
							<h2 className="text-lg font-semibold mb-2">AI Integration</h2>
							<p className="text-sm text-muted-foreground mb-4">
								Configure Gemini AI integration settings.
							</p>
						</div>
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Label htmlFor="api-key">API Key</Label>
									<HoverCard>
										<HoverCardTrigger>
											<InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
										</HoverCardTrigger>
										<HoverCardContent>
											<p>Your Gemini API key for AI integration. Get one from the Google AI Studio.</p>
										</HoverCardContent>
									</HoverCard>
								</div>
								<div className="relative max-w-xs">
									<Input
										id="api-key"
										placeholder="Enter your API key..."
										value={geminiApiKey}
										type={showApiKey ? "text" : "password"}
										onChange={(e) => setGeminiApiKey(e.target.value)}
									/>
									<Button
										variant="ghost"
										size="icon"
										className="absolute right-2 top-1/2 -translate-y-1/2"
										onClick={() => setShowApiKey(!showApiKey)}
									>
										{showApiKey ? (
											<EyeOffIcon className="w-4 h-4" />
										) : (
											<EyeIcon className="w-4 h-4" />
										)}
									</Button>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Label htmlFor="model">Model</Label>
									<HoverCard>
										<HoverCardTrigger>
											<InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
										</HoverCardTrigger>
										<HoverCardContent>
											<p>The Gemini model to use (e.g., 'gemini-pro'). Check Google AI Studio for available models.</p>
										</HoverCardContent>
									</HoverCard>
								</div>
								<Input
									id="model"
									placeholder="e.g., gemini-pro"
									value={geminiModel}
									onChange={(e) => setGeminiModel(e.target.value)}
									className="max-w-xs"
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Label htmlFor="prompt">System Prompt</Label>
									<HoverCard>
										<HoverCardTrigger>
											<InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
										</HoverCardTrigger>
										<HoverCardContent>
											<p>The system prompt that guides the AI's behavior. This helps shape how the AI responds to your queries.</p>
										</HoverCardContent>
									</HoverCard>
								</div>
								<Textarea
									id="prompt"
									placeholder="Enter your system prompt..."
									value={geminiPrompt}
									onChange={(e) => setGeminiPrompt(e.target.value)}
									className="min-h-[100px]"
								/>
							</div>
						</div>
					</section>

					{/* Reset Button */}
					<div className="pt-4 border-t">
						<Button
							variant="destructive"
							onClick={handleReset}
							className="gap-2"
						>
							<RotateCwIcon className="w-4 h-4" />
							<span>Reset All Settings</span>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

export { Settings };
