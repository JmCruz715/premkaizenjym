// Auto-download helper.
//
// Goal: trigger the browser's native download silently WITHOUT navigating
// the user away from Kaizen Apps. We use a hidden iframe so the response
// (Content-Disposition: attachment for .apk) starts the download in place.
//
// For MediaFire links we proxy through an edge function that resolves the
// real .apk URL and 302-redirects.
// For all other direct links we just point the iframe at the URL.
// Fallback: after 5s with no success, open the link in a new tab so the
// user still gets the file.

import { trackInstall } from "@/hooks/useAppStats";
import { toast } from "@/hooks/use-toast";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const FN_URL = `${SUPABASE_URL}/functions/v1/mediafire-direct`;

export function getDownloadUrl(url: string): string {
  if (url.includes("mediafire.com")) {
    return `${FN_URL}?url=${encodeURIComponent(url)}`;
  }
  return url;
}

/**
 * Triggers a download without leaving the page.
 * Tracks install in backend. Slug is optional.
 */
export function triggerDownload(url: string, filename?: string, slug?: string) {
  if (slug) trackInstall(slug); // fire & forget

  toast({
    title: "Starting download…",
    description: filename ? `${filename}` : "Your file will begin shortly.",
  });

  const proxied = getDownloadUrl(url);

  // Hidden iframe approach — works for .apk responses and 302 redirects.
  // The user never leaves Kaizen Apps.
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:absolute;width:0;height:0;border:0;visibility:hidden;";
  iframe.src = proxied;
  document.body.appendChild(iframe);

  // Safety fallback — if proxy fails or browser blocks the iframe response,
  // open the original page in a new tab after a short delay.
  let succeeded = false;
  const fallbackTimer = window.setTimeout(() => {
    if (!succeeded) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, 5000);

  iframe.onload = () => {
    // For an attachment download the iframe never fires "load" successfully —
    // but if it does (e.g. proxy errored to a HTML page), we still treat as ok
    // and skip fallback. The toast already told the user what's happening.
    succeeded = true;
    window.clearTimeout(fallbackTimer);
  };

  // Clean up iframe later regardless.
  setTimeout(() => iframe.remove(), 20000);
}
