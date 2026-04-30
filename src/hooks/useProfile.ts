import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  mlbb_id: string | null;
  portfolio_url: string | null;
};

/** Loads a profile by user_id. Pass null to skip. */
export function useProfile(userId: string | null | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    setProfile((data as Profile) || null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { profile, loading, refresh: load };
}

/** Loads the public site-owner profile (the first admin's profile). */
export function useOwnerProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Heuristic: pick the most-recent profile (single-admin site).
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      setProfile((data as Profile) || null);
      setLoading(false);
    })();
  }, []);

  return { profile, loading };
}
