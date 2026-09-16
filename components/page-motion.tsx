"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content is always visible without animation support. */
export function PageMotion() {
  const path = usePathname();

  useEffect(() => {
    if (path.startsWith("/admin") || !("IntersectionObserver" in window))
      return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const elements = document.querySelectorAll<HTMLElement>(
      "main .section-heading, main .category-card, main .editorial-copy, main .order-steps > div, main .delivery-banner, main .resource-card, main .about-grid > div, main .benefit-grid > article, main .support-panel",
    );
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          // Do not animate above-the-fold content, focused controls, or restored scroll positions.
          if (
            preference.matches ||
            entry.target.contains(document.activeElement)
          )
            return;
          const animation = entry.target.animate(
            [
              { opacity: 0.65, translate: "0 8px" },
              { opacity: 1, translate: "0 0" },
            ],
            { duration: 360, easing: "cubic-bezier(.22,1,.36,1)" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight)
        observer.observe(element);
    });
    const stop = () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    preference.addEventListener("change", stop);
    return () => {
      stop();
      preference.removeEventListener("change", stop);
    };
  }, [path]);

  return null;
}
