import { useCallback, useEffect, useRef, useState } from "react";

type SWStatus =
	| "unsupported"
	| "idle"
	| "installing"
	| "installed"
	| "uninstalling"
	| "uninstalled"
	| "error";

interface UseServiceWorkerOptions {
	swPath?: string;
	options?: RegistrationOptions;
	onSuccess?: (registration: ServiceWorkerRegistration) => void;
	onError?: (error: Error) => void;
}

interface UseServiceWorkerReturn {
	status: SWStatus;
	error: Error | null;
	registration: ServiceWorkerRegistration | null;
	install: () => void;
	uninstall: () => void;
}

/**
 * React hook to manage a service worker: install, uninstall, update.
 * @param options UseServiceWorkerOptions
 */
export function useServiceWorker({
	swPath = "/sw.js",
	options,
	onSuccess,
	onError,
}: UseServiceWorkerOptions = {}): UseServiceWorkerReturn {
	const [status, setStatus] = useState<SWStatus>(() =>
		typeof window !== "undefined" && "serviceWorker" in navigator
			? "idle"
			: "unsupported",
	);
	const [error, setError] = useState<Error | null>(null);
	const [registration, setRegistration] =
		useState<ServiceWorkerRegistration | null>(null);

	// Keep latest callbacks
	const onSuccessRef = useRef(onSuccess);
	const onErrorRef = useRef(onError);
	useEffect(() => {
		onSuccessRef.current = onSuccess;
		onErrorRef.current = onError;
	}, [onSuccess, onError]);

	const install = useCallback(() => {
		if (!("serviceWorker" in navigator)) {
			setStatus("unsupported");
			return;
		}
		setStatus("installing");
		navigator.serviceWorker
			.register(swPath, options)
			.then((reg) => {
				setRegistration(reg);
				setStatus("installed");
				onSuccessRef.current?.(reg);
			})
			.catch((err) => {
				setError(err);
				setStatus("error");
				onErrorRef.current?.(err);
			});
	}, [swPath, options]);

	const uninstall = useCallback(() => {
		if (!("serviceWorker" in navigator)) {
			setStatus("unsupported");
			return;
		}
		if (!registration) {
			setStatus("uninstalled");
			return;
		}
		setStatus("uninstalling");
		registration
			.unregister()
			.then((success) => {
				if (success) {
					setRegistration(null);
					setStatus("uninstalled");
				} else {
					throw new Error("Failed to unregister service worker");
				}
			})
			.catch((err) => {
				setError(err);
				setStatus("error");
				onErrorRef.current?.(err);
			});
	}, [registration]);

	// Optionally, auto-detect existing registration on mount
	useEffect(() => {
		if (!("serviceWorker" in navigator)) return;
		navigator.serviceWorker
			.getRegistration(swPath)
			.then((reg) => {
				if (reg) {
					setRegistration(reg);
					setStatus("installed");
				}
			})
			.catch(() => {});
	}, [swPath]);

	return { status, error, registration, install, uninstall };
}
