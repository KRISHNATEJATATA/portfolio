"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
};

/**
 * Scroll-reveal wrapper: fades content in with a slight rise and blur-out,
 * triggered once when it enters the viewport.
 *
 * GSAP animates opacity / transform / filter on the site's single shared
 * `gsap.ticker` clock (set up by `MotionProvider`); a plain
 * IntersectionObserver remains the viewport trigger — ScrollTrigger is
 * intentionally not used. The initial hidden state lives in the `.reveal`
 * CSS class so content is hidden before hydration and fully visible without
 * JavaScript (see the noscript override in `app/layout.tsx`).
 *
 * Under `prefers-reduced-motion: reduce` nothing is registered: the
 * `gsap.matchMedia()` context never runs and the CSS reduced-motion block
 * renders content instantly visible.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Start values are read from the `.reveal` CSS state on first render:
      // opacity 0 -> 1, translateY(16px) -> 0, blur(6px) -> 0.
      const tween = gsap.to(element, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.48,
        ease: "power2.out",
        delay: delay / 1000,
        paused: true,
      });

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
              tween.play();
            }
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className ?? ""}`}>
      {children}
    </div>
  );
}
