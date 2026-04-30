import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook, MessageCircle, Info, Check, Sparkles, TrendingUp, Heart, Zap,
  Globe, MapPin, Calendar, Code2, Music, ExternalLink, Share2, Flame, Download,
  Plus, Pencil, Menu as MenuIcon, X, ShieldCheck, Settings, LogIn, LogOut,
  Sword, Palette, Bell, HelpCircle, Camera, Save,
} from "lucide-react";
import { Header } from "@/components/Header";
import { useAppStats } from "@/hooks/useAppStats";
import { useApps } from "@/hooks/useApps";
import { useAuth } from "@/hooks/useAuth";
import { useOwnerProfile, useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { uploadAvatar } from "@/lib/uploads";
import { toast } from "sonner";
import kaizen from "@/assets/kaizen.jpg";

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

const MLBB_ID_DEFAULT = "1598572788";

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const { profile: ownerProfile, loading: ownerLoading } = useOwnerProfile();
  // Admins edit their own profile (which is the owner)
  const { profile: myProfile, refresh: refreshMine } = useProfile(user?.id);
  const editable = isAdmin ? myProfile : null;
  const view = (isAdmin ? myProfile : ownerProfile) || ownerProfile;

  const { installs: totalInstalls, views: totalViews } = useAppStats();
  const { apps, featured } = useApps();
  const totalApps = apps.length;
  const avgRating = (
    apps.reduce((s, a) => s + a.rating, 0) / Math.max(1, totalApps)
  ).toFixed(1);

  // ── menu drawer ──
  const [menuOpen, setMenuOpen] = useState(false);

  // ── inline edit ──
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftBio, setDraftBio] = useState("");
  const [draftMlbb, setDraftMlbb] = useState("");
  const [draftPortfolio, setDraftPortfolio] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDraftName(view?.display_name || "Kaizen");
    setDraftBio(view?.bio || "Curating premium Android apps so anyone can enjoy them for free.");
    setDraftMlbb(view?.mlbb_id || MLBB_ID_DEFAULT);
    setDraftPortfolio(view?.portfolio_url || "https://jymmportfolio.vercel.app");
    setEditing(true);
  };

  const saveProfile = async () => {
    if (!user || !isAdmin) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: draftName,
          bio: draftBio,
          mlbb_id: draftMlbb,
          portfolio_url: draftPortfolio,
        })
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Profile updated");
      await refreshMine();
      setEditing(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setBusy(false);
    }
  };

  const onAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !user) return;
    setBusy(true);
    try {
      const url = await uploadAvatar(user.id, f);
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Avatar updated");
      await refreshMine();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  const displayName = view?.display_name || "Kaizen";
  const bio = view?.bio || "Curating premium Android apps so anyone can enjoy them for free. Built with love, gradients, at konting kape. ☕";
  const portfolio = view?.portfolio_url || "https://jymmportfolio.vercel.app";
  const mlbbId = view?.mlbb_id || MLBB_ID_DEFAULT;
  const avatar = view?.avatar_url || kaizen;

  // MLBB add-friend: opens the in-game profile via deep link if the app is installed,
  // otherwise falls back to the website / Play Store referral.
  const mlbbAddFriendUrl = `mobilelegends://addfriend?id=${mlbbId}`;
  const mlbbWebFallback = `https://m.mobilelegends.com/`;
  const openMlbb = () => {
    // Try deep link first; if MLBB is not installed, fall back after 1.5s.
    const t = setTimeout(() => window.open(mlbbWebFallback, "_blank"), 1500);
    window.location.href = mlbbAddFriendUrl;
    // Clear the fallback if the page becomes hidden (the app opened).
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearTimeout(t);
    }, { once: true });
  };

  return (
    <>
      {/* Sidebar drawer */}
      <ProfileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isAdmin={isAdmin} signedIn={!!user} onSignOut={signOut} />

      <div className="flex items-start justify-between gap-2 mb-4">
        <button
          onClick={() => setMenuOpen(true)}
          className="liquid-btn tap-press w-11 h-11 inline-flex items-center justify-center text-white shrink-0"
          aria-label="Open menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <Header title="Profile" subtitle="Meet the creator." showLogo={false} />
        </div>
      </div>

      {/* ───── Hero card ───── */}
      <section className="glass-strong rounded-3xl p-5 sm:p-6 text-center animate-fade-up relative overflow-hidden">
        <div className="absolute -top-20 -left-16 w-56 h-56 rounded-full bg-gradient-to-br from-fuchsia-500 to-blue-500 opacity-25 blur-3xl pointer-events-none animate-blob" />
        <div className="absolute -bottom-24 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 opacity-20 blur-3xl pointer-events-none animate-blob" style={{ animationDelay: "3s" }} />

        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto animate-float">
          <div className="absolute inset-0 rounded-full p-[3px] bg-[image:var(--gradient-brand)] animate-pop-in">
            <div className="absolute inset-[-6px] rounded-full bg-[conic-gradient(from_0deg,hsl(280_90%_60%/.6),transparent_30%,hsl(220_95%_60%/.6),transparent_70%,hsl(350_90%_60%/.6))] blur-md animate-spin-slow -z-10" />
            <img
              src={avatar}
              alt={`${displayName} avatar`}
              width={128}
              height={128}
              className="w-full h-full rounded-full object-cover bg-background"
            />
          </div>
          <span aria-label="Online" title="Online" className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[hsl(140_80%_45%)] ring-4 ring-background pulse-dot" />

          {/* Avatar + button (admin only) */}
          {isAdmin && (
            <>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="absolute -bottom-1 -left-1 w-9 h-9 rounded-full liquid-btn liquid-btn-brand text-white inline-flex items-center justify-center shadow-lg tap-press"
                aria-label="Change avatar"
                title="Change avatar"
              >
                <Plus className="w-4 h-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onAvatarPick} className="hidden" />
            </>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 relative">
          {editing ? (
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="text-2xl sm:text-3xl font-bold bg-background/40 rounded-xl px-3 py-1 text-center outline-none border border-white/20 focus:border-white/50 max-w-xs"
            />
          ) : (
            <h2 className="text-2xl sm:text-3xl font-bold">{displayName}</h2>
          )}
          <span className="verified-badge" aria-label="Verified" title="Verified creator">
            <Check />
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 relative">
          @{(view?.display_name || "jymm").toLowerCase().replace(/\s+/g, "")} · Creator · Developer
        </p>

        {editing ? (
          <textarea
            value={draftBio}
            onChange={(e) => setDraftBio(e.target.value)}
            rows={3}
            className="mt-3 w-full max-w-sm mx-auto block bg-background/40 rounded-xl px-3 py-2 text-sm outline-none border border-white/20 focus:border-white/50"
          />
        ) : (
          <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto relative leading-relaxed">{bio}</p>
        )}

        {editing && (
          <div className="mt-3 grid grid-cols-1 gap-2 max-w-sm mx-auto text-left">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Portfolio URL</label>
            <input value={draftPortfolio} onChange={(e) => setDraftPortfolio(e.target.value)} className="bg-background/40 rounded-xl px-3 py-2 text-sm outline-none border border-white/20 focus:border-white/50" />
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">MLBB ID</label>
            <input value={draftMlbb} onChange={(e) => setDraftMlbb(e.target.value)} className="bg-background/40 rounded-xl px-3 py-2 text-sm outline-none border border-white/20 focus:border-white/50" />
          </div>
        )}

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-2 mt-5 relative max-w-sm mx-auto">
          {editing ? (
            <>
              <button onClick={saveProfile} disabled={busy} className="liquid-btn liquid-btn-brand tap-press px-3 py-2.5 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5">
                <Save className="w-3.5 h-3.5" /> {busy ? "Saving…" : "Save"}
              </button>
              <button onClick={() => setEditing(false)} className="liquid-btn tap-press px-3 py-2.5 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </>
          ) : (
            <>
              <a href={portfolio} target="_blank" rel="noopener noreferrer" className="liquid-btn liquid-btn-brand tap-press px-3 py-2.5 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Portfolio
              </a>
              {isAdmin ? (
                <button onClick={startEdit} className="liquid-btn tap-press px-3 py-2.5 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5" /> Edit profile
                </button>
              ) : (
                <a href="https://www.facebook.com/jm.born67" target="_blank" rel="noopener noreferrer" className="liquid-btn tap-press px-3 py-2.5 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5" /> Facebook
                </a>
              )}
            </>
          )}
        </div>
      </section>

      {/* ───── MLBB add friend ───── */}
      <section className="mt-3 reveal">
        <button
          onClick={openMlbb}
          className="mlbb-btn tap-press w-full rounded-3xl p-4 flex items-center gap-3 group"
        >
          <span className="w-12 h-12 rounded-2xl bg-black/30 flex items-center justify-center shrink-0 ring-1 ring-white/30">
            <Sword className="w-6 h-6" />
          </span>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold flex items-center gap-1.5">
              Add me on Mobile Legends <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </p>
            <p className="text-[11px] opacity-90">ID: {mlbbId} · Tap to send friend request</p>
          </div>
        </button>
      </section>

      {/* ───── Featured Drop ───── */}
      {featured.length > 0 && (
        <section className="mt-3 reveal">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2 px-1">
            <Flame className="w-3.5 h-3.5" /> Featured Drop
          </h3>
          <div className="glass-strong rounded-3xl p-5 relative overflow-hidden animate-fade-up">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[hsl(280_90%_60%/0.45)] blur-2xl" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground relative">This week</p>
            <h4 className="text-2xl font-bold mt-1 relative">{featured.length} hand-picked apps</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 relative">
              {featured.slice(0, 6).map((a) => (
                <Link
                  key={a.id}
                  to={`/app/${a.id}`}
                  className="glass rounded-2xl p-2 flex items-center gap-2 tap-press"
                >
                  <span className="relative shrink-0">
                    <img src={a.icon} alt="" className="w-9 h-9 rounded-xl object-cover" />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[hsl(140_80%_45%)] ring-2 ring-background flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold truncate flex-1">{a.name}</span>
                </Link>
              ))}
            </div>
            <Link to="/" className="liquid-btn liquid-btn-brand tap-press mt-4 inline-flex px-4 py-2 text-xs font-semibold text-white items-center gap-1.5">
              <Download className="w-4 h-4" /> Browse all apps
            </Link>
          </div>
        </section>
      )}

      {/* ───── Live Stats ───── */}
      <section className="mt-3 reveal">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Live Stats
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(140_80%_45%)] pulse-dot" /> Real-time
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatCard label="Apps" value={String(totalApps)} delay={0} />
          <StatCard label="Installs" value={fmt(totalInstalls)} delay={80} />
          <StatCard label="Views" value={fmt(totalViews)} delay={160} />
          <StatCard label="Rating" value={`${avgRating}★`} delay={240} />
        </div>
      </section>

      {/* ───── About Me ───── */}
      <section className="mt-3 reveal">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2 px-1">
          <Info className="w-3.5 h-3.5" /> About Me
        </h3>
        <div className="glass-strong rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <InfoRow icon={MapPin} tint="from-blue-500/30 to-purple-500/30" iconClass="text-blue-300" label="Location" value="Philippines 🇵🇭" />
          <InfoRow icon={Code2} tint="from-emerald-500/30 to-teal-500/30" iconClass="text-emerald-300" label="Role" value="Web Developer · APK Curator" />
          <InfoRow icon={Music} tint="from-rose-500/30 to-pink-500/30" iconClass="text-rose-300" label="Hobbies" value="Guitar · Coding · Music" />
          <InfoRow icon={Calendar} tint="from-amber-500/30 to-orange-500/30" iconClass="text-amber-300" label="Member Since" value="2026" />
        </div>
      </section>

      {/* ───── Connect ───── */}
      <section className="mt-3 reveal">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2 px-1">
          <Share2 className="w-3.5 h-3.5" /> Connect
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <LinkRow href={portfolio} icon={Globe} tint="from-purple-500 to-blue-500" label="Portfolio" sub={portfolio.replace(/^https?:\/\//, "")} />
          <LinkRow href="https://www.facebook.com/jm.born67" icon={Facebook} tint="from-blue-500 to-blue-700" label="Facebook" sub="@jm.born67" />
          <LinkRow href="/contact" internal icon={MessageCircle} tint="from-emerald-500 to-teal-500" label="Message" sub="Send a message" />
          <LinkRow href="/about" internal icon={Info} tint="from-amber-500 to-orange-500" label="About Site" sub="Learn more" />
        </div>
      </section>

      {/* ───── Achievements ───── */}
      <section className="mt-3 reveal pb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2 px-1">
          <Sparkles className="w-3.5 h-3.5" /> Achievements
        </h3>
        <div className="grid grid-cols-5 gap-2">
          <Achievement icon={Sparkles} color="text-yellow-400" label="Verified" delay={0} />
          <Achievement icon={Check} color="text-blue-400" label="Curator" delay={0.5} />
          <Achievement icon={TrendingUp} color="text-emerald-400" label="Trending" delay={1} />
          <Achievement icon={Heart} color="text-rose-400" label="Loved" delay={1.5} />
          <Achievement icon={Zap} color="text-amber-400" label="Fast" delay={2} />
        </div>
      </section>
    </>
  );
};

const StatCard = ({ label, value, delay }: { label: string; value: string; delay: number }) => (
  <div className="glass rounded-2xl py-3 text-center tap-press animate-slide-up-bounce" style={{ animationDelay: `${delay}ms` }}>
    <p className="text-base font-bold text-gradient">{value}</p>
    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
  </div>
);

const InfoRow = ({ icon: Icon, tint, iconClass, label, value }: any) => (
  <div className="flex items-center gap-3 text-sm">
    <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tint} flex items-center justify-center shrink-0`}>
      <Icon className={`w-4 h-4 ${iconClass}`} />
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-medium truncate">{value}</p>
    </div>
  </div>
);

const LinkRow = ({ href, internal, icon: Icon, tint, label, sub }: any) => {
  const Tag: any = internal ? Link : "a";
  const props = internal ? { to: href } : { href, target: "_blank", rel: "noopener noreferrer" };
  return (
    <Tag {...props} className="glass rounded-2xl p-3 tap-press flex items-center gap-2.5 group">
      <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tint} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{label}</p>
        <p className="text-[10px] text-muted-foreground truncate">{sub}</p>
      </div>
      {!internal && <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 group-hover:text-foreground transition" />}
    </Tag>
  );
};

const Achievement = ({ icon: Icon, color, label, delay }: any) => (
  <div className="glass rounded-2xl p-3 text-center tap-press">
    <Icon className={`w-5 h-5 mx-auto ${color} animate-float`} style={{ animationDelay: `${delay}s` }} />
    <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
  </div>
);

// ─── Sidebar drawer menu ──────────────────────────────────────────────
const ProfileMenu = ({
  open, onClose, isAdmin, signedIn, onSignOut,
}: {
  open: boolean; onClose: () => void; isAdmin: boolean; signedIn: boolean; onSignOut: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-[88%] max-w-sm glass-strong p-5 overflow-y-auto animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gradient">Menu</h3>
          <button onClick={onClose} className="liquid-btn w-9 h-9 inline-flex items-center justify-center text-white" aria-label="Close menu">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-2">
          <MenuItem to="/" icon={Sparkles} label="Home" onClick={onClose} />
          <MenuItem to="/about" icon={Info} label="About" onClick={onClose} />
          <MenuItem to="/contact" icon={MessageCircle} label="Contact" onClick={onClose} />

          <p className="text-[10px] uppercase tracking-wider text-muted-foreground pt-3 px-1">Settings</p>
          <MenuItem to="/profile" icon={Palette} label="Theme" onClick={onClose} subtitle="Dark / Light" />
          <MenuItem to="/profile" icon={Bell} label="Notifications" onClick={onClose} subtitle="Coming soon" />
          <MenuItem to="/profile" icon={HelpCircle} label="Help" onClick={onClose} subtitle="Support" />

          {isAdmin && (
            <>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground pt-3 px-1">Admin</p>
              <MenuItem to="/admin" icon={ShieldCheck} label="Admin dashboard" onClick={onClose} subtitle="Manage apps" />
              <MenuItem to="/admin/add" icon={Plus} label="Upload new app" onClick={onClose} subtitle="APK or link" />
            </>
          )}

          <p className="text-[10px] uppercase tracking-wider text-muted-foreground pt-3 px-1">Account</p>
          {signedIn ? (
            <button
              onClick={() => { onSignOut(); onClose(); }}
              className="w-full glass rounded-2xl p-3 tap-press flex items-center gap-3 text-left"
            >
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-white" />
              </span>
              <span className="font-semibold text-sm">Sign out</span>
            </button>
          ) : (
            <MenuItem to="/auth" icon={LogIn} label="Admin sign in" onClick={onClose} subtitle="Admins only" />
          )}
        </nav>
      </aside>
    </div>
  );
};

const MenuItem = ({ to, icon: Icon, label, subtitle, onClick }: any) => (
  <Link to={to} onClick={onClick} className="glass rounded-2xl p-3 tap-press flex items-center gap-3 group">
    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-white" />
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold truncate">{label}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>}
    </div>
  </Link>
);

export default Profile;
