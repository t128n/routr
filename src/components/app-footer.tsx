import { ThemeToggle } from "@/components/theme-toggle";

export function AppFooter() {
	return (
		<footer className="w-full py-4 border-t border-dashed border-neutral-300 dark:border-neutral-600 flex justify-center">
			<div className="max-w-[120ch] w-full px-4">
				<div className="flex justify-between">
					<p className="text-neutral-500 text-sm">
						routr &middot; search engine router
					</p>
					<ThemeToggle />
				</div>
			</div>
		</footer>
	);
}
