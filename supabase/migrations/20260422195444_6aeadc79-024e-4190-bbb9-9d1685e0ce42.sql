
-- Lock function search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Restrict broad listing on storage objects: only authenticated can list, public still loads file URLs through signed/public CDN
DROP POLICY IF EXISTS "Public can view app icons" ON storage.objects;
DROP POLICY IF EXISTS "Public can view app screenshots" ON storage.objects;

CREATE POLICY "Authenticated can list app icons" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'app-icons');
CREATE POLICY "Authenticated can list app screenshots" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'app-screenshots');
