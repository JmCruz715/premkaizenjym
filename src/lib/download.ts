// Auto-download helper. For MediaFire links we route through an edge function
// that resolves the direct download URL and 302-redirects to the APK.
// Improved reliability:
//   1. Try edge-function proxy first
//   2. If proxy errors, gracefully fall back to opening the original URL
import { trackInstall } from "@/hooks/useAppStats";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const FN_URL = `${SUPABASE_URL}/functions/v1/mediafire-direct`;

export function getDownloadUrl(url: string): string {
  if (url.includes("mediafire.com")) {
    return `${FN_URL}?url=${encodeURIComponent(url)}`;
  }
  return url;
}

/** Triggers a download. Tracks install in backend. Slug is optional. */
export function triggerDownload(url: string, filename?: string, slug?: string) {
  if (slug) {
    // fire & forget
    trackInstall(slug);
  }

  const isMediaFire = url.includes("mediafire.com");
  const proxied = getDownloadUrl(url);

  // Use a hidden iframe for MediaFire so the 302 happens silently and
  // the browser begins downloading the .apk directly. Fall back to
  // opening the resolved/original URL in a new tab if nothing happens.
  if (isMediaFire) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = proxied;
    document.body.appendChild(iframe);

    // Safety fallback — if proxy fails (network/error), open the
    // original MediaFire page after a short delay so user still gets the file.
    const fallbackTimer = window.setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 4000);

    iframe.onload = () => window.clearTimeout(fallbackTimer);

    setTimeout(() => iframe.remove(), 15000);
    return;
  }

  // Direct link — use anchor click
  const a = document.createElement("a");
  a.href = proxied;
  if (filename) a.download = filename;
  a.rel = "noopener noreferrer";
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 100);
}
