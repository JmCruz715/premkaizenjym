import { useEffect, useState } from "react";
import { KaizenLogo } from "./KaizenLogo";

/**
 * Netflix-style intro: the Kaizen logo squircle zooms in over a black
 * background with a sweeping spotlight, then morphs/flies up to its
 * final position. Plays once per session.
 */
export const SplashIntro = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("kaizen-intro-played");
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("kaizen-intro-played", "1");
    const t = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden splash-root">
      <div className="absolute inset-0 splash-spotlight" />
      <div className="absolute inset-0 splash-glow" />
      <div className="splash-particles" />

      <div className="relative flex flex-col items-center">
        {/* Big animated Kaizen logo */}
        <div className="splash-logo-wrap">
          <KaizenLogo size={220} className="splash-logo" />
        </div>
        <div className="splash-bar" />
        <div className="splash-tag">KAIZEN APPS</div>
      </div>
    </div>
  );
};
