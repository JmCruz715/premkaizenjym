// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Public AI chat — Q&A + optional image generation.
 * Body: { messages: [{role, content}], imagePrompt?: string }
 *  - if imagePrompt is present, returns base64 image
 *  - else returns streaming text via SSE
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages, imagePrompt } = await req.json();
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    if (imagePrompt) {
      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [{ role: "user", content: imagePrompt }],
          modalities: ["image", "text"],
        }),
      });
      if (!r.ok) {
        const t = await r.text();
        return new Response(JSON.stringify({ error: t }), { status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const data = await r.json();
      const url = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      return new Response(JSON.stringify({ image: url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: "You are KaizenGPT, a friendly assistant inside the Kaizen Apps site. You help users with anything: questions, code, writing, ideas. Reply in the user's language (Tagalog/English). Use markdown when helpful." },
          ...messages,
        ],
        stream: true,
      }),
    });
    if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit, try again shortly" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!r.ok) {
      const t = await r.text();
      return new Response(JSON.stringify({ error: t }), { status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    return new Response(r.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
