import { Download, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { App } from "@/data/apps";

export const AppCard = ({ app, index = 0 }: { app: App; index?: number }) => {
  return (
    <article
      className="glass rounded-3xl p-4 flex items-center gap-4 animate-fade-up hover:scale-[1.01] transition-transform"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link to={`/app/${app.id}`} className="shrink-0">
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
        <Link to={`/app/${app.id}`} className="block">
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
      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Download ${app.name}`}
        className="liquid-btn liquid-btn-brand px-4 py-2 text-sm font-semibold text-white inline-flex items-center gap-1.5 shrink-0"
      >
        <Download className="w-4 h-4" />
        Get
      </a>
    </article>
  );
};
