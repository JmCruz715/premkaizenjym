// Auto-download helper.
//
// Strategy: try fetch+blob first (true silent download, never navigates),
// fall back to <a download> click. For MediaFire URLs route through the
// edge function that resolves the real APK and 302-redirects.

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

export function isMediaFireUrl(url: string): boolean {
  return /(^|\.)mediafire\.com/i.test(url) || /\/functions\/v1\/mediafire-direct/i.test(url);
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
 * Tries to download via blob (CORS-friendly hosts only). Falls back to
 * the classic <a download> click which the browser handles natively
 * without navigating away.
 */
export async function triggerDownload(url: string, filename?: string, slug?: string) {
  if (slug) trackInstall(slug);

  const fname = inferFilename(url, filename);
  const proxied = getDownloadUrl(url);

  toast({ title: "Starting download…", description: fname });

  // MediaFire is already handled by the resolver function. Fetching the 302 as
  // a blob often fails on phones, so use native browser download/open behavior.
  if (isMediaFireUrl(url)) {
    const a = document.createElement("a");
    a.href = proxied;
    a.download = fname;
    a.rel = "noopener";
    a.target = "_blank";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 1000);
    return;
  }

  // Strategy 1 — fetch as blob (works for our own storage bucket + CORS hosts)
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(proxied, { signal: ctrl.signal, mode: "cors" });
    clearTimeout(timeout);
    if (res.ok) {
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fname;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        a.remove();
      }, 2000);
      return;
    }
  } catch {
    /* fall through to anchor strategy */
  }

  // Strategy 2 — <a download> click. Doesn't navigate when the response
  // sends Content-Disposition: attachment.
  try {
    const a = document.createElement("a");
    a.href = proxied;
    a.download = fname;
    a.rel = "noopener";
    a.target = "_self";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 1000);
  } catch {
    /* noop */
  }

  // Strategy 3 — hidden iframe as a parallel safety net.
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:absolute;width:0;height:0;border:0;visibility:hidden;";
  iframe.src = proxied;
  document.body.appendChild(iframe);
  setTimeout(() => iframe.remove(), 20000);
}
