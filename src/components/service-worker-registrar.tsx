import { useEffect } from "react";

/**
 * Registers a safe, static-only service worker on HTTPS origins.
 * The worker never caches authenticated pages, API responses, or user data.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "https:") return;
    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // App stays usable online even if service workers are unavailable.
    });
  }, []);
  return null;
}
