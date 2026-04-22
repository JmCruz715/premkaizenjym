import { Download, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { App } from "@/data/apps";
import { DONATION_URL } from "@/data/donation";

export const AppCard = ({ app, index = 0 }: { app: App; index?: number }) => {
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
          <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {app.rating}
            </span>
            <span>{app.size}</span>
            <span className="truncate">{app.category}</span>
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Download ${app.name}`}
          className="liquid-btn liquid-btn-brand tap-press px-3.5 py-2 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Get
        </a>
        <a
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Donate to support ${app.name}`}
          className="liquid-btn tap-press px-3.5 py-2 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"
        >
          <Heart className="w-3.5 h-3.5 fill-[hsl(350_90%_60%)] text-[hsl(350_90%_60%)]" />
          Donate
        </a>
      </div>
    </article>
  );
};
