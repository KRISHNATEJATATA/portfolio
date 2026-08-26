"use client";

import { useEffect } from "react";
import gsap from "gsap";
import Lenis from "lenis";

/**
 * Site-wide motion foundation. Mounted once from the root layout.
 *
 * Owns the single animation clock for the whole site:
 *   - Creates one Lenis smooth-scroll instance (only when the user allows
 *     motion) and drives it from `gsap.ticker`, so Lenis and every GSAP
 *     tween share ONE requestAnimationFrame loop instead of two.
 *   - `gsap.matchMedia()` guards setup/teardown: under
 *     `prefers-reduced-motion: reduce` Lenis never initializes, and if the
 *     preference changes mid-session the instance is destroyed live.
 *
 * GSAP core only — no plugins are registered here yet.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ autoRaf: false });

      // gsap.ticker fires `time` in seconds; lenis.raf expects milliseconds.
      const raf = (time: number) => lenis.raf(time * 1000);

      // Per the Lenis + GSAP integration guide: disable lag smoothing so
      // scroll-driven motion never trails behind dropped frames.
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add(raf);

      return () => {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33); // restore GSAP defaults
        lenis.destroy();
      };
    });

    return () => mm.revert();
  }, []);

  return <>{children}</>;
}
