import { SplitIcon } from "lucide-react";

export function AppHeader() {
	return (
		<header className="w-full py-6 border-b border-dashed border-neutral-300 flex justify-center">
			<div className="max-w-[120ch] w-full px-4">
				<div className="flex items-center gap-2 ">
					<SplitIcon className="w-4 h-4" />
					<h1 className="text-lg font-medium">routr</h1>
				</div>
			</div>
		</header>
	);
}
