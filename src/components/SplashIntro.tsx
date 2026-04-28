import { useEffect, useState } from "react";

/**
 * Netflix-style intro: a giant K (Kaizen) zooms in with a shimmering
 * brand gradient, then explodes outward and fades. Plays once per
 * browser session so it doesn't get annoying.
 */
export const SplashIntro = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("kaizen-intro-played");
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("kaizen-intro-played", "1");
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden splash-root">
      {/* sweeping spotlight */}
      <div className="absolute inset-0 splash-spotlight" />
      {/* radial brand glow */}
      <div className="absolute inset-0 splash-glow" />

      {/* The K */}
      <div className="relative">
        <span className="splash-letter text-[42vw] sm:text-[28vw] md:text-[22vw] lg:text-[18vw] font-black leading-none tracking-tighter select-none">
          K
        </span>
        {/* underline brand bar */}
        <div className="splash-bar" />
        <div className="splash-tag">KAIZEN APPS</div>
      </div>
    </div>
  );
};
