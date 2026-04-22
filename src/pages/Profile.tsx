import { Facebook, MessageCircle, Info, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import kaizen from "@/assets/kaizen.jpg";

const Profile = () => {
  return (
    <>
      <Header title="Profile" subtitle="Meet the creator of Kaizen Apps." />

      <section className="glass-strong rounded-3xl p-6 text-center animate-fade-up">
        <div className="relative w-28 h-28 mx-auto">
          <div className="absolute inset-0 rounded-full p-[3px] bg-[image:var(--gradient-brand)]">
            <img
              src={kaizen}
              alt="Kaizen avatar"
              width={112}
              height={112}
              className="w-full h-full rounded-full object-cover bg-background"
            />
          </div>
          {/* Online sensor */}
          <span
            aria-label="Online"
            title="Online"
            className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[hsl(140_80%_45%)] ring-4 ring-background pulse-dot"
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          <h2 className="text-2xl font-bold">Kaizen</h2>
          <BadgeCheck className="w-6 h-6 fill-[hsl(210_90%_55%)] text-white" aria-label="Verified" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Creator · Developer · APK curator</p>

        <p className="text-sm text-muted-foreground mt-4 max-w-sm mx-auto">
          Hey, I'm Kaizen — the developer behind Kaizen Apps. I curate and share premium Android apps so anyone
          can enjoy them for free. Built with love, gradients, and a lot of liquid glass.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-5">
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

        <div className="grid grid-cols-3 gap-3 mt-6 text-center">
          <div className="glass rounded-2xl py-3 reveal tap-press">
            <p className="text-lg font-bold text-gradient">8</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Apps</p>
          </div>
          <div className="glass rounded-2xl py-3 reveal tap-press" style={{ transitionDelay: "80ms" }}>
            <p className="text-lg font-bold text-gradient">62M+</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Downloads</p>
          </div>
          <div className="glass rounded-2xl py-3 reveal tap-press" style={{ transitionDelay: "160ms" }}>
            <p className="text-lg font-bold text-gradient">4.8★</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rating</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
