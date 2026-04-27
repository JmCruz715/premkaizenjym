import { Download, Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { App } from "@/data/apps";
import { DonateButton } from "./DonateButton";
import { triggerDownload } from "@/lib/download";
import { useAppStats } from "@/hooks/useAppStats";

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

export const AppCard = ({ app, index = 0 }: { app: App; index?: number }) => {
  const { installs, views } = useAppStats(app.id);
  return (
    <article
      className="reveal ripple glass rounded-3xl p-4 flex items-center gap-4 hover:scale-[1.015] active:scale-[0.985] transition-transform duration-200"
      style={{ transitionDelay: `${Math.min(index * 40, 240)}ms` }}
      onPointerDown={(e) => {
        const t = e.currentTarget as HTMLElement;
        const r = t.getBoundingClientRect();
        t.style.setProperty("--rx", `${e.clientX - r.left}px`);
        t.style.setProperty("--ry", `${e.clientY - r.top}px`);
      }}
    >
      <Link to={`/app/${app.id}`} className="shrink-0 tap-press">
        <img
          src={app.icon}
          alt={`${app.name} icon`}
          loading="lazy"
          width={64}
          height={64}
          className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/15 shadow-lg"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/app/${app.id}`} className="block tap-press">
          <h3 className="font-semibold text-foreground truncate">{app.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{app.tagline}</p>
          <div className="flex items-center gap-2.5 mt-1 text-[11px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {app.rating}
            </span>
            <span className="flex items-center gap-1" title="Installs">
              <Download className="w-3 h-3" /> {fmt(installs)}
            </span>
            <span className="flex items-center gap-1" title="Views">
              <Eye className="w-3 h-3" /> {fmt(views)}
            </span>
            <span className="truncate opacity-70">{app.category}</span>
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            triggerDownload(app.url, `${app.name}.apk`, app.id);
          }}
          aria-label={`Download ${app.name}`}
          className="liquid-btn liquid-btn-brand tap-press px-3.5 py-2 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Get
        </a>
        <DonateButton className="px-3.5 py-2 text-xs font-semibold" />
      </div>
    </article>
  );
};
