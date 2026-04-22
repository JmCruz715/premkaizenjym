
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Apps table
CREATE TABLE public.user_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon_url TEXT,
  version TEXT NOT NULL DEFAULT '1.0',
  size TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'App',
  rating NUMERIC NOT NULL DEFAULT 4.5,
  downloads TEXT NOT NULL DEFAULT '1K+',
  download_url TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  accent TEXT NOT NULL DEFAULT 'from-fuchsia-500 to-blue-500',
  screenshots TEXT[] NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view apps" ON public.user_apps
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert apps" ON public.user_apps
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update apps" ON public.user_apps
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete apps" ON public.user_apps
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER user_apps_updated_at
  BEFORE UPDATE ON public.user_apps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('app-icons', 'app-icons', true),
  ('app-screenshots', 'app-screenshots', true);

CREATE POLICY "Public can view app icons" ON storage.objects
  FOR SELECT USING (bucket_id = 'app-icons');
CREATE POLICY "Admins can upload app icons" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app-icons' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update app icons" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'app-icons' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete app icons" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'app-icons' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view app screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'app-screenshots');
CREATE POLICY "Admins can upload screenshots" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app-screenshots' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update screenshots" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'app-screenshots' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete screenshots" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'app-screenshots' AND public.has_role(auth.uid(), 'admin'));
