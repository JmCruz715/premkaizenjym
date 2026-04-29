import { useEffect, useState } from "react";

/**
 * Netflix-style intro: a giant red "K" zooms in over a black background
 * with a sweeping spotlight. Plays once per session.
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
      {/* sweeping spotlight */}
      <div className="absolute inset-0 splash-spotlight" />
      {/* radial brand glow */}
      <div className="absolute inset-0 splash-glow" />
      {/* sparkle particles */}
      <div className="splash-particles" />

      {/* The K — huge, bold, Netflix-red */}
      <div className="relative">
        <span className="splash-letter text-[55vw] sm:text-[36vw] md:text-[28vw] lg:text-[22vw] font-black leading-[0.85] tracking-tighter select-none block text-center">
          K
        </span>
        {/* underline brand bar */}
        <div className="splash-bar" />
        <div className="splash-tag">KAIZEN APPS</div>
      </div>
    </div>
  );
};
