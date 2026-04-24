import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Download, Star } from "lucide-react";
import { findApp } from "@/data/apps";
import { DonateButton } from "@/components/DonateButton";
import { useUserApps } from "@/hooks/useUserApps";
import spotifyShot from "@/assets/screens/spotify.jpg";
import loktvShot from "@/assets/screens/loktv.jpg";
import youtubeShot from "@/assets/screens/youtube.jpg";
import freecineShot from "@/assets/screens/freecine.jpg";
import capcutAvatars from "@/assets/screens/capcut-avatars.webp";
import capcutDialogue from "@/assets/screens/capcut-dialogue.webp";
import capcutStory from "@/assets/screens/capcut-story.webp";
import gamebase1 from "@/assets/screens/gamebase-1.png";
import gamebase2 from "@/assets/screens/gamebase-2.png";
import gamebase3 from "@/assets/screens/gamebase-3.png";

const screenshots: Record<string, string[]> = {
  "spotify-premium": [spotifyShot],
  "deezer-premium": [spotifyShot],
  "loktv": [loktvShot],
  "youtube-premium": [youtubeShot],
  "freecine": [freecineShot],
  "capcut-premium": [capcutAvatars, capcutDialogue, capcutStory],
  "ai-video-generator": [capcutStory, capcutDialogue, capcutAvatars],
  "gamebase": [gamebase1, gamebase2, gamebase3],
};

const AppDetail = () => {
  const { id } = useParams();
  const { userApps, screenshots: userShots, loading } = useUserApps();
  const app = findApp(id || "") || userApps.find((a) => a.id === id);
  const allShots = { ...screenshots, ...userShots };

  if (loading && !app) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        <p className="text-muted-foreground text-sm mt-3">Loading app…</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">App not found.</p>
        <Link to="/" className="liquid-btn liquid-btn-brand inline-block mt-4 px-4 py-2 text-sm font-semibold text-white">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <article className="animate-fade-up">
      <Link
        to="/"
        className="liquid-btn tap-press inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <section className="glass-strong rounded-3xl p-6 relative overflow-hidden">
        <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${app.accent} opacity-40 blur-3xl`} />
        <div className="flex items-center gap-4 relative">
          <img
            src={app.icon}
            alt={`${app.name} icon`}
            width={88}
            height={88}
            className="w-22 h-22 sm:w-24 sm:h-24 rounded-3xl object-cover ring-1 ring-white/15 shadow-xl animate-pop-in"
          />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold">{app.name}</h1>
            <p className="text-xs text-muted-foreground">{app.tagline}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {app.rating}
              </span>
              <span>{app.downloads}</span>
              <span>v{app.version}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="liquid-btn liquid-btn-brand tap-press flex-1 px-5 py-3 text-sm font-semibold text-white inline-flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download · {app.size}
          </a>
          <DonateButton className="px-5 py-3 text-sm" />

        </div>
      </section>

      {allShots[app.id]?.length ? (
        <section className="mt-4 reveal">
          <h2 className="font-semibold mb-3 px-1">Screenshots</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
            {allShots[app.id].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${app.name} screenshot ${i + 1}`}
                loading="lazy"
                className="h-72 w-auto rounded-2xl object-cover ring-1 ring-white/15 shadow-lg snap-start shrink-0 tap-press"
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="glass rounded-3xl p-5 mt-4 reveal">
        <h2 className="font-semibold mb-2">About this app</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{app.description}</p>
      </section>

      <section className="glass rounded-3xl p-5 mt-4 reveal">
        <h2 className="font-semibold mb-3">Premium features</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {app.features.map((f, i) => (
            <li
              key={f}
              className="flex items-start gap-2 text-sm reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="mt-0.5 w-5 h-5 rounded-full bg-[image:var(--gradient-brand)] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-white" />
              </span>
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass rounded-3xl p-5 mt-4 grid grid-cols-3 gap-3 text-center reveal">
        <div className="tap-press">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</p>
          <p className="font-semibold text-sm mt-1">{app.category}</p>
        </div>
        <div className="tap-press">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Size</p>
          <p className="font-semibold text-sm mt-1">{app.size}</p>
        </div>
        <div className="tap-press">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Version</p>
          <p className="font-semibold text-sm mt-1">{app.version}</p>
        </div>
      </section>
    </article>
  );
};

export default AppDetail;
