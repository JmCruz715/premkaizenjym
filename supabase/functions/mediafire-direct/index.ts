// Resolves a MediaFire share URL into the direct download URL and 302-redirects.
// Public endpoint — no auth needed.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target || !target.includes("mediafire.com")) {
      return new Response("Missing or invalid ?url= parameter", { status: 400, headers: corsHeaders });
    }

    const res = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
    });
    const html = await res.text();

    // MediaFire embeds the direct link inside <a id="downloadButton" href="...">
    const match =
      html.match(/href="(https?:\/\/download[^"]+)"[^>]*id="downloadButton"/i) ||
      html.match(/id="downloadButton"[^>]*href="(https?:\/\/download[^"]+)"/i) ||
      html.match(/(https?:\/\/download\d+\.mediafire\.com\/[^"'\s]+)/i);

    if (!match) {
      return new Response("Could not resolve direct download link", { status: 502, headers: corsHeaders });
    }

    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: match[1] },
    });
  } catch (e) {
    return new Response(`Error: ${(e as Error).message}`, { status: 500, headers: corsHeaders });
  }
});
