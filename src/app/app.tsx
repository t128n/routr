import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function App() {
	const { install, uninstall, status } = useServiceWorker({
		swPath: "./sw.js",
		options: {
			type: "module",
		},
	});
	const [url, setUrl] = useState<string>(`${window.location.href}?q=%s`);
	const [geminiApikey, setGeminiApikey] = useState<string>("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: Also depending on url would cause infinite loop
	useEffect(() => {
		if (geminiApikey.length > 0) {
			const urlObj = new URL(url);
			urlObj.searchParams.set("api", btoa(geminiApikey));
			setUrl(urlObj.toString());
		}
	}, [geminiApikey]);

	const hasQueryParameter = new URLSearchParams(window.location.search).has(
		"api",
	);

	return (
		<div className="bg-neutral-50 min-h-dvh w-dvw flex flex-col items-center">
			<AppHeader />
			<main className="flex-1 flex justify-center w-full py-8">
				{hasQueryParameter && (
					<div className="absolute top-0 left-0 w-full h-full bg-neutral-900/50 flex items-center justify-center">
						<div className="bg-white p-6 rounded-lg shadow-lg">
							<p className="text-red-700">
								Either you have not installed the app or an error occurred while
								processing your request. Please try again.
							</p>
						</div>
					</div>
				)}
				<div className="max-w-[120ch] w-full px-4 flex flex-col gap-8">
					<div className="border border-dashed border-neutral-300 rounded-lg p-6 bg-white">
						<h2 className="text-xl mb-6">General</h2>

						<div className="flex flex-col gap-8">
							<div className="flex items-center gap-4">
								<div className="flex-1">
									<p className="text-neutral-700">
										{status === "installed"
											? "routr is currently running."
											: status === "idle"
												? "routr is not installed yet."
												: status === "unsupported"
													? "routr is not supported in this browser."
													: `routr is ${status}.`}
									</p>
								</div>

								<Button
									type="button"
									onClick={() => {
										if (status === "installed") {
											toast("routr is being uninstalled...");
											uninstall();
											toast("routr is now uninstalled!");
										} else {
											toast("routr is being installed...");
											install();
											toast("routr is now installed!");
										}
									}}
									variant={status === "installed" ? "destructive" : "default"}
								>
									{status === "installed" ? "Uninstall" : "Install"}
								</Button>
							</div>

							<div
								className={cn("items-center gap-4", {
									flex: status === "installed",
									hidden: status !== "installed",
								})}
							>
								<div className="flex-1 flex flex-col gap-4">
									<p className="text-neutral-700">
										Now where routr is installed, you can use it as a search
										engine in your browser. To do this, you need to add a search
										engine in your browser settings. You can use the following
										URL as a search engine:
									</p>
									<Input
										type="text"
										className="w-full"
										value={`${url}`}
										readOnly
										onClick={(event) => {
											(event.target as HTMLInputElement).select();
											navigator.clipboard.writeText(`${url}`);
											toast("URL copied to clipboard!");
										}}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="border border-dashed border-neutral-300 rounded-lg p-6 bg-white">
						<h2 className="text-xl mb-6">AI Integration (Experimental)</h2>

						<p className="text-neutral-700">
							routr can optimize your search queries using AI. This feature
							required a{" "}
							<a
								href="https://aistudio.google.com/"
								target="_blank"
								rel="noreferrer"
							>
								Google AI Studio
							</a>
							Key. You can get your key by signing up for a free account on the
							Google AI Studio website. Once you have your key, you can enter it
							in the input field below. This will allow routr to use AI to
							optimize your search queries and provide you with better results.
						</p>
						<div className="flex flex-col gap-4">
							<Input
								type="password"
								className="w-full mt-4"
								placeholder="Enter your Google AI Studio key here..."
								value={geminiApikey}
								onChange={(event) => setGeminiApikey(event.target.value)}
							/>
							<Label>
								Note: They key will only leave your browser to make requests to
								the Google Gemini API Endpoint.
							</Label>
						</div>
					</div>
				</div>
			</main>

			<AppFooter />

			<Toaster />
		</div>
	);
}

export { App };
