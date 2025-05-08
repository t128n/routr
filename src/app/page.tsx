import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { useRef, useEffect } from "react";

export default function App() {
	const searchInputRef = useRef<HTMLInputElement>(null);

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

	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<div className="flex flex-col min-h-dvh w-vw selection:bg-pink-500 selection:text-pink-50">
				<AppHeader />
				<main className="flex-1 flex flex-col px-4 justify-center">
					<section className="flex flex-col w-content mx-auto gap-8" aria-label="Main content">
						<header className="flex flex-col gap-2">
							<h1 className="font-bold text-4xl">routr.</h1>
							<p className="text-lg text-neutral-600 max-w-prose">
								A minimal search engine router. Fast. Configurable. Open source.
							</p>
						</header>
						<form
							action={`${import.meta.env.BASE_URL}`}
							className="flex focus-within:shadow-sm shadow-primary rounded-lg"
							aria-label="Search form"
						>
							<label htmlFor="search-input" className="sr-only">
								Search query
							</label>
							<Input
								autoFocus
								type="search"
								ref={searchInputRef}
								id="search-input"
								name="q"
								placeholder="Search... (Press '/' to focus)"
								className="rounded-r-none h-14 text-lg focus-visible:ring-0"
								aria-label="Search query"
							/>
							<Button
								className="rounded-l-none h-14"
								type="submit"
								size="icon"
								aria-label="Submit search"
							>
								<SearchIcon className="w-5 h-5" aria-hidden="true" />
							</Button>
						</form>
						<p className="text-sm text-neutral-500">
							Give routr a try. Configure your default search provider and more settings with the gear icon above.
						</p>
						<section className="opacity-70 hover:opacity-100 transition-opacity duration-200" aria-label="Set as default search engine">
							<p className="text-sm mb-1">
								Set routr as your browser's default search engine:
							</p>
							<Input
								value={`${window.location.origin}${window.location.pathname}?q=%s`}
								className="border-dashed cursor-pointer"
								readOnly
								onClick={e => {
									(e.target as HTMLInputElement).select();
									navigator.clipboard.writeText((e.target as HTMLInputElement).value);
									toast.info("Search URL copied to clipboard");
								}}
								aria-label="Default search engine URL"
							/>
							<p className="text-xs text-neutral-400 mt-1">
								Copy the above URL and add it as a custom search engine in your browser settings. <span className="hidden md:inline">(Most browsers: Settings → Search → Manage Search Engines)</span>
							</p>
						</section>
						<section className="mt-6" aria-label="How it works">
							<h2 className="font-semibold text-lg mb-2">How it works</h2>
							<ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
								<li>Type your query and hit <kbd>Enter</kbd> to search.</li>
								<li>routr routes your query to your configured search provider.</li>
								<li>Configure providers and settings via the gear icon above.</li>
								<li>Open source, privacy-respecting, and minimal by design.</li>
							</ul>
						</section>
					</section>
				</main>
				<AppFooter />
			</div>
			<Toaster />
		</ThemeProvider>
	);
}
