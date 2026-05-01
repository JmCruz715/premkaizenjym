import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { SplashIntro } from "./SplashIntro";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export const Layout = () => {
  const location = useLocation();
  useScrollReveal();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const t = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.in-view)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("in-view");
      });
    }, 30);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <>
      <SplashIntro />
      <div className="relative min-h-screen pb-28">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-[hsl(350_90%_55%/0.25)] blur-3xl animate-blob" />
          <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-[hsl(220_95%_55%/0.25)] blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
          <div className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-[hsl(280_90%_55%/0.30)] blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
        </div>
        {/* Responsive: phone (max 2xl base), tablet (~3xl), desktop wider */}
        {/* iPad-portrait sized container (~820px) */}
        <main
          key={location.pathname}
          className="max-w-[820px] mx-auto px-4 sm:px-6 pt-6 animate-fade-up"
        >
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </>
  );
};
