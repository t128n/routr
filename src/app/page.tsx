import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, InfoIcon, CopyIcon, ArrowRightIcon, Sparkles, AlertCircle } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { useRef, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { store } from "@/sw/store";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function App() {
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
	const [routeIndicator, setRouteIndicator] = useState('!');
	const [searchPlaceholder, setSearchPlaceholder] = useState("Search... (Press '/' to focus)");
	const searchSuggestions = [
		"best digital photography courses online",
		"healthy meal prep ideas for busy professionals",
		"most efficient workout routines for beginners",
		"top rated science fiction books 2025",
		"how to improve productivity working from home"
	];
	
	// On mount, check if AI is enabled
	useEffect(() => {
		const checkAiStatus = async () => {
			try {
				const apiKey = await store.get("ai.gemini.apiKey");
				const indicator = await store.get("general.routeIndicator");
				setRouteIndicator(indicator || '!');
				setAiEnabled(Boolean(apiKey && apiKey.trim().length > 0));
			} catch (error) {
				console.error("Error checking AI status:", error);
				setAiEnabled(false);
			}
		};
		
		checkAiStatus();
	}, []);
	
	// Update placeholder based on AI status
	useEffect(() => {
		if (aiEnabled === true) {
			setSearchPlaceholder(`Try "${routeIndicator}${routeIndicator}g how to learn piano" for AI-enhanced search`);
		} else if (aiEnabled === false) {
			setSearchPlaceholder("Search... (Press '/' to focus)");
		}
	}, [aiEnabled, routeIndicator]);

	// Keyboard shortcut: '/' focuses the search input
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "/" && document.activeElement !== searchInputRef.current) {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, []);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSearching(true);
		
		if (searchValue.trim()) {
			// Redirect to the current page with the search query as a parameter
			const searchQuery = encodeURIComponent(searchValue.trim());
			window.location.href = `${window.location.origin}${window.location.pathname}?q=${searchQuery}`;
		} else {
			setIsSearching(false);
			toast.error("Please enter a search query");
		}
	};
	
	const applySuggestion = (suggestion: string) => {
		if (searchInputRef.current) {
			searchInputRef.current.value = aiEnabled 
				? `${routeIndicator}${routeIndicator}g ${suggestion}` 
				: suggestion;
			searchInputRef.current.focus();
		}
	};

	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<div className="flex flex-col min-h-dvh w-vw selection:bg-pink-500 selection:text-pink-50 bg-gradient-to-b from-background to-background/95">
				<AppHeader />
				<main className="flex-1 flex flex-col px-4 py-8 md:py-12 justify-center">
					<section className="flex flex-col w-content mx-auto gap-12 max-w-3xl" aria-label="Main content">
						<header className="flex flex-col gap-4 text-center">
							<div className="flex items-center justify-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
									<SearchIcon className="w-5 h-5 text-primary" />
								</div>
								<h1 className="font-bold text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
									routr.
								</h1>
							</div>
							<p className="text-xl text-neutral-600 max-w-prose mx-auto">
								A minimal search engine router. Fast. Configurable. Open source.
							</p>
						</header>

						<form
							onSubmit={handleSearch}
							className="flex flex-col gap-4"
							aria-label="Search form"
						>
							<div className="flex focus-within:ring-2 ring-primary/20 rounded-lg transition-all duration-200">
								<div className="relative flex-1">
									<label htmlFor="search-input" className="sr-only">
										Search query
									</label>
									<Input
										autoFocus
										type="search"
										ref={searchInputRef}
										id="search-input"
										name="q"
										placeholder={searchPlaceholder}
										className="rounded-r-none h-14 text-lg focus-visible:ring-0 border-r-0 pr-10"
										aria-label="Search query"
										value={searchValue}
										onChange={(e) => setSearchValue(e.target.value)}
									/>
									{aiEnabled !== null && (
										<div className="absolute right-3 top-1/2 -translate-y-1/2">
											<HoverCard>
												<HoverCardTrigger asChild>
													<div className="cursor-help">
														{aiEnabled ? (
															<Sparkles className="h-5 w-5 text-purple-500" />
														) : (
															<AlertCircle className="h-5 w-5 text-neutral-300" />
														)}
													</div>
												</HoverCardTrigger>
												<HoverCardContent className="w-80">
													{aiEnabled ? (
														<div className="flex items-start gap-2">
															<Sparkles className="h-4 w-4 text-purple-500 mt-0.5" />
															<div>
																<p className="font-medium">AI-Enhanced Search Available</p>
																<p className="text-sm text-muted-foreground mt-1">
																	Use <code className="bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.5 rounded text-xs font-mono">{routeIndicator}{routeIndicator}g your query</code> for AI-enhanced search
																</p>
															</div>
														</div>
													) : (
														<div className="flex items-start gap-2">
															<AlertCircle className="h-4 w-4 text-neutral-500 mt-0.5" />
															<div>
																<p className="font-medium">AI Enhancement Not Available</p>
																<p className="text-sm text-muted-foreground mt-1">
																	Set up a Gemini API key in settings to enable AI-enhanced search
																</p>
															</div>
														</div>
													)}
												</HoverCardContent>
											</HoverCard>
										</div>
									)}
								</div>
								<Button
									className="rounded-l-none h-14 px-6 bg-primary hover:bg-primary/90 transition-colors"
									type="submit"
									disabled={isSearching}
									aria-label="Submit search"
								>
									{isSearching ? (
										<div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
									) : (
										<SearchIcon className="w-5 h-5" aria-hidden="true" />
									)}
								</Button>
							</div>
							
							{/* AI-powered search suggestions */}
							<div className="flex flex-wrap gap-2 justify-center mt-1">
								{searchSuggestions.slice(0, 3).map((suggestion, index) => (
									<button
										key={index}
										type="button"
										onClick={() => applySuggestion(suggestion)}
										className="flex items-center gap-1 text-xs py-1 px-3 rounded-full bg-background border border-neutral-200 hover:border-neutral-300 transition-colors"
									>
										{aiEnabled && (
											<Sparkles className="w-3 h-3 text-purple-500" />
										)}
										<span className="truncate max-w-40">{suggestion}</span>
									</button>
								))}
							</div>
							
							<p className="text-sm text-neutral-500 text-center">
								Give routr a try. Configure your default search provider and more settings with the gear icon above.
							</p>
						</form>

						<div className="grid gap-8 md:grid-cols-2">
							<section className="p-6 rounded-lg bg-card border shadow-sm hover:shadow-md transition-shadow" aria-label="Set as default search engine">
								<h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
									<InfoIcon className="w-5 h-5 text-primary" />
									Set as Default
								</h2>
								<p className="text-sm mb-3">
									Set routr as your browser's default search engine:
								</p>
								<div className="flex gap-2">
									<Input
										value={`${window.location.origin}${window.location.pathname}?q=%s`}
										className="border-dashed"
										readOnly
										aria-label="Default search engine URL"
									/>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="outline"
													size="icon"
													onClick={e => {
														const input = e.currentTarget.previousElementSibling as HTMLInputElement;
														input.select();
														navigator.clipboard.writeText(input.value);
														toast.success("Search URL copied to clipboard!");
													}}
												>
													<CopyIcon className="w-4 h-4" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Copy search URL</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								<p className="text-xs text-neutral-400 mt-2">
									Add this URL as a custom search engine in your browser settings.
									<span className="hidden md:inline"> (Settings → Search → Manage Search Engines)</span>
								</p>
							</section>

							<section className="p-6 rounded-lg bg-card border shadow-sm hover:shadow-md transition-shadow" aria-label="How it works">
								<h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
									<ArrowRightIcon className="w-5 h-5 text-primary" />
									How it Works
								</h2>
								<ul className="space-y-3 text-sm text-neutral-600">
									<li className="flex items-start gap-2">
										<span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">1</span>
										Type your query and hit <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">Enter</kbd> to search
									</li>
									<li className="flex items-start gap-2">
										<span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">2</span>
										routr routes your query to your configured search provider
									</li>
									<li className="flex items-start gap-2">
										<span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">3</span>
										{aiEnabled ? (
											<>Use <span className="inline-flex items-center gap-1">
												<Sparkles className="w-3 h-3 text-purple-500" />
												<code className="bg-neutral-100 px-1 py-0.5 rounded text-xs">{routeIndicator}{routeIndicator}g query</code>
											</span> for AI-enhanced search</>
										) : (
											<>Configure providers and settings via the gear icon above</>
										)}
									</li>
									<li className="flex items-start gap-2">
										<span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">4</span>
										Open source, privacy-respecting, and minimal by design
									</li>
								</ul>
							</section>
						</div>
					</section>
				</main>
				<AppFooter />
			</div>
			<Toaster position="bottom-center" />
		</ThemeProvider>
	);
}
