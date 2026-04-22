import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, X, Image as ImageIcon, LogOut, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { toast } from "sonner";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const UploadApp = () => {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [name, setName] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [shotFiles, setShotFiles] = useState<File[]>([]);
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  const generate = async () => {
    if (!name.trim()) return toast.error("Type the app name first");
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-app-description", {
        body: { name, category },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setTagline(data.tagline ?? "");
      setDescription(data.description ?? "");
      setCategory(data.category ?? category);
      setFeatures(Array.isArray(data.features) ? data.features : []);
      toast.success("AI description generated ✨");
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) nav("/auth");
  }, [loading, user, nav]);

  const uploadFile = async (bucket: string, file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return toast.error("Admin role required");
    if (!iconFile) return toast.error("Please add an app icon");
    setBusy(true);
    try {
      const iconUrl = await uploadFile("app-icons", iconFile);
      const screenshots: string[] = [];
      for (const f of shotFiles) screenshots.push(await uploadFile("app-screenshots", f));

      // Auto-generate description if user didn't click AI button
      let finalTagline = tagline;
      let finalDesc = description;
      let finalCat = category || "App";
      let finalFeats = features;
      if (!finalDesc) {
        try {
          const { data } = await supabase.functions.invoke("generate-app-description", {
            body: { name, category },
          });
          if (data && !data.error) {
            finalTagline = data.tagline ?? "";
            finalDesc = data.description ?? "";
            finalCat = data.category ?? finalCat;
            finalFeats = Array.isArray(data.features) ? data.features : [];
          }
        } catch {
          // ignore — proceed without AI description
        }
      }

      const { error } = await supabase.from("user_apps").insert({
        slug: slugify(name) + "-" + Date.now().toString(36),
        name,
        tagline: finalTagline,
        description: finalDesc,
        category: finalCat,
        features: finalFeats,
        icon_url: iconUrl,
        download_url: downloadUrl,
        screenshots,
        created_by: user!.id,
      });
      if (error) throw error;
      toast.success("App published!");
      nav("/new");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  if (!isAdmin) {
    return (
      <>
        <Header title="Upload App" subtitle="Admin access required." />
        <div className="glass-strong rounded-3xl p-5 text-sm space-y-3">
          <p>Naka-sign in ka as <strong>{user?.email}</strong> pero wala ka pang <code>admin</code> role.</p>
          <p className="text-muted-foreground text-xs">
            Buksan ang Lovable Cloud → Database → <code>user_roles</code> at mag-insert ng row na may user_id mo at role <code>admin</code>.
          </p>
          <button
            onClick={() => supabase.auth.signOut().then(() => nav("/auth"))}
            className="liquid-btn tap-press px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </>
    );
  }

  const iconPreview = iconFile ? URL.createObjectURL(iconFile) : null;

  return (
    <>
      <Header title="Quick Upload" subtitle="Mag-add ng bagong app sa 4 na hakbang lang." />
      <form onSubmit={submit} className="glass-strong rounded-3xl p-5 space-y-4 animate-fade-up">
        {/* Icon picker */}
        <div className="flex items-center gap-3">
          <label className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 bg-background/30 cursor-pointer hover:border-white/40 transition flex items-center justify-center overflow-hidden shrink-0">
            {iconPreview ? (
              <img src={iconPreview} alt="icon preview" className="w-full h-full object-cover" />
            ) : (
              <Plus className="w-7 h-7 text-muted-foreground" />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setIconFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">App icon</p>
            <p className="text-xs text-muted-foreground">Pindutin para pumili ng image</p>
          </div>
        </div>

        {/* App name + AI generate */}
        <div>
          <label className="text-xs text-muted-foreground">App name</label>
          <div className="mt-1 flex gap-2">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spotify Premium"
              className="flex-1 bg-background/40 rounded-xl px-4 py-3 text-sm border border-white/10 outline-none focus:border-white/30"
            />
            <button
              type="button"
              onClick={generate}
              disabled={generating || !name.trim()}
              className="liquid-btn liquid-btn-brand tap-press px-3 text-xs font-semibold text-white inline-flex items-center gap-1 shrink-0 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? "…" : "AI"}
            </button>
          </div>
        </div>

        {/* AI-generated preview (editable) */}
        {(tagline || description || features.length > 0) && (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-background/30 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI-generated · editable
            </p>
            <div>
              <label className="text-xs text-muted-foreground">Tagline</label>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="mt-1 w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/10 outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/10 outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/10 outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Premium features</label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {features.map((f, i) => (
                  <span key={i} className="text-[11px] bg-white/10 rounded-full px-2 py-1 inline-flex items-center gap-1">
                    {f}
                    <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* APK link */}
        <div>
          <label className="text-xs text-muted-foreground">APK download link</label>
          <input
            required
            type="url"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full bg-background/40 rounded-xl px-4 py-3 text-sm border border-white/10 outline-none focus:border-white/30"
          />
        </div>

        {/* Screenshots */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Screenshots ({shotFiles.length})</p>
          <div className="flex gap-2 flex-wrap">
            {shotFiles.map((f, i) => (
              <div key={i} className="relative w-20 h-28 rounded-xl overflow-hidden ring-1 ring-white/15">
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setShotFiles(shotFiles.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            <label className="w-20 h-28 rounded-xl border-2 border-dashed border-white/20 bg-background/30 cursor-pointer hover:border-white/40 transition flex flex-col items-center justify-center gap-1">
              <Plus className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Add</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setShotFiles([...shotFiles, ...Array.from(e.target.files ?? [])])}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="liquid-btn liquid-btn-brand tap-press w-full px-4 py-3 text-sm font-semibold text-white inline-flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" /> {busy ? "Uploading…" : "Publish app"}
        </button>
      </form>
    </>
  );
};

export default UploadApp;
