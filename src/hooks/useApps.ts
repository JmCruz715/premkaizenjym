import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { apps as staticApps, type App } from "@/data/apps";

export type DBApp = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon_url: string | null;
  version: string;
  size: string;
  category: string;
  rating: number;
  downloads: string;
  download_url: string;
  features: string[];
  accent: string;
  app_type: "normal" | "premium";
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

// Build a slug → static-icon map so DB rows reuse bundled images.
const staticIconMap = new Map(staticApps.map((a) => [a.id, a.icon] as const));
const staticAccentMap = new Map(staticApps.map((a) => [a.id, a.accent] as const));

export function dbToApp(row: DBApp): App {
  return {
    id: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    icon: row.icon_url || staticIconMap.get(row.slug) || "/placeholder.svg",
    version: row.version,
    size: row.size,
    category: row.category,
    rating: Number(row.rating),
    downloads: row.downloads,
    addedAt: row.created_at,
    url: row.download_url,
    features: row.features || [],
    accent: row.accent || staticAccentMap.get(row.slug) || "from-fuchsia-500 to-blue-500",
  };
}

/**
 * Loads all published apps from the DB. Used on Home + Profile + Detail.
 * Falls back to static apps if DB is empty/errored.
 */
export function useApps(opts?: { adminMode?: boolean }) {
  const [rows, setRows] = useState<DBApp[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("user_apps").select("*").order("created_at", { ascending: false });
    if (!opts?.adminMode) q = q.eq("is_published", true);
    const { data, error } = await q;
    if (!error && data) setRows(data as any);
    setLoading(false);
  }, [opts?.adminMode]);

  useEffect(() => {
    load();
  }, [load]);

  // Fallback to static if DB is empty
  const apps: App[] = rows.length
    ? rows.map(dbToApp)
    : opts?.adminMode
      ? []
      : staticApps;

  const featured = rows.filter((r) => r.is_featured).map(dbToApp);
  const premium = apps.filter((_, i) => rows[i]?.app_type === "premium");
  const normal = apps.filter((_, i) => rows[i]?.app_type === "normal");

  return { apps, rawRows: rows, featured, premium, normal, loading, refresh: load };
}
