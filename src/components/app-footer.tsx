import { GithubIcon, BookOpenIcon } from "lucide-react";

function AppFooter() {
	return (
		<footer className="p-6 border-t border-dashed bg-gradient-to-b from-background to-background/50">
			<div className="flex flex-col md:flex-row items-center justify-between w-content mx-auto gap-4">
				{/* Left section: Copyright and Contact */}
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<a
						href="https://t128n.github.io/"
						className="hover:text-foreground transition-colors"
					>
						<span>&copy; 2025 Torben Haack</span>
						<span className="hidden md:inline ml-2">&lt;t128n@ipv4.8shield.net&gt;</span>
					</a>
					<div className="hidden md:flex items-center gap-4">
						<a
							href="https://github.com/t128n/routr"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground transition-colors flex items-center gap-1"
						>
							<GithubIcon className="w-4 h-4" />
							<span>GitHub</span>
						</a>
						<a
							href="https://github.com/t128n/routr#readme"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground transition-colors flex items-center gap-1"
						>
							<BookOpenIcon className="w-4 h-4" />
							<span>Docs</span>
						</a>
					</div>
				</div>

				{/* Right section: Version */}
				<div className="text-sm text-muted-foreground">
					<span>v{import.meta.env.PACKAGE_VERSION}</span>
					<span className="hidden md:inline ml-2">&lt;{import.meta.env.BUILD_TIME}&gt;</span>
				</div>
			</div>
		</footer>
	);
}

export { AppFooter };