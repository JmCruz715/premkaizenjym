import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useApps } from "@/hooks/useApps";
import { supabase } from "@/integrations/supabase/client";
import { uploadAppFile } from "@/lib/uploads";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Save, X, Crown, Sparkles, ShieldCheck, ExternalLink, Upload, Link as LinkIcon, Bot } from "lucide-react";
import { AdminAiChat } from "@/components/AdminAiChat";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { rawRows, refresh } = useApps({ adminMode: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<any>({});
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <div className="text-center py-20 text-muted-foreground">Admin only.</div>;

  const startEdit = (row: any) => {
    setEditingId(row.id);
    setDraft({ ...row });
  };

  const save = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.from("user_apps").update({
        name: draft.name,
        download_url: draft.download_url,
        app_type: draft.app_type,
        is_featured: draft.is_featured,
        is_published: draft.is_published,
        version: draft.version,
        size: draft.size,
        category: draft.category,
        tagline: draft.tagline,
      }).eq("id", draft.id);
      if (error) throw error;
      toast.success("Saved");
      setEditingId(null);
      await refresh();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this app?")) return;
    const { error } = await supabase.from("user_apps").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); refresh(); }
  };

  const togglePublished = async (row: any) => {
    await supabase.from("user_apps").update({ is_published: !row.is_published }).eq("id", row.id);
    refresh();
  };

  return (
    <>
      <Header title="Admin" subtitle="Manage every app, link, and feature." />

      <div className="flex flex-wrap gap-2 mb-4">
        <Link to="/admin/add" className="liquid-btn liquid-btn-brand tap-press px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add new app
        </Link>
        <Link to="/profile" className="liquid-btn tap-press px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Profile
        </Link>
      </div>

      {/* Lovable AI admin assistant */}
      <div className="mb-5">
        <AdminAiChat onAfterAction={refresh} />
      </div>

      <div className="space-y-2">
        {rawRows.map((row: any) => (
          <article key={row.id} className="glass-strong rounded-2xl p-3 sm:p-4">
            {editingId === row.id ? (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</label>
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15 outline-none" />
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Download URL</label>
                <input value={draft.download_url} onChange={(e) => setDraft({ ...draft, download_url: e.target.value })} className="w-full bg-background/40 rounded-xl px-3 py-2 text-xs border border-white/15 outline-none" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={draft.app_type} onChange={(e) => setDraft({ ...draft, app_type: e.target.value })} className="bg-background/40 rounded-xl px-3 py-2 text-sm border border-white/15">
                    <option value="normal">Normal</option><option value="premium">Premium</option>
                  </select>
                  <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={draft.is_featured} onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })} /> Featured</label>
                </div>
                <div className="flex gap-2">
                  <button onClick={save} disabled={busy} className="liquid-btn liquid-btn-brand tap-press flex-1 px-3 py-2 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save</button>
                  <button onClick={() => setEditingId(null)} className="liquid-btn tap-press px-3 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate text-sm">{row.name}</h3>
                    {row.app_type === "premium" && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    {row.is_featured && <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />}
                    {!row.is_published && <span className="text-[10px] px-1.5 rounded bg-rose-500/20 text-rose-300">hidden</span>}
                  </div>
                  <a href={row.download_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground truncate flex items-center gap-1 hover:text-foreground">
                    <ExternalLink className="w-2.5 h-2.5" /> {row.download_url}
                  </a>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => togglePublished(row)} className="liquid-btn tap-press w-8 h-8 inline-flex items-center justify-center text-white text-[10px]" title={row.is_published ? "Hide" : "Show"}>
                    {row.is_published ? "👁" : "🚫"}
                  </button>
                  <button onClick={() => startEdit(row)} className="liquid-btn tap-press w-8 h-8 inline-flex items-center justify-center text-white" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(row.id)} className="liquid-btn tap-press w-8 h-8 inline-flex items-center justify-center text-white" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
};

export default Admin;
