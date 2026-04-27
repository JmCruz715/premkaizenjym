import { Facebook, MessageCircle, Info, BadgeCheck, Sparkles, TrendingUp } from "lucide-react";
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

      <section className="glass-strong rounded-3xl p-6 text-center animate-fade-up relative overflow-hidden">
        {/* decorative gradient blobs */}
        <div className="absolute -top-20 -left-16 w-56 h-56 rounded-full bg-gradient-to-br from-fuchsia-500 to-blue-500 opacity-25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 opacity-20 blur-3xl pointer-events-none" />

        <div className="relative w-28 h-28 mx-auto">
          <div className="absolute inset-0 rounded-full p-[3px] bg-[image:var(--gradient-brand)] animate-pop-in">
            <img
              src={kaizen}
              alt="Kaizen avatar"
              width={112}
              height={112}
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
          <h2 className="text-2xl font-bold">Kaizen</h2>
          <BadgeCheck className="w-6 h-6 fill-[hsl(210_90%_55%)] text-white" aria-label="Verified" />
        </div>
        <p className="text-xs text-muted-foreground mt-1 relative">Creator · Developer · APK curator</p>

        <p className="text-sm text-muted-foreground mt-4 max-w-sm mx-auto relative">
          Hey, I'm Kaizen — the developer behind Kaizen Apps. I curate and share premium Android apps so anyone
          can enjoy them for free. Built with love, gradients, and a lot of liquid glass.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-5 relative">
          <a
            href="https://www.facebook.com/jm.born67"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-btn liquid-btn-brand tap-press px-4 py-2 text-sm font-semibold text-white inline-flex items-center gap-2"
          >
            <Facebook className="w-4 h-4" /> Facebook
          </a>
          <Link
            to="/contact"
            className="liquid-btn tap-press px-4 py-2 text-sm font-semibold text-white inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Message
          </Link>
          <Link
            to="/about"
            className="liquid-btn tap-press px-4 py-2 text-sm font-semibold text-white inline-flex items-center gap-2"
          >
            <Info className="w-4 h-4" /> About site
          </Link>
        </div>

        {/* Live stats — auto-updating */}
        <div className="grid grid-cols-4 gap-2 mt-6 text-center relative">
          <div className="glass rounded-2xl py-3 reveal tap-press">
            <p className="text-lg font-bold text-gradient">{totalApps}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Apps</p>
          </div>
          <div className="glass rounded-2xl py-3 reveal tap-press" style={{ transitionDelay: "60ms" }}>
            <p className="text-lg font-bold text-gradient">{fmt(totalInstalls)}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Installs</p>
          </div>
          <div className="glass rounded-2xl py-3 reveal tap-press" style={{ transitionDelay: "120ms" }}>
            <p className="text-lg font-bold text-gradient">{fmt(totalViews)}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Views</p>
          </div>
          <div className="glass rounded-2xl py-3 reveal tap-press" style={{ transitionDelay: "180ms" }}>
            <p className="text-lg font-bold text-gradient">{avgRating}★</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rating</p>
          </div>
        </div>

        {/* Live tag */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-[10px] uppercase tracking-wider text-muted-foreground relative">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(140_80%_45%)] pulse-dot" />
          <TrendingUp className="w-3 h-3" /> Live tracking
        </div>
      </section>

      {/* Achievement strip */}
      <section className="grid grid-cols-3 gap-2 mt-3 reveal">
        <div className="glass rounded-2xl p-3 text-center">
          <Sparkles className="w-4 h-4 mx-auto text-yellow-400" />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Verified</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <BadgeCheck className="w-4 h-4 mx-auto text-blue-400" />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Curator</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <TrendingUp className="w-4 h-4 mx-auto text-emerald-400" />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Trending</p>
        </div>
      </section>
    </>
  );
};

export default Profile;
