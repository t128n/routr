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
import { CogIcon, RotateCwIcon, InfoIcon, EyeIcon, EyeOffIcon, Code, Eye, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Settings() {
	const [showApiKey, setShowApiKey] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	
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
												<p>The Gemini model to use (e.g., 'gemini-pro'). Check Google AI Studio for available models.</p>
											</HoverCardContent>
										</HoverCard>
									</div>
									<Input
										id="model"
										placeholder="e.g., gemini-pro"
										value={geminiModel}
										onChange={(e) => setGeminiModel(e.target.value)}
									/>
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
						<Button
							variant="destructive"
							onClick={handleReset}
							className="gap-2"
						>
							<RotateCwIcon className="w-4 h-4" />
							<span>Reset All Settings</span>
						</Button>
						
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
