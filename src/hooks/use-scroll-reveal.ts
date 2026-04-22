import { useEffect } from "react";

/**
 * Adds the `in-view` class to any element with the `.reveal` class
 * once it scrolls into the viewport. Idempotent; safe to call on every page.
 */
export const useScrollReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.in-view)");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};
