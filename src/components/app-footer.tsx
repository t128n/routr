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
							<span>&copy; 2025 Torben Haack</span>
							<span className="hidden md:inline">&lt;t128n@ipv4.8shield.net&gt;</span>
						</a>
					</p>
				</div>
				<div className="flex items-center">
					<p className="text-sm flex items-center gap-1">
						<span>v{import.meta.env.PACKAGE_VERSION}</span>
						<span className="hidden md:inline">&lt;{import.meta.env.BUILD_TIME}&gt;</span>
					</p>
				</div>
			</div>
		</footer>
	);
}

export { AppFooter };