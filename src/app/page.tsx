import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";

export default function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<div className="flex flex-col min-h-dvh w-vw selection:bg-pink-500 selection:text-pink-50">
				<AppHeader />
				<main className="flex-1 flex flex-col px-4 justify-center">
					<div className="flex flex-col w-content mx-auto gap-8">
						<div className="flex flex-col gap-2">
							<h2 className="font-bold text-4xl">routr.</h2>
							<form
								action={`${import.meta.env.BASE_URL}`}
								className="flex focus-within:shadow-sm shadow-primary rounded-lg"
							>
								<Input
									autoFocus
									name="q"
									placeholder="Search..."
									className="rounded-r-none h-12 focus-visible:ring-0"
								/>
								<Button
									className="rounded-l-none h-12"
									type="submit"
									size="icon"
								>
									<SearchIcon className="w-4 h-4" />
								</Button>
							</form>
							<p className="text-sm text-neutral-500">
								Give routr a try and search what you like. You can configure
								your default search provider as well as more settings with the
								gear icon on top of the page.
							</p>
						</div>
						<div className="opacity-50 hover:opacity-100 transition-opacity duration-200">
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
				</main>
				<AppFooter />
			</div>
			<Toaster />
		</ThemeProvider>
	);
}
