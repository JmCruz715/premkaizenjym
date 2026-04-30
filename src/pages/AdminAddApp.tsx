import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { uploadAppFile } from "@/lib/uploads";
import { toast } from "sonner";
import { Upload, Link as LinkIcon, Save, ArrowLeft } from "lucide-react";

const AdminAddApp = () => {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"upload" | "link">("link");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    name: "",
    tagline: "",
    description: "",
    version: "1.0",
    size: "0 MB",
    category: "App",
    rating: 4.5,
    downloads: "1K+",
    download_url: "",
    icon_url: "",
    accent: "from-fuchsia-500 to-blue-500",
    app_type: "normal" as "normal" | "premium",
    is_featured: false,
    is_published: true,
  });

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <div className="text-center py-20 text-muted-foreground">Admin only.</div>;

  const onApkPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadAppFile(f, "apks");
      setForm((s) => ({ ...s, download_url: url, size: `${(f.size / 1_000_000).toFixed(1)} MB` }));
      toast.success("APK uploaded");
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const onIconPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadAppFile(f, "icons");
      setForm((s) => ({ ...s, icon_url: url }));
      toast.success("Icon uploaded");
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.name || !form.download_url) {
      toast.error("Slug, name, and download URL are required");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.from("user_apps").insert({
        slug: form.slug,
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        version: form.version,
        size: form.size,
        category: form.category,
        rating: form.rating,
        downloads: form.downloads,
        download_url: form.download_url,
        icon_url: form.icon_url || null,
        accent: form.accent,
        app_type: form.app_type,
        is_featured: form.is_featured,
        is_published: form.is_published,
        features: [],
        screenshots: [],
        created_by: user.id,
      });
      if (error) throw error;
      toast.success("App added!");
      nav("/admin");
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  return (
    <>
      <button onClick={() => nav("/admin")} className="liquid-btn tap-press inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to admin
      </button>
      <Header title="Add new app" subtitle="Upload an APK or paste a download link." />

      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => setMode("upload")} className={`liquid-btn tap-press px-4 py-3 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5 ${mode === "upload" ? "liquid-btn-brand" : ""}`}>
          <Upload className="w-4 h-4" /> Upload APK
        </button>
        <button onClick={() => setMode("link")} className={`liquid-btn tap-press px-4 py-3 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5 ${mode === "link" ? "liquid-btn-brand" : ""}`}>
          <LinkIcon className="w-4 h-4" /> Paste link
        </button>
      </div>

      <form onSubmit={submit} className="glass-strong rounded-3xl p-5 space-y-3">
        {mode === "upload" ? (
          <Field label="APK file">
            <input type="file" accept=".apk,application/vnd.android.package-archive" onChange={onApkPick} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15" />
            {form.download_url && <p className="text-[10px] text-emerald-400 mt-1 truncate">✓ {form.download_url}</p>}
          </Field>
        ) : (
          <Field label="Download URL">
            <input value={form.download_url} onChange={(e) => setForm({ ...form, download_url: e.target.value })} placeholder="https://..." className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15 outline-none" />
          </Field>
        )}

        <Field label="App icon (optional)">
          <input type="file" accept="image/*" onChange={onIconPick} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15" />
          {form.icon_url && <img src={form.icon_url} alt="" className="w-12 h-12 rounded-xl mt-2 object-cover" />}
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Slug *"><input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15 outline-none" /></Field>
          <Field label="Name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15 outline-none" /></Field>
        </div>

        <Field label="Tagline"><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15 outline-none" /></Field>
        <Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15 outline-none" /></Field>

        <div className="grid grid-cols-3 gap-2">
          <Field label="Version"><input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15 outline-none" /></Field>
          <Field label="Size"><input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15 outline-none" /></Field>
          <Field label="Category"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15 outline-none" /></Field>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Type">
            <select value={form.app_type} onChange={(e) => setForm({ ...form, app_type: e.target.value as any })} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15">
              <option value="normal">Normal</option><option value="premium">Premium</option>
            </select>
          </Field>
          <Field label="Featured">
            <label className="flex items-center gap-2 text-sm h-full pt-2"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Show on featured</label>
          </Field>
        </div>

        <button type="submit" disabled={busy} className="liquid-btn liquid-btn-brand tap-press w-full px-4 py-3 text-sm font-semibold text-white inline-flex items-center justify-center gap-1.5">
          <Save className="w-4 h-4" /> {busy ? "Saving…" : "Add app"}
        </button>
      </form>
    </>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">{label}</label>
    {children}
  </div>
);

export default AdminAddApp;
