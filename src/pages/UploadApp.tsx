import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, X, LogOut } from "lucide-react";
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

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("1.0");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("App");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [features, setFeatures] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [shotFiles, setShotFiles] = useState<File[]>([]);

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
    if (!isAdmin) {
      toast.error("Admin role required");
      return;
    }
    setBusy(true);
    try {
      let iconUrl: string | null = null;
      if (iconFile) iconUrl = await uploadFile("app-icons", iconFile);

      const screenshots: string[] = [];
      for (const f of shotFiles) screenshots.push(await uploadFile("app-screenshots", f));

      const { error } = await supabase.from("user_apps").insert({
        slug: slugify(name) + "-" + Date.now().toString(36),
        name,
        tagline,
        description,
        icon_url: iconUrl,
        version,
        size,
        category,
        download_url: downloadUrl,
        features: features.split(",").map((f) => f.trim()).filter(Boolean),
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
          <p>You're signed in as <strong>{user?.email}</strong> but don't have the <code>admin</code> role yet.</p>
          <p className="text-muted-foreground text-xs">
            Open Lovable Cloud → Database → <code>user_roles</code> and insert a row with your user_id and role <code>admin</code>.
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

  return (
    <>
      <Header title="Upload App" subtitle="Add a new premium app." />
      <form onSubmit={submit} className="glass-strong rounded-3xl p-5 space-y-3 animate-fade-up">
        <Field label="App name" v={name} set={setName} required />
        <Field label="Tagline" v={tagline} set={setTagline} />
        <div>
          <label className="text-xs text-muted-foreground">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full bg-background/40 rounded-xl px-4 py-3 text-sm border border-white/10 outline-none focus:border-white/30"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Version" v={version} set={setVersion} />
          <Field label="Size" v={size} set={setSize} placeholder="e.g. 45 MB" />
        </div>
        <Field label="Category" v={category} set={setCategory} />
        <Field label="Download URL (APK)" v={downloadUrl} set={setDownloadUrl} required type="url" />
        <Field label="Features (comma separated)" v={features} set={setFeatures} placeholder="Ad-free, 4K, Offline" />

        <FileField label="App icon" multiple={false} onChange={(fs) => setIconFile(fs[0] ?? null)} files={iconFile ? [iconFile] : []} />
        <FileField label="Screenshots" multiple onChange={setShotFiles} files={shotFiles} />

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

const Field = ({
  label, v, set, required, type = "text", placeholder,
}: { label: string; v: string; set: (s: string) => void; required?: boolean; type?: string; placeholder?: string }) => (
  <div>
    <label className="text-xs text-muted-foreground">{label}</label>
    <input
      type={type}
      required={required}
      value={v}
      onChange={(e) => set(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full bg-background/40 rounded-xl px-4 py-3 text-sm border border-white/10 outline-none focus:border-white/30"
    />
  </div>
);

const FileField = ({
  label, multiple, onChange, files,
}: { label: string; multiple: boolean; onChange: (fs: File[]) => void; files: File[] }) => (
  <div>
    <label className="text-xs text-muted-foreground">{label}</label>
    <label className="mt-1 flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/20 bg-background/30 cursor-pointer hover:border-white/40 transition">
      <Plus className="w-4 h-4" />
      <span className="text-sm text-muted-foreground">
        {files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : `Add ${label.toLowerCase()}`}
      </span>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => onChange(Array.from(e.target.files ?? []))}
      />
    </label>
    {files.length > 1 && (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {files.map((f, i) => (
          <span key={i} className="text-[10px] bg-white/10 rounded-full px-2 py-1 inline-flex items-center gap-1">
            {f.name.slice(0, 18)}
            <button type="button" onClick={() => onChange(files.filter((_, j) => j !== i))}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    )}
  </div>
);

export default UploadApp;
