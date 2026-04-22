import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { App } from "@/data/apps";

export const mapRowToApp = (r: any): App => ({
  id: r.slug,
  name: r.name,
  tagline: r.tagline ?? "",
  description: r.description ?? "",
  icon: r.icon_url ?? "/placeholder.svg",
  version: r.version ?? "1.0",
  size: r.size ?? "",
  category: r.category ?? "App",
  rating: Number(r.rating ?? 4.5),
  downloads: r.downloads ?? "1K+",
  addedAt: r.created_at,
  url: r.download_url,
  features: r.features ?? [],
  accent: r.accent ?? "from-fuchsia-500 to-blue-500",
});

export const useUserApps = () => {
  const [userApps, setUserApps] = useState<App[]>([]);
  const [screenshots, setScreenshots] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("user_apps")
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (!error && data) {
        setUserApps(data.map(mapRowToApp));
        const shots: Record<string, string[]> = {};
        data.forEach((r: any) => {
          if (r.screenshots?.length) shots[r.slug] = r.screenshots;
        });
        setScreenshots(shots);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { userApps, screenshots, loading };
};
