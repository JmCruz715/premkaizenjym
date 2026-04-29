import { Facebook, MessageCircle, Info, Check, Sparkles, TrendingUp, Heart, Zap, Globe, MapPin, Calendar, Code2, Music, ExternalLink, Share2, Flame, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { apps } from "@/data/apps";
import { useAppStats } from "@/hooks/useAppStats";
import kaizen from "@/assets/kaizen.jpg";

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

const Profile = () => {
  const { installs: totalInstalls, views: totalViews } = useAppStats();
  const totalApps = apps.length;
  const avgRating = (
    apps.reduce((s, a) => s + a.rating, 0) / Math.max(1, totalApps)
  ).toFixed(1);

  return (
    <>
      <Header title="Profile" subtitle="Meet the creator of Kaizen Apps." />

      {/* ───── Hero card ───── */}
      <section className="glass-strong rounded-3xl p-6 text-center animate-fade-up relative overflow-hidden">
        <div className="absolute -top-20 -left-16 w-56 h-56 rounded-full bg-gradient-to-br from-fuchsia-500 to-blue-500 opacity-25 blur-3xl pointer-events-none animate-blob" />
        <div className="absolute -bottom-24 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 opacity-20 blur-3xl pointer-events-none animate-blob" style={{ animationDelay: "3s" }} />

        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto animate-float">
          <div className="absolute inset-0 rounded-full p-[3px] bg-[image:var(--gradient-brand)] animate-pop-in">
            <div className="absolute inset-[-6px] rounded-full bg-[conic-gradient(from_0deg,hsl(280_90%_60%/.6),transparent_30%,hsl(220_95%_60%/.6),transparent_70%,hsl(350_90%_60%/.6))] blur-md animate-spin-slow -z-10" />
            <img
              src={kaizen}
              alt="Kaizen avatar"
              width={128}
              height={128}
              className="w-full h-full rounded-full object-cover bg-background"
            />
          </div>
          <span
            aria-label="Online"
            title="Online"
            className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[hsl(140_80%_45%)] ring-4 ring-background pulse-dot"
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 relative">
          <h2 className="text-2xl sm:text-3xl font-bold">Kaizen</h2>
          <span className="verified-badge" aria-label="Verified" title="Verified creator">
            <Check strokeWidth={4} />
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 relative">@jymm · Creator · Developer</p>

        <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto relative leading-relaxed">
          Curating premium Android apps so anyone can enjoy them for free. Built with love, gradients, at konting kape. ☕
        </p>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-2 mt-5 relative max-w-sm mx-auto">
          <a
            href="https://jymmportfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-btn liquid-btn-brand tap-press px-3 py-2.5 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" /> Portfolio
          </a>
          <a
            href="https://www.facebook.com/jm.born67"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-btn tap-press px-3 py-2.5 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"
          >
            <Facebook className="w-3.5 h-3.5" /> Facebook
          </a>
        </div>
      </section>

      {/* ───── Featured drop (moved from home) ───── */}
      <section className="mt-3 reveal">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2 px-1">
          <Flame className="w-3.5 h-3.5" /> Featured Drop
        </h3>
        <div className="glass-strong rounded-3xl p-5 relative overflow-hidden animate-fade-up">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[hsl(280_90%_60%/0.45)] blur-2xl" />
          <div className="absolute -bottom-12 -left-10 w-36 h-36 rounded-full bg-[hsl(350_90%_60%/0.35)] blur-2xl" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground relative">This week's drop</p>
          <h4 className="text-2xl font-bold mt-1 relative">{totalApps} premium apps. Zero cost.</h4>
          <p className="text-sm text-muted-foreground mt-2 max-w-md relative">
            Hand-picked premium APKs — fully unlocked. Browse the catalog and tap any app to learn more, or hit Get to download.
          </p>
          <div className="flex flex-wrap gap-2 mt-4 relative">
            <Link
              to="/"
              className="liquid-btn liquid-btn-brand tap-press px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Browse apps
            </Link>
            <Link
              to="/contact"
              className="liquid-btn tap-press px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" /> Suggest an app
            </Link>
          </div>
        </div>
      </section>
      <section className="mt-3 reveal">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Live Stats
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(140_80%_45%)] pulse-dot" /> Real-time
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="glass rounded-2xl py-3 text-center tap-press animate-slide-up-bounce">
            <p className="text-base font-bold text-gradient">{totalApps}</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Apps</p>
          </div>
          <div className="glass rounded-2xl py-3 text-center tap-press animate-slide-up-bounce" style={{ animationDelay: "80ms" }}>
            <p className="text-base font-bold text-gradient">{fmt(totalInstalls)}</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Installs</p>
          </div>
          <div className="glass rounded-2xl py-3 text-center tap-press animate-slide-up-bounce" style={{ animationDelay: "160ms" }}>
            <p className="text-base font-bold text-gradient">{fmt(totalViews)}</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Views</p>
          </div>
          <div className="glass rounded-2xl py-3 text-center tap-press animate-slide-up-bounce" style={{ animationDelay: "240ms" }}>
            <p className="text-base font-bold text-gradient">{avgRating}★</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Rating</p>
          </div>
        </div>
      </section>

      {/* ───── About / More info ───── */}
      <section className="mt-3 reveal">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2 px-1">
          <Info className="w-3.5 h-3.5" /> About Me
        </h3>
        <div className="glass-strong rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-blue-300" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Location</p>
              <p className="font-medium truncate">Philippines 🇵🇭</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4 text-emerald-300" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Role</p>
              <p className="font-medium truncate">Web Developer · APK Curator</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/30 to-pink-500/30 flex items-center justify-center shrink-0">
              <Music className="w-4 h-4 text-rose-300" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Hobbies</p>
              <p className="font-medium truncate">Guitar · Coding · Music</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-amber-300" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Member Since</p>
              <p className="font-medium truncate">2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Connect / Links ───── */}
      <section className="mt-3 reveal">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2 px-1">
          <Share2 className="w-3.5 h-3.5" /> Connect
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <a
            href="https://jymmportfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-3 tap-press flex items-center gap-2.5 group"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-white" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Portfolio</p>
              <p className="text-[10px] text-muted-foreground truncate">jymmportfolio.vercel.app</p>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 group-hover:text-foreground transition" />
          </a>
          <a
            href="https://www.facebook.com/jm.born67"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-3 tap-press flex items-center gap-2.5 group"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
              <Facebook className="w-4 h-4 text-white" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Facebook</p>
              <p className="text-[10px] text-muted-foreground truncate">@jm.born67</p>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 group-hover:text-foreground transition" />
          </a>
          <Link to="/contact" className="glass rounded-2xl p-3 tap-press flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Message</p>
              <p className="text-[10px] text-muted-foreground truncate">Send a message</p>
            </div>
          </Link>
          <Link to="/about" className="glass rounded-2xl p-3 tap-press flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-white" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">About Site</p>
              <p className="text-[10px] text-muted-foreground truncate">Learn more</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ───── Achievements ───── */}
      <section className="mt-3 reveal">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2 px-1">
          <Sparkles className="w-3.5 h-3.5" /> Achievements
        </h3>
        <div className="grid grid-cols-5 gap-2">
          <div className="glass rounded-2xl p-3 text-center tap-press">
            <Sparkles className="w-5 h-5 mx-auto text-yellow-400 animate-float" />
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">Verified</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center tap-press">
            <Check className="w-5 h-5 mx-auto text-blue-400 animate-float" style={{ animationDelay: "0.5s" }} />
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">Curator</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center tap-press">
            <TrendingUp className="w-5 h-5 mx-auto text-emerald-400 animate-float" style={{ animationDelay: "1s" }} />
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">Trending</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center tap-press">
            <Heart className="w-5 h-5 mx-auto text-rose-400 animate-float" style={{ animationDelay: "1.5s" }} />
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">Loved</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center tap-press">
            <Zap className="w-5 h-5 mx-auto text-amber-400 animate-float" style={{ animationDelay: "2s" }} />
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">Fast</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
