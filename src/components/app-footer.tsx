function AppFooter() {
	return (
		<footer className="p-4 border-t border-dashed">
			<div className="flex items-center justify-between w-content mx-auto">
				<div className="flex items-center">
					<p className="text-sm flex items-center gap-1">
						<span>&copy; 2025 Torben Haack</span>
						<span>&lt;t128n@ipv4.8shield.net&gt;</span>
					</p>
				</div>
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