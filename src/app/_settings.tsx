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
import { CogIcon, RotateCwIcon, InfoIcon, EyeIcon, EyeOffIcon, Code, Eye, FileText, ChevronDown, ChevronUp, SaveIcon, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
	Command, 
	CommandEmpty, 
	CommandGroup, 
	CommandInput, 
	CommandItem,
	CommandList 
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { store } from "@/sw/store";
import { testConnection } from "@/sw/ai";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the available Gemini models
const geminiModels = [
	{
		value: "gemini-1.5-flash",
		label: "Gemini 1.5 Flash (FREE)",
		description: "Fast and versatile performance across diverse tasks with 1M token context"
	},
	{
		value: "gemini-1.5-pro",
		label: "Gemini 1.5 Pro",
		description: "Complex reasoning tasks requiring more intelligence with 2M token context"
	},
	{
		value: "gemini-1.5-flash-8b",
		label: "Gemini 1.5 Flash-8B (FREE)",
		description: "High volume and lower intelligence tasks with 1M token context"
	},
	{
		value: "gemini-2.0-flash",
		label: "Gemini 2.0 Flash (FREE)",
		description: "Next generation features, speed, thinking, and realtime streaming"
	},
	{
		value: "gemini-2.0-flash-lite",
		label: "Gemini 2.0 Flash-Lite (FREE)",
		description: "Cost efficiency and low latency with 1M token context"
	},
	{
		value: "gemini-2.5-flash-preview-04-17",
		label: "Gemini 2.5 Flash Preview",
		description: "Adaptive thinking and cost efficiency with 1M token context"
	},
	{
		value: "gemini-2.5-pro-preview-05-06",
		label: "Gemini 2.5 Pro Preview",
		description: "Enhanced thinking, reasoning, multimodal understanding, advanced coding"
	},
	{
		value: "gemini-2.0-flash-preview-image-generation",
		label: "Gemini 2.0 Flash Image Generation",
		description: "Conversational image generation and editing capabilities"
	},
	{
		value: "text-embedding-004",
		label: "Text Embedding 004 (FREE)",
		description: "Advanced text embedding model for measuring relatedness of text strings"
	}
];

function Settings() {
	const [showApiKey, setShowApiKey] = useState(false);
	const [open, setOpen] = useState(false);
	const [selectedModel, setSelectedModel] = useState("");
	const [customModelName, setCustomModelName] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [isTestingConnection, setIsTestingConnection] = useState(false);
	const [connectionTestResult, setConnectionTestResult] = useState<{ success: boolean; message: string } | null>(null);
	
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

	// Set the initial value for the selected model if geminiModel exists
	useEffect(() => {
		if (geminiModel) {
			const foundModel = geminiModels.find(model => model.value === geminiModel);
			if (foundModel) {
				setSelectedModel(geminiModel);
			} else {
				setCustomModelName(geminiModel);
			}
		}
	}, [geminiModel]);

	// Handler for model change
	const handleModelChange = (value: string) => {
		setSelectedModel(value);
		setGeminiModel(value);
	};

	// Handler for custom model input
	const handleCustomModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setCustomModelName(value);
		setGeminiModel(value);
	};

	// Test API connection with current key and model
	const handleTestConnection = async () => {
		// Reset previous test result
		setConnectionTestResult(null);
		setIsTestingConnection(true);
		
		const modelToTest = geminiModel || (selectedModel || "gemini-2.0-flash");
		
		try {
			const result = await testConnection(geminiApiKey, modelToTest);
			
			// Ensure message is always defined
			const message = result.message || "No error message provided";
			setConnectionTestResult({
				success: result.success,
				message: message
			});
			
			if (result.success) {
				toast.success("API connection test successful");
			} else {
				toast.error(`API connection test failed: ${message}`);
			}
		} catch (error) {
			setConnectionTestResult({ 
				success: false, 
				message: error instanceof Error ? error.message : "Unknown error occurred" 
			});
			toast.error("API connection test failed");
		} finally {
			setIsTestingConnection(false);
		}
	};

	function handleReset() {
		resetRouteIndicator();
		resetDefaultRoute();
		resetGeminiApiKey();
		resetGeminiPrompt();
		resetGeminiModel();
		setSelectedModel("");
		setCustomModelName("");
		setConnectionTestResult(null);
	}

	function handleSave() {
		setIsSaving(true);
		
		// Actual saving to IndexedDB
		Promise.all([
			store.set("general.routeIndicator", routeIndicator),
			store.set("general.defaultRoute", defaultRoute),
			store.set("ai.gemini.apiKey", geminiApiKey),
			store.set("ai.gemini.prompt", geminiPrompt),
			store.set("ai.gemini.model", geminiModel),
		])
			.then(() => {
				setIsSaving(false);
				toast.success("Settings saved successfully");
			})
			.catch((err) => {
				console.error("Error saving settings:", err);
				setIsSaving(false);
				toast.error("Error saving settings");
			});
	}

	return (
		<Sheet>
			<SheetTrigger>
				<Button variant="outline" size="icon" title="Settings (⌘,)" className="relative">
					<CogIcon className="w-4 h-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl overflow-y-auto p-0">
				<SheetHeader className="sticky top-0 bg-background z-10 p-4 sm:p-6 border-b">
					<SheetTitle className="text-xl sm:text-2xl flex items-center gap-2">
						<CogIcon className="w-5 h-5" />
						Settings
					</SheetTitle>
					<SheetDescription>
						Configure routr to your liking. Press ⌘, to open settings anytime.
					</SheetDescription>
				</SheetHeader>
				<div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-6">
					{/* General Settings */}
					<section className="space-y-4 sm:space-y-6 p-4 rounded-lg border bg-card/50 shadow-sm">
						<div>
							<h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
								<FileText className="w-4 h-4" />
								General Settings
							</h2>
							<p className="text-sm text-muted-foreground mb-4">
								Configure how routr behaves and appears.
							</p>
						</div>
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Label htmlFor="route-indicator" className="text-sm font-medium">Route Indicator</Label>
									<HoverCard>
										<HoverCardTrigger>
											<InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
										</HoverCardTrigger>
										<HoverCardContent className="w-80">
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
									<Label htmlFor="default-route" className="text-sm font-medium">Default Search Provider</Label>
									<HoverCard>
										<HoverCardTrigger>
											<InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
										</HoverCardTrigger>
										<HoverCardContent className="w-80">
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
					<section className="space-y-4 sm:space-y-6 p-4 rounded-lg border bg-card/50 shadow-sm">
						<div>
							<h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
								<Code className="w-4 h-4" />
								AI Integration
							</h2>
							<p className="text-sm text-muted-foreground mb-4">
								Configure Gemini AI integration settings.
							</p>
						</div>
						<div className="space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Label htmlFor="api-key" className="text-sm font-medium">API Key</Label>
										<HoverCard>
											<HoverCardTrigger>
												<InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
											</HoverCardTrigger>
											<HoverCardContent className="w-80">
												<p>Your Gemini API key for AI integration. Get one from the Google AI Studio.</p>
												<p className="mt-2 text-xs text-muted-foreground">
													Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a> to create a free API key.
												</p>
											</HoverCardContent>
										</HoverCard>
									</div>
									<div className="relative">
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
									<div className="flex items-center justify-between mt-2">
										<Button 
											size="sm" 
											variant="outline" 
											className="text-xs gap-1 h-8"
											onClick={handleTestConnection}
											disabled={isTestingConnection || !geminiApiKey.trim()}
										>
											{isTestingConnection ? (
												<>
													<div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
													<span>Testing...</span>
												</>
											) : (
												<>
													{connectionTestResult ? (
														connectionTestResult.success ? (
															<CheckCircle2 className="w-3 h-3 text-green-500" />
														) : (
															<XCircle className="w-3 h-3 text-red-500" />
														)
													) : (
														<AlertCircle className="w-3 h-3" />
													)}
													<span>Test Connection</span>
												</>
											)}
										</Button>
										
										{connectionTestResult && (
											<Badge 
												variant={connectionTestResult.success ? "success" : "destructive"}
												className="ml-2 text-xs py-0 px-2 h-6"
											>
												{connectionTestResult.success ? "Connected" : "Failed"}
											</Badge>
										)}
									</div>
									
									{connectionTestResult && !connectionTestResult.success && (
										<Alert variant="destructive" className="mt-2 text-xs p-3">
											<AlertCircle className="h-4 w-4" />
											<AlertTitle>Connection Error</AlertTitle>
											<AlertDescription>
												{connectionTestResult.message}
											</AlertDescription>
										</Alert>
									)}
									
									{connectionTestResult && connectionTestResult.success && (
										<Alert variant="success" className="mt-2 text-xs p-3">
											<CheckCircle2 className="h-4 w-4" />
											<AlertTitle>Connected Successfully</AlertTitle>
											<AlertDescription>
												Your API key and model are working correctly.
											</AlertDescription>
										</Alert>
									)}
								</div>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Label htmlFor="model" className="text-sm font-medium">Model</Label>
										<HoverCard>
											<HoverCardTrigger>
												<InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
											</HoverCardTrigger>
											<HoverCardContent className="w-80">
												<p>The Gemini model to use. Select from available models or enter a custom model name.</p>
												<p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">Models marked with (FREE) don't require a paid account and can be used with a free API key.</p>
											</HoverCardContent>
										</HoverCard>
									</div>
									<div className="flex flex-col gap-1.5">
										<Popover open={open} onOpenChange={setOpen}>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={open}
													className="justify-between w-full text-left font-normal"
												>
													{selectedModel ? geminiModels.find(model => model.value === selectedModel)?.label : customModelName || "Select model..."}
													{open ? <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" /> : <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="p-0 w-full" align="start">
												<Command>
													<CommandInput placeholder="Search model..." />
													<CommandList>
														<CommandEmpty>No model found.</CommandEmpty>
														<CommandGroup heading="Gemini Models">
															{geminiModels.map((model) => (
																<CommandItem
																	key={model.value}
																	value={model.value}
																	onSelect={() => {
																		handleModelChange(model.value);
																		setCustomModelName("");
																		setOpen(false);
																	}}
																	className="flex flex-col items-start py-2"
																>
																	<div className="font-medium">{model.label}</div>
																	<div className="text-xs text-muted-foreground">{model.description}</div>
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<div className="relative">
											<Label htmlFor="custom-model" className="text-xs text-muted-foreground mb-1 block">
												Or enter custom model name:
											</Label>
											<Input
												id="custom-model"
												placeholder="e.g., gemini-custom-model"
												value={customModelName}
												onChange={handleCustomModelChange}
												className="text-sm"
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Label htmlFor="prompt" className="text-sm font-medium">System Prompt</Label>
									<HoverCard>
										<HoverCardTrigger>
											<InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
										</HoverCardTrigger>
										<HoverCardContent className="w-80">
											<p>The system prompt that guides the AI's behavior. This helps shape how the AI responds to your queries.</p>
										</HoverCardContent>
									</HoverCard>
								</div>
								<Textarea
									id="prompt"
									placeholder="Enter your system prompt..."
									value={geminiPrompt}
									onChange={(e) => setGeminiPrompt(e.target.value)}
									className="min-h-[400px] w-full font-mono text-sm"
								/>
							</div>
						</div>
					</section>

					{/* AI Testing Guide */}
					<section className="space-y-3 sm:space-y-4 p-3 rounded-md border bg-card/50 shadow-sm">
						<div>
							<h2 className="text-base font-semibold mb-1 flex items-center gap-1.5 tracking-tight">
								<AlertCircle className="w-4 h-4 text-pink-600 dark:text-pink-400" />
								<span className="uppercase tracking-widest text-xs text-pink-600 dark:text-pink-400 font-bold">AI Integration Test</span>
							</h2>
							<p className="text-xs text-muted-foreground mb-2">
								Quick steps to verify Gemini AI search enhancement.
							</p>
						</div>
						<div className="space-y-3">
							<div className="grid gap-1.5">
								{/* Step 1 */}
								<div className="rounded p-1.5 flex items-start gap-2 bg-transparent">
									<span className="w-5 h-5 flex items-center justify-center rounded bg-pink-100 dark:bg-pink-900 text-xs font-mono font-semibold text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900/60 select-none">1</span>
									<div>
										<div className="font-mono text-xs font-semibold mb-0.5">Set Up API Key</div>
										<p className="text-xs text-black dark:text-white leading-tight">
											Enter your Gemini API key above and click <span className="font-mono text-pink-600 dark:text-pink-400">Test Connection</span>.
										</p>
									</div>
								</div>
								{/* Step 2 */}
								<div className="rounded p-1.5 flex items-start gap-2 bg-transparent">
									<span className="w-5 h-5 flex items-center justify-center rounded bg-pink-100 dark:bg-pink-900 text-xs font-mono font-semibold text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900/60 select-none">2</span>
									<div>
										<div className="font-mono text-xs font-semibold mb-0.5">Use Double Route Syntax</div>
										<p className="text-xs text-black dark:text-white leading-tight">
											Prefix your search with double route indicator and route tag:<br />
											<code className="px-1 py-0.5 rounded bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-900/40 text-xs font-mono text-pink-700 dark:text-pink-300 mt-1 inline-block">
												{routeIndicator}{routeIndicator}g your search query
											</code>
										</p>
									</div>
								</div>
								{/* Step 3 */}
								<div className="rounded p-1.5 flex items-start gap-2 bg-transparent">
									<span className="w-5 h-5 flex items-center justify-center rounded bg-pink-100 dark:bg-pink-900 text-xs font-mono font-semibold text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900/60 select-none">3</span>
									<div>
										<div className="font-mono text-xs font-semibold mb-0.5">Try Examples</div>
										<ul className="list-none pl-0 space-y-1">
											<li>
												<code className="px-1 py-0.5 rounded bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-900/40 text-xs font-mono text-pink-700 dark:text-pink-300">
													{routeIndicator}{routeIndicator}g best resources for learning python programming
												</code>
											</li>
											<li>
												<code className="px-1 py-0.5 rounded bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-900/40 text-xs font-mono text-pink-700 dark:text-pink-300">
													{routeIndicator}{routeIndicator}g research papers on climate change published last year
												</code>
											</li>
											<li>
												<code className="px-1 py-0.5 rounded bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-900/40 text-xs font-mono text-pink-700 dark:text-pink-300">
													{routeIndicator}{routeIndicator}y how to make sourdough bread step by step
												</code>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Reset Button */}
					<div className="pt-4 border-t flex justify-between items-center">
						<div className="flex gap-3">
							<Button
								variant="destructive"
								onClick={handleReset}
								className="gap-2"
							>
								<RotateCwIcon className="w-4 h-4" />
								<span>Reset All Settings</span>
							</Button>
							
							<Button
								variant="default"
								onClick={handleSave}
								className="gap-2"
								disabled={isSaving}
							>
								{isSaving ? (
									<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
								) : (
									<SaveIcon className="w-4 h-4" />
								)}
								<span>Save</span>
							</Button>
						</div>
						
						<p className="text-xs text-muted-foreground">
							routr version 0.1.4
						</p>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default Settings;
