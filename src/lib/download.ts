// Auto-download helper. For MediaFire links we route through an edge function
// that resolves the direct download URL and 302-redirects to the APK.
import { SUPABASE_URL } from "@/integrations/supabase/client";

const FN_URL = `${SUPABASE_URL}/functions/v1/mediafire-direct`;

export function getDownloadUrl(url: string): string {
  if (url.includes("mediafire.com")) {
    return `${FN_URL}?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export function triggerDownload(url: string, filename?: string) {
  const a = document.createElement("a");
  a.href = getDownloadUrl(url);
  if (filename) a.download = filename;
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 100);
}
