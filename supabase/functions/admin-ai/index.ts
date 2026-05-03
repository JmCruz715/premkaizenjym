// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Admin AI assistant — has tool calling to:
 *   - create_app:  create a new app row
 *   - update_app:  update fields of an app
 *   - delete_app:  delete an app
 *   - list_apps:   list current apps
 *   - update_profile: update the admin's profile
 * Verifies caller is an admin via JWT.
 */
const tools = [
  {
    type: "function",
    function: {
      name: "create_app",
      description: "Create a new app entry in the Kaizen Apps catalog.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          slug: { type: "string", description: "lowercase-hyphenated unique slug" },
          tagline: { type: "string" },
          description: { type: "string" },
          download_url: { type: "string" },
          icon_url: { type: "string" },
          category: { type: "string" },
          version: { type: "string" },
          size: { type: "string" },
          app_type: { type: "string", enum: ["normal", "premium"] },
          is_featured: { type: "boolean" },
          is_published: { type: "boolean" },
        },
        required: ["name", "slug", "download_url"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_app",
      description: "Update fields on an existing app by id or slug.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          patch: { type: "object", description: "Fields to update" },
        },
        required: ["patch"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_app",
      description: "Delete an app by id or slug.",
      parameters: {
        type: "object",
        properties: { id: { type: "string" }, slug: { type: "string" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_apps",
      description: "List the most recent apps. Use to find slugs/ids before edits.",
      parameters: { type: "object", properties: { limit: { type: "number" } } },
    },
  },
  {
    type: "function",
    function: {
      name: "update_profile",
      description: "Update the admin's profile (display_name, bio, mlbb_id, portfolio_url, badge_style, avatar_url).",
      parameters: { type: "object", properties: { patch: { type: "object" } }, required: ["patch"] },
    },
  },
  {
    type: "function",
    function: {
      name: "update_layout",
      description: "Update mobile-first layout settings such as page width, card size/density, spacing, and compact mode.",
      parameters: {
        type: "object",
        properties: {
          maxWidth: { type: "number", description: "Main page max width in pixels. Use 360-430 for phone-like, 768-820 for iPad-like." },
          density: { type: "string", enum: ["compact", "comfortable", "large"] },
          cardSize: { type: "string", enum: ["small", "medium", "large"] },
          spacing: { type: "string", enum: ["tight", "normal", "wide"] },
          mobileFirst: { type: "boolean" },
        },
        additionalProperties: false,
      },
    },
  },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    // Verify admin via auth header
    const auth = req.headers.get("authorization") || "";
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: userRes } = await userClient.auth.getUser();
    const userId = userRes?.user?.id;
    if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (!roleRow) return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { messages } = await req.json();
    const convo: any[] = [
      { role: "system", content: "You are KaizenAdminAI — the admin's assistant. You can manage apps, profile, and layout settings via tools. If the user asks to adjust page size, mobile layout, card size, spacing, range, iPad/phone width, or make things compact/larger, use update_layout. If the user asks to upload an app via link, use create_app and keep the original download_url exactly as provided, especially MediaFire links. Generate a sensible slug from the name. Always confirm what you did briefly in Tagalog/English." },
      ...messages,
    ];

    // Loop tool calls until the model returns a final answer (max 6 rounds).
    for (let round = 0; round < 6; round++) {
      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "google/gemini-2.5-pro", messages: convo, tools }),
      });
      if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (!r.ok) {
        const t = await r.text();
        return new Response(JSON.stringify({ error: t }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const data = await r.json();
      const msg = data.choices?.[0]?.message;
      if (!msg) throw new Error("Empty response");
      convo.push(msg);
      const calls = msg.tool_calls || [];
      if (calls.length === 0) {
        return new Response(JSON.stringify({ reply: msg.content || "" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      for (const call of calls) {
        const name = call.function?.name;
        let args: any = {};
        try { args = JSON.parse(call.function?.arguments || "{}"); } catch {}
        let result: any = { ok: true };
        try {
          if (name === "create_app") {
            const row = {
              name: args.name,
              slug: args.slug,
              tagline: args.tagline ?? "",
              description: args.description ?? "",
              download_url: args.download_url,
              icon_url: args.icon_url ?? null,
              category: args.category ?? "App",
              version: args.version ?? "1.0",
              size: args.size ?? "",
              app_type: args.app_type ?? "normal",
              is_featured: args.is_featured ?? false,
              is_published: args.is_published ?? true,
              created_by: userId,
            };
            const { data, error } = await admin.from("user_apps").insert(row).select().single();
            if (error) throw error;
            result = { ok: true, app: data };
          } else if (name === "update_app") {
            let q = admin.from("user_apps").update(args.patch || {});
            q = args.id ? q.eq("id", args.id) : q.eq("slug", args.slug);
            const { data, error } = await q.select();
            if (error) throw error;
            result = { ok: true, updated: data };
          } else if (name === "delete_app") {
            let q = admin.from("user_apps").delete();
            q = args.id ? q.eq("id", args.id) : q.eq("slug", args.slug);
            const { error } = await q;
            if (error) throw error;
            result = { ok: true };
          } else if (name === "list_apps") {
            const { data, error } = await admin.from("user_apps").select("id,slug,name,app_type,is_featured,is_published").order("created_at", { ascending: false }).limit(args.limit ?? 30);
            if (error) throw error;
            result = { ok: true, apps: data };
          } else if (name === "update_profile") {
            const { data, error } = await admin.from("profiles").update(args.patch || {}).eq("user_id", userId).select().single();
            if (error) throw error;
            result = { ok: true, profile: data };
          } else if (name === "update_layout") {
            const current = {
              maxWidth: Math.min(820, Math.max(320, Number(args.maxWidth ?? 430))),
              density: args.density ?? "compact",
              cardSize: args.cardSize ?? (args.density === "large" ? "large" : args.density === "comfortable" ? "medium" : "small"),
              spacing: args.spacing ?? (args.density === "large" ? "wide" : args.density === "comfortable" ? "normal" : "tight"),
              mobileFirst: args.mobileFirst ?? true,
            };
            const { data, error } = await admin.from("site_settings").upsert({ key: "layout", value: current }).select().single();
            if (error) throw error;
            result = { ok: true, layout: data };
          } else {
            result = { ok: false, error: `Unknown tool ${name}` };
          }
        } catch (e: any) {
          result = { ok: false, error: e.message };
        }
        convo.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
    }
    return new Response(JSON.stringify({ reply: "(reached max tool rounds)" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
