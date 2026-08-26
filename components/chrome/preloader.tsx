"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";

/**
 * Intro preloader — a one-time brand moment (name mark + thin progress line).
 *
 * Contract with the hero animation (and anything else that cares):
 *   window event "intro:complete" is dispatched EXACTLY ONCE per page load,
 *   in EVERY path:
 *     - normal play        -> after the exit wipe finishes (~1.4s total)
 *     - user skip          -> immediately on click / any keypress / Esc
 *     - returning visitor  -> on mount (sessionStorage snapshot, see
 *                             shouldSkipIntro below)
 *     - reduced motion     -> on mount
 *     - no JS              -> overlay never renders visible (noscript CSS);
 *                             no event, but content is immediately usable.
 *
 * LCP safety: this is an OVERLAY. The real page renders underneath from the
 * first paint — hydration is never gated on it, and the largest contentful
 * element paints on schedule behind the fixed layer.
 *
 * Flash prevention: an inline script rendered just above the overlay runs
 * synchronously during HTML parsing and tags <html data-intro-skip> when the
 * overlay should not show (returning visitor / reduced motion), so the layer
 * is hidden by CSS before any content after it paints. The noscript block in
 * app/layout.tsx hides it when scripting is unavailable entirely.
 *
 * Timing budget: rise-in 0.45s ∥ progress line 0.85s -> hold -> exit wipe
 * 0.42s. Total ≈ 1.42s, under the 1.5s cap.
 */

const SEEN_KEY = "kt-intro-seen";

/** Set the moment "intro:complete" fires (see fireIntroComplete below). */
declare global {
  interface Window {
    __introComplete?: boolean;
  }
}

/** Runs inline, synchronously, before the rest of the document paints. */
const GUARD_SCRIPT = `(function(){try{if(sessionStorage.getItem("${SEEN_KEY}")||window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-intro-skip","")}}catch(e){}})();`;

/**
 * Browser-only decision "should this load skip the intro?". Read through
 * useSyncExternalStore instead of inside an effect: the server snapshot
 * assumes the intro plays (so SSR/hydration markup always matches), and the
 * client corrects right after hydration — while the GUARD_SCRIPT CSS hook
 * above keeps the overlay invisible during that window regardless.
 */
const noopSubscribe = () => () => {};
function shouldSkipIntro(): boolean {
  try {
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem(SEEN_KEY) !== null
    );
  } catch {
    // Storage/media unavailable: treat as first visit, motion allowed.
    return false;
  }
}

export function Preloader() {
  const skipIntro = useSyncExternalStore(noopSubscribe, shouldSkipIntro, () => false);
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const fireIntroComplete = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      // Flag BEFORE dispatch: components whose effects run after ours
      // (e.g. KineticHero deeper in the tree) miss the CustomEvent entirely
      // when the intro is skipped — they poll this flag instead.
      window.__introComplete = true;
      window.dispatchEvent(new CustomEvent("intro:complete"));
    };

    // Returning visit or reduced motion: never show (the CSS guard already
    // hid the overlay before first paint), release the hero now.
    if (skipIntro) {
      fireIntroComplete();
      return;
    }

    const mark = rootRef.current?.querySelector<HTMLElement>(".preloader-mark");
    const fill = rootRef.current?.querySelector<HTMLElement>(".preloader-fill");
    if (!rootRef.current || !mark || !fill) {
      // Markup missing (should not happen): fail open — release the hero on
      // the next frame so the state flip never cascades mid-effect.
      const raf = requestAnimationFrame(() => {
        setGone(true);
        fireIntroComplete();
      });
      return () => cancelAnimationFrame(raf);
    }

    const ctx = gsap.context(() => {
      gsap.set(mark, { opacity: 0, y: 10 });
      gsap.set(fill, { scaleX: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true);
          fireIntroComplete();
        },
      });

      tl.to(mark, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" })
        .to(
          fill,
          { scaleX: 1, duration: 0.85, ease: "power2.inOut" },
          0.15,
        )
        // Persist the flag BEFORE the wipe so a refresh mid-exit still
        // counts as seen and never replays the intro this session.
        .add(() => {
          try {
            sessionStorage.setItem(SEEN_KEY, "");
          } catch {
            /* private mode: intro simply replays next load */
          }
        })
        .to(rootRef.current, { yPercent: -100, duration: 0.42, ease: "power4.inOut" }, 1.0);
    });

    // Skippable: click or any keypress (incl. Esc) dismisses instantly.
    const skip = () => {
      ctx.kill();
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      try {
        sessionStorage.setItem(SEEN_KEY, "");
      } catch {
        /* ignore */
      }
      setGone(true);
      fireIntroComplete();
    };
    window.addEventListener("pointerdown", skip, { passive: true });
    window.addEventListener("keydown", skip);

    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      ctx.revert();
    };
  }, [skipIntro]);

  if (gone || skipIntro) return null;

  return (
    <>
      {/* Pre-hydration guard: hide the overlay before first paint when the
          intro should not play at all (returning visitor / reduced motion). */}
      <script dangerouslySetInnerHTML={{ __html: GUARD_SCRIPT }} />
      <div
        ref={rootRef}
        aria-hidden="true"
        className="preloader"
        data-testid="preloader"
      >
        <div className="preloader-inner">
          <span className="preloader-mark font-display text-lg font-semibold tracking-display text-ink">
            Krishna Teja
          </span>
          <span className="preloader-line">
            <span className="preloader-fill" />
          </span>
        </div>
      </div>
    </>
  );
}
