import { useEffect, useState } from "react";

/**
 * Real Netflix-style intro: huge red "KAIZEN" wordmark zooms in on a black
 * background with the iconic glow + spotlight, then fades. Plays once per
 * session.
 */
export const SplashIntro = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("kaizen-intro-played");
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("kaizen-intro-played", "1");
    const t = setTimeout(() => setShow(false), 3800);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden splash-root">
      <div className="absolute inset-0 splash-spotlight" />
      <div className="absolute inset-0 splash-glow" />
      <div className="splash-particles" />

      <div className="relative flex flex-col items-center px-6">
        <h1 className="splash-wordmark" aria-label="KAIZEN">
          KAIZEN
        </h1>
        <div className="splash-bar" />
        <div className="splash-tag">A P P S</div>
      </div>
    </div>
  );
};
