-- Track install counts per app slug
CREATE TABLE public.app_stats (
  slug TEXT PRIMARY KEY,
  installs BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_stats ENABLE ROW LEVEL SECURITY;

-- Anyone can read counts
CREATE POLICY "Anyone can view app stats"
ON public.app_stats FOR SELECT
USING (true);

-- Secure increment via SECURITY DEFINER function (no direct INSERT/UPDATE policies)
CREATE OR REPLACE FUNCTION public.increment_install(_slug TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  IF _slug IS NULL OR length(_slug) = 0 OR length(_slug) > 100 THEN
    RAISE EXCEPTION 'Invalid slug';
  END IF;

  INSERT INTO public.app_stats (slug, installs, updated_at)
  VALUES (_slug, 1, now())
  ON CONFLICT (slug)
  DO UPDATE SET installs = public.app_stats.installs + 1, updated_at = now()
  RETURNING installs INTO new_count;

  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_install(TEXT) TO anon, authenticated;