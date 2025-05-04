import { Button } from "@/components/ui/button";
import { GitCommitVerticalIcon } from "lucide-react";

function AppFooter() {
	return (
		<footer className="p-4 border-t border-dashed">
			<div className="flex items-center justify-between w-content mx-auto">
				<div className="flex items-center">
					<p className="text-sm flex items-center gap-1">
						<a
							href="https://t128n.github.io/"
							className="flex items-center gap-2"
						>
							<img
								src="https://t128n.github.io/favicon.svg"
								alt="t128n"
								className="w-6 h-6 rounded-full"
							/>
							<span>&copy; 2025 Torben Haack</span>
							<span>&lt;t128n@ipv4.8shield.net&gt;</span>
						</a>
					</p>
				</div>
				<a
					href="https://github.com/t128n/routr"
					target="_blank"
					rel="noreferrer"
					className="flex items-center gap-2 text-sm opacity-25"
				>
					<GitCommitVerticalIcon className="w-4 h-4" />
					<span>Link to GitHub Repository</span>
				</a>
				<div className="flex items-center">
					<p className="text-sm flex items-center gap-1">
						<span>v{import.meta.env.PACKAGE_VERSION}</span>
						<span>&lt;{import.meta.env.BUILD_TIME}&gt;</span>
					</p>
				</div>
			</div>
		</footer>
	);
}

export { AppFooter };