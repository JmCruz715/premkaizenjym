import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const VIEW_KEY = "kaizen.views.v1";

function readViews(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(VIEW_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeViews(v: Record<string, number>) {
  try {
    localStorage.setItem(VIEW_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

/** Bumps local view counter for a given app slug. Call once per detail page mount. */
export function trackView(slug: string) {
  const v = readViews();
  v[slug] = (v[slug] || 0) + 1;
  writeViews(v);
}

/** Calls the secure RPC to bump real install counter. */
export async function trackInstall(slug: string) {
  try {
    await supabase.rpc("increment_install", { _slug: slug });
  } catch (e) {
    console.warn("increment_install failed", e);
  }
}

export type StatsMap = Record<string, { installs: number; views: number }>;

/** Returns stats for one slug (or all when slug omitted). */
export function useAppStats(slug?: string) {
  const [installs, setInstalls] = useState<number>(0);
  const [views, setViews] = useState<number>(0);
  const [allInstalls, setAllInstalls] = useState<Record<string, number>>({});

  const refresh = useCallback(async () => {
    const localViews = readViews();
    setAllInstalls((prev) => prev); // keep stable

    if (slug) {
      setViews(localViews[slug] || 0);
      const { data } = await supabase
        .from("app_stats")
        .select("installs")
        .eq("slug", slug)
        .maybeSingle();
      setInstalls(Number(data?.installs ?? 0));
    } else {
      const { data } = await supabase.from("app_stats").select("slug, installs");
      const map: Record<string, number> = {};
      let total = 0;
      (data || []).forEach((r: any) => {
        map[r.slug] = Number(r.installs);
        total += Number(r.installs);
      });
      setAllInstalls(map);
      setInstalls(total);
      setViews(Object.values(localViews).reduce((a, b) => a + b, 0));
    }
  }, [slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { installs, views, allInstalls, refresh };
}
