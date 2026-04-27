// Resolves a MediaFire share URL into the direct download URL and 302-redirects.
// Public endpoint — no auth needed.
// Improved reliability: multiple regex fallbacks + better headers + retries.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": UA,
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
      });
      if (res.ok || res.status === 302) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 400 * (i + 1)));
  }
  throw lastErr instanceof Error ? lastErr : new Error("fetch failed");
}

function extractDirect(html: string): string | null {
  const patterns = [
    /href="(https?:\/\/download[^"]+)"[^>]*id="downloadButton"/i,
    /id="downloadButton"[^>]*href="(https?:\/\/download[^"]+)"/i,
    /<a[^>]*aria-label="Download file"[^>]*href="(https?:\/\/[^"]+)"/i,
    /(https?:\/\/download\d+\.mediafire\.com\/[a-z0-9]+\/[a-z0-9]+\/[^"'\s<>]+)/i,
    /window\.location\.href\s*=\s*['"](https?:\/\/download[^'"]+)['"]/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target || !target.includes("mediafire.com")) {
      return new Response("Missing or invalid ?url= parameter", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const res = await fetchWithRetry(target);
    const html = await res.text();
    const direct = extractDirect(html);

    if (!direct) {
      console.error("Could not parse direct link from MediaFire page", target);
      return new Response("Could not resolve direct download link", {
        status: 502,
        headers: corsHeaders,
      });
    }

    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: direct },
    });
  } catch (e) {
    console.error("mediafire-direct error", e);
    return new Response(`Error: ${(e as Error).message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
