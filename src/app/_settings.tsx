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
import { CogIcon, RotateCwIcon, InfoIcon, EyeIcon, EyeOffIcon, Code, Eye, FileText, ChevronDown, ChevronUp, SaveIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

// Definiere die verfügbaren Gemini-Modelle
const geminiModels = [
	{
		value: "gemini-2.5-pro-preview-05-06",
		label: "Gemini 2.5 Pro Preview (05-06)",
		description: "Enhanced thinking and reasoning, multimodal understanding, advanced coding"
	},
	{
		value: "gemini-2.5-flash-preview-04-17",
		label: "Gemini 2.5 Flash Preview (04-17)",
		description: "Adaptive thinking, cost efficiency"
	},
	{
		value: "gemini-2.0-flash",
		label: "Gemini 2.0 Flash",
		description: "Next generation features, speed, thinking, and realtime streaming"
	},
	{
		value: "gemini-2.0-flash-preview-image-generation",
		label: "Gemini 2.0 Flash Image Generation",
		description: "Conversational image generation and editing"
	},
	{
		value: "gemini-2.0-flash-lite",
		label: "Gemini 2.0 Flash-Lite",
		description: "Cost efficiency and low latency"
	},
	{
		value: "gemini-1.5-flash",
		label: "Gemini 1.5 Flash",
		description: "Fast and versatile performance across diverse tasks"
	},
	{
		value: "gemini-1.5-pro",
		label: "Gemini 1.5 Pro",
		description: "Complex reasoning tasks requiring more intelligence"
	},
	{
		value: "gemini-1.5-flash-8b",
		label: "Gemini 1.5 Flash-8B",
		description: "High volume and lower intelligence tasks"
	},
];

function Settings() {
	const [showApiKey, setShowApiKey] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [open, setOpen] = useState(false);
	const [selectedModel, setSelectedModel] = useState("");
	const [customModelName, setCustomModelName] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	
	// Detect if screen is mobile size
	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		
		checkIfMobile();
		window.addEventListener('resize', checkIfMobile);
		
		return () => {
			window.removeEventListener('resize', checkIfMobile);
		};
	}, []);
	
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

	// Setze den initialen Wert für das ausgewählte Modell, wenn geminiModel existiert
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

	// Handler für die Modell-Änderung
	const handleModelChange = (value: string) => {
		setSelectedModel(value);
		setGeminiModel(value);
	};

	// Handler für benutzerdefinierte Modell-Eingabe
	const handleCustomModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setCustomModelName(value);
		setGeminiModel(value);
	};

	function handleReset() {
		resetRouteIndicator();
		resetDefaultRoute();
		resetGeminiApiKey();
		resetGeminiPrompt();
		resetGeminiModel();
		setSelectedModel("");
		setCustomModelName("");
	}

	function handleSave() {
		setIsSaving(true);
		
		// Simuliere eine Speicheroperation
		setTimeout(() => {
			setIsSaving(false);
			toast.success("Settings saved successfully");
		}, 600);
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
											<p>The system prompt supports Markdown formatting for better readability and structure.</p>
										</HoverCardContent>
									</HoverCard>
								</div>
								<Tabs defaultValue="markdown" className="w-full">
									<TabsList className="mb-4 w-full justify-start">
										<TabsTrigger value="markdown" className="flex items-center gap-1 px-4 py-2">
											<Eye className="w-4 h-4" />
											<span>Markdown Editor</span>
										</TabsTrigger>
										<TabsTrigger value="raw" className="flex items-center gap-1 px-4 py-2">
											<Code className="w-4 h-4" />
											<span>Raw Prompt</span>
										</TabsTrigger>
									</TabsList>
									<TabsContent value="markdown" className="mt-0">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<div className="flex justify-between items-center">
													<Label htmlFor="prompt-editor" className="text-sm font-medium">Editor</Label>
												</div>
												<Textarea
													id="prompt-editor"
													placeholder="Enter your system prompt with Markdown formatting..."
													value={geminiPrompt}
													onChange={(e) => setGeminiPrompt(e.target.value)}
													className={`min-h-[${isMobile ? '200px' : '400px'}] font-mono text-sm`}
												/>
											</div>
											<div className="space-y-2">
												<Label className="text-sm font-medium">Preview</Label>
												<div className={`border rounded-md p-4 min-h-[${isMobile ? '200px' : '400px'}] overflow-auto prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-zinc-900`}>
													{geminiPrompt ? (
														<ReactMarkdown remarkPlugins={[remarkGfm]}>
															{geminiPrompt}
														</ReactMarkdown>
													) : (
														<p className="text-muted-foreground italic">No preview available. Please enter a system prompt.</p>
													)}
												</div>
											</div>
										</div>
									</TabsContent>
									<TabsContent value="raw" className="mt-0">
										<Textarea
											id="prompt-raw"
											placeholder="Enter your system prompt..."
											value={geminiPrompt}
											onChange={(e) => setGeminiPrompt(e.target.value)}
											className={`min-h-[${isMobile ? '400px' : '600px'}] w-full font-mono text-sm`}
										/>
									</TabsContent>
								</Tabs>
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

export { Settings };
