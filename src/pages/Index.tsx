import { Link } from "react-router-dom";
import { apps } from "@/data/apps";
import { AppCard } from "@/components/AppCard";
import { Header } from "@/components/Header";
import { useUserApps } from "@/hooks/useUserApps";
import { Info, MessageCircle } from "lucide-react";

const Index = () => {
  const { userApps } = useUserApps();
  const all = [...userApps, ...apps];
  return (
    <>
      <Header title="Kaizen Apps" subtitle="Premium mobile apps — unlocked & free." />

      <section className="glass-strong rounded-3xl p-5 mb-6 relative overflow-hidden animate-fade-up">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[hsl(280_90%_60%/0.45)] blur-2xl" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Featured drop</p>
        <h2 className="text-2xl font-bold mt-1">{all.length} premium apps. Zero cost.</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Hand-picked premium APKs — fully unlocked. Tap any app to learn more, or hit Get to download.
        </p>
        <div className="flex gap-2 mt-4">
          <Link to="/about" className="liquid-btn tap-press px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5">
            <Info className="w-4 h-4" /> About
          </Link>
          <Link to="/contact" className="liquid-btn liquid-btn-brand tap-press px-4 py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" /> Suggest an app
          </Link>
        </div>
      </section>

      <section aria-label="All apps" className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">All apps</h2>
          <span className="text-xs text-muted-foreground">{all.length}</span>
        </div>
        {all.map((app, i) => (
          <AppCard key={app.id} app={app} index={i} />
        ))}
      </section>

    </>
  );
};

export default Index;
