import { ThemeToggle } from "@/components/theme-toggle";
import { SplitIcon } from "lucide-react";

function AppHeader() {
	return (
		<header className="p-4 border-b border-dashed">
			<div className="flex items-center justify-between w-content mx-auto">
				<div className="flex items-center gap-2">
					<SplitIcon className="w-4 h-4" />
					<h1 className="text-xl font-semibold">routr</h1>
				</div>
				<div className="flex items-center">
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}

export { AppHeader };