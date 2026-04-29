// Auto-download helper.
//
// Goal: trigger the browser's native download silently WITHOUT navigating
// the user away from Kaizen Apps.
//
// Strategy:
// 1. For MediaFire links → proxy via edge function that resolves real .apk + 302.
// 2. For direct .apk links from a CORS-friendly host → use a hidden <a download>
//    + fetch+blob trick when possible to keep the user on the page.
// 3. Fallback to a hidden iframe (works for attachment responses).
// 4. Last-resort: open in a new tab so the user still gets the file.

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

function inferFilename(url: string, fallback?: string): string {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop();
    if (last && last.includes(".")) return decodeURIComponent(last);
  } catch {
    /* noop */
  }
  return fallback || "kaizen-download.apk";
}

/**
 * Triggers a download without leaving the page.
 * Tracks install in backend. Slug is optional.
 */
export function triggerDownload(url: string, filename?: string, slug?: string) {
  if (slug) trackInstall(slug); // fire & forget

  const fname = inferFilename(url, filename);

  toast({
    title: "Starting download…",
    description: fname,
  });

  const proxied = getDownloadUrl(url);

  // 1) Try the simplest reliable approach: a hidden <a download> click.
  // For same-origin / CORS-friendly hosts that send Content-Disposition: attachment,
  // this will download in place without navigating.
  try {
    const a = document.createElement("a");
    a.href = proxied;
    a.download = fname;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 1000);
  } catch {
    /* fall through */
  }

  // 2) Also drop a hidden iframe as a parallel attempt — if the response is an
  // attachment, the iframe won't navigate but the download will start.
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:absolute;width:0;height:0;border:0;visibility:hidden;";
  iframe.src = proxied;
  document.body.appendChild(iframe);
  setTimeout(() => iframe.remove(), 20000);

  // 3) Last-resort fallback: open original in new tab if nothing happened.
  // We cannot reliably detect a started download, so we wait long enough
  // that legit downloads have begun, then only open if the page has visibility
  // (user still here) and we sense the iframe never loaded a file.
  let iframeLoaded = false;
  iframe.onload = () => {
    iframeLoaded = true;
  };
  window.setTimeout(() => {
    if (!iframeLoaded) return; // attachment never fires onload — that's good, don't fallback
    // iframeLoaded === true means the proxy returned a normal HTML page (likely error)
    window.open(url, "_blank", "noopener,noreferrer");
  }, 6000);
}
