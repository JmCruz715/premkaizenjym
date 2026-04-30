import { useMemo, useState } from "react";
import { AppCard } from "@/components/AppCard";
import { Header } from "@/components/Header";
import { useApps } from "@/hooks/useApps";
import { Sparkles, Crown, Layers, Check } from "lucide-react";

const Index = () => {
  const { apps, rawRows, featured, loading } = useApps();
  const [tab, setTab] = useState<"all" | "normal" | "premium">("all");

  const list = useMemo(() => {
    if (tab === "all") return apps;
    const slugSet = new Set(rawRows.filter((r) => r.app_type === tab).map((r) => r.slug));
    return apps.filter((a) => slugSet.has(a.id));
  }, [apps, rawRows, tab]);

  const tabs = [
    { key: "all", label: "All", icon: Layers, tint: "from-fuchsia-500 to-blue-500", count: apps.length },
    { key: "normal", label: "Normal", icon: Sparkles, tint: "from-sky-500 to-cyan-500", count: rawRows.filter((r) => r.app_type === "normal").length },
    { key: "premium", label: "Premium", icon: Crown, tint: "from-amber-500 to-orange-500", count: rawRows.filter((r) => r.app_type === "premium").length },
  ] as const;

  return (
    <>
      <Header title="Kaizen Apps" subtitle="Premium mobile apps — unlocked & free." />

      {/* Normal / Premium tabs */}
      <nav aria-label="App type" className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 scrollbar-none">
        {tabs.map(({ key, label, icon: Icon, tint, count }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`shrink-0 tap-press inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                active
                  ? `text-white shadow-lg ring-1 ring-white/20 bg-gradient-to-r ${tint}`
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-white/10"}`}>{count}</span>
            </button>
          );
        })}
      </nav>

      {/* Featured circles */}
      {featured.length > 0 && tab === "all" && (
        <section className="mb-5 reveal">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2 px-1">
            <Crown className="w-3.5 h-3.5" /> Featured
          </h3>
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 scrollbar-none">
            {featured.map((a) => (
              <a key={a.id} href={`/app/${a.id}`} className="shrink-0 tap-press text-center w-16">
                <span className="relative inline-block">
                  <img src={a.icon} alt={a.name} className="w-14 h-14 rounded-2xl object-cover ring-1 ring-white/15 shadow-lg" />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[hsl(140_80%_45%)] ring-2 ring-background flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 text-white" strokeWidth={4} />
                  </span>
                </span>
                <p className="text-[10px] mt-1 truncate font-medium">{a.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {loading && apps.length === 0 ? (
        <p className="text-center text-muted-foreground py-10 text-sm">Loading apps…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      )}
    </>
  );
};

export default Index;
