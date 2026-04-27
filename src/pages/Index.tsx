import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apps } from "@/data/apps";
import { AppCard } from "@/components/AppCard";
import { Header } from "@/components/Header";
import { useUserApps } from "@/hooks/useUserApps";
import {
  Info,
  MessageCircle,
  Sparkles,
  Film,
  Music,
  Video,
  Gamepad2,
  Camera,
  MessageSquare,
  Wrench,
  Layers,
} from "lucide-react";

// Maps a raw category string from data into a friendly display group.
const groupOf = (cat: string): string => {
  const c = cat.toLowerCase();
  if (c.includes("stream")) return "Streaming";
  if (c.includes("music")) return "Music";
  if (c.includes("video editor") || c.includes("ai")) return "Video Editing";
  if (c.includes("video")) return "Video";
  if (c.includes("game") || c.includes("gaming")) return "Games";
  if (c.includes("photo")) return "Photography";
  if (c.includes("commun") || c.includes("social")) return "Socials";
  if (c.includes("tool")) return "Tools";
  return "Other";
};

const groupMeta: Record<string, { icon: any; tint: string }> = {
  All: { icon: Layers, tint: "from-fuchsia-500 to-blue-500" },
  Streaming: { icon: Film, tint: "from-rose-500 to-orange-500" },
  Music: { icon: Music, tint: "from-emerald-500 to-green-600" },
  "Video Editing": { icon: Video, tint: "from-pink-500 to-indigo-500" },
  Video: { icon: Video, tint: "from-red-500 to-rose-500" },
  Games: { icon: Gamepad2, tint: "from-violet-500 to-blue-600" },
  Photography: { icon: Camera, tint: "from-pink-500 to-yellow-500" },
  Socials: { icon: MessageSquare, tint: "from-sky-500 to-indigo-500" },
  Tools: { icon: Wrench, tint: "from-blue-500 to-cyan-500" },
  Other: { icon: Sparkles, tint: "from-fuchsia-500 to-purple-600" },
};

const Index = () => {
  const { userApps } = useUserApps();
  const all = useMemo(() => [...userApps, ...apps], [userApps]);

  // Build groups dynamically from data so new apps auto-appear in the right list.
  const groups = useMemo(() => {
    const m = new Map<string, typeof all>();
    for (const app of all) {
      const g = groupOf(app.category);
      if (!m.has(g)) m.set(g, []);
      m.get(g)!.push(app);
    }
    // Preferred order — keep the experience consistent
    const order = [
      "Streaming",
      "Games",
      "Music",
      "Video Editing",
      "Video",
      "Socials",
      "Photography",
      "Tools",
      "Other",
    ];
    return order
      .filter((k) => m.has(k))
      .map((k) => [k, m.get(k)!] as const);
  }, [all]);

  const [active, setActive] = useState<string>("All");

  const visibleGroups = active === "All" ? groups : groups.filter(([g]) => g === active);
  const chipKeys = ["All", ...groups.map(([g]) => g)];

  return (
    <>
      <Header title="Kaizen Apps" subtitle="Premium mobile apps — unlocked & free." />

      <section className="glass-strong rounded-3xl p-5 mb-5 relative overflow-hidden animate-fade-up">
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

      {/* Category chip filter */}
      <nav
        aria-label="Categories"
        className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 scrollbar-none snap-x"
      >
        {chipKeys.map((key) => {
          const meta = groupMeta[key] || groupMeta.Other;
          const Icon = meta.icon;
          const isActive = active === key;
          const count = key === "All" ? all.length : groups.find(([g]) => g === key)?.[1].length ?? 0;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`shrink-0 snap-start tap-press inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "text-white shadow-lg ring-1 ring-white/20 bg-gradient-to-r " + meta.tint
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {key}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-white/10"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Grouped category sections */}
      <div className="space-y-7">
        {visibleGroups.map(([groupName, list]) => {
          const meta = groupMeta[groupName] || groupMeta.Other;
          const Icon = meta.icon;
          return (
            <section key={groupName} aria-label={groupName} className="space-y-3 reveal">
              <div className="flex items-center justify-between mb-1 px-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-xl bg-gradient-to-br ${meta.tint} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </span>
                  <h2 className="text-lg font-semibold">{groupName}</h2>
                </div>
                <span className="text-xs text-muted-foreground">{list.length} apps</span>
              </div>
              {list.map((app, i) => (
                <AppCard key={app.id} app={app} index={i} />
              ))}
            </section>
          );
        })}
      </div>
    </>
  );
};

export default Index;
