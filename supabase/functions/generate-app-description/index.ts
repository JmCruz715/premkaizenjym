// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, category } = await req.json();
    if (!name) throw new Error("name required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const prompt = `You write short, punchy app store descriptions for premium-unlocked Android APKs.
App name: "${name}"
Category hint: "${category || "unknown"}"

Return STRICT JSON only (no markdown, no prose) with this exact shape:
{
  "tagline": "max 8 words, catchy",
  "description": "2-3 sentences (~50 words) describing what this app does and what the PREMIUM/MOD version unlocks. Mention zero ads, all unlocks, no watermark, etc. as relevant.",
  "category": "best-fit category like Music, Video, Streaming, Gaming, Video Editor, AI / Video, Productivity, Photo Editor, Social",
  "features": ["5-6 short premium feature bullets, 2-4 words each, e.g. 'No watermark', 'Ad-free', '4K export'"]
}`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a concise app-store copywriter. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit, try again shortly" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`AI gateway: ${r.status} ${t}`);
    }

    const data = await r.json();
    let raw = data.choices?.[0]?.message?.content ?? "{}";
    raw = raw.replace(/```json\s*|\s*```/g, "").trim();
    const parsed = JSON.parse(raw);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
