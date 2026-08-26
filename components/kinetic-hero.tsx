"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./kinetic-hero.module.css";

type KineticHeroProps = {
  /** Headline lines, top to bottom. `hl` adds the amber highlighter bar. */
  nameLines: { text: string; hl?: boolean }[];
  tagline: string;
  /** Call-to-action buttons, rendered as the final rising block. */
  children: React.ReactNode;
};

/** Set by the preloader the moment "intro:complete" fires. */
declare global {
  interface Window {
    __introComplete?: boolean;
  }
}

/**
 * Kinetic hero entrance.
 *
 * Hand-rolled split: each headline line is wrapped in an overflow-hidden
 * mask and its words/characters in inline-block spans (no SplitText plugin).
 * GSAP then plays one timeline on the site's shared gsap.ticker clock:
 *
 *   line 1 chars -> line 2 chars -> tagline fade-rise -> CTAs rise
 *   (total <= 900ms, power4/power3.out)
 *
 * Intro contract — the animation starts on whichever happens first:
 *   1. `window` CustomEvent "intro:complete" (dispatched by the preloader),
 *   2. a defensive 3000ms fallback timer, so the hero can never stay hidden
 *      if the event never arrives.
 *
 * Accessibility / degradation:
 *   - `prefers-reduced-motion: reduce`: nothing is registered; the CSS
 *     module's media query renders the hero fully visible instantly.
 *   - No JavaScript: the <noscript> override rendered next to this component
 *     clears the pre-hydration hidden states.
 *   - Screen readers get the intact headline via `aria-label`; the split
 *     visual spans are `aria-hidden`.
 *   - Mobile (<768px): collapses to a single fast fade of the whole hero.
 */
export function KineticHero({ nameLines, tagline, children }: KineticHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Reduced motion: the CSS module already shows everything — animate nothing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lines = Array.from(
      root.querySelectorAll<HTMLElement>("[data-kh-line]"),
    );
    const taglineEl = root.querySelector<HTMLElement>("[data-kh-tagline]");
    const ctasEl = root.querySelector<HTMLElement>("[data-kh-ctas]");
    const allChars = root.querySelectorAll<HTMLElement>("[data-kh-char]");
    const allFades = root.querySelectorAll<HTMLElement>("[data-kh-fade]");
    const kinetic =
      window.matchMedia("(min-width: 768px)").matches && lines.length > 0;

    let timeline: gsap.core.Timeline | null = null;
    let started = false;

    const play = () => {
      if (kinetic) {
        // Desktop: masked per-character rise, sequenced line by line.
        // Budget check: last role char ends at 0.08 + 15*0.016 + 0.55 = 0.87s.
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        timeline = tl;
        lines.forEach((line, i) => {
          const lineChars = line.querySelectorAll<HTMLElement>("[data-kh-char]");
          if (lineChars.length === 0) return;
          // `y: 0` matters: the CSS-module initial state uses a PERCENTAGE
          // translate (translate3d(0,120%,0)), which GSAP parses into its
          // pixel `y` channel. `yPercent` is a separate ADDITIVE channel —
          // without zeroing `y`, the baked-in px offset survives the tween
          // and characters stay clipped below their mask forever.
          tl.fromTo(
            lineChars,
            { yPercent: 120, y: 0 },
            { yPercent: 0, y: 0, duration: 0.55, stagger: 0.016 },
            i * 0.08,
          );
        });
        if (taglineEl) {
          tl.fromTo(
            taglineEl,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
            0.32,
          );
        }
        if (ctasEl) {
          tl.fromTo(
            ctasEl,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
            0.42,
          );
        }
      } else {
        // Mobile: clear the split states instantly, then one fast fade.
        // Same px/percent channel trap as the desktop path — zero both.
        gsap.set(allChars, { yPercent: 0, y: 0 });
        gsap.set(allFades, { opacity: 1, y: 0 });
        const tl = gsap.timeline();
        timeline = tl;
        tl.fromTo(
          root,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        );
      }
    };

    const start = () => {
      if (started) return;
      started = true;
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("intro:complete", start);
      play();
    };

    // Whichever fires first wins: preloader event, a completion flag from an
    // intro that finished before this effect ran (skip path — Preloader's
    // effect precedes ours), or the safety timer.
    window.addEventListener("intro:complete", start);
    const fallbackTimer = window.setTimeout(start, 3000);
    if (window.__introComplete) start();

    return () => {
      window.removeEventListener("intro:complete", start);
      window.clearTimeout(fallbackTimer);
      timeline?.kill();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <h1
        aria-label={nameLines.map((line) => line.text).join(" ")}
        className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[1.05] tracking-display"
      >
        {nameLines.map((line, index) => (
          // Overflow-hidden mask; padding/negative margin keep descenders
          // (g, j, y) unclipped once characters settle at translateY(0).
          <span
            key={index}
            className="-mb-[0.12em] block overflow-hidden pb-[0.12em]"
          >
            <span
              data-kh-line
              aria-hidden="true"
              className={`inline-block ${line.hl ? "hl" : ""}`}
            >
              {line.text.split(" ").map((word, wi) => (
                <span key={wi}>
                  {wi > 0 ? " " : null}
                  <span className="inline-block whitespace-nowrap">
                    {[...word].map((char, ci) => (
                      <span
                        key={ci}
                        data-kh-char
                        className={`inline-block ${styles.char}`}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
          </span>
        ))}
      </h1>

      <p
        data-kh-tagline
        data-kh-fade
        className={`mt-8 max-w-xl text-lg text-muted sm:text-xl ${styles.fade}`}
      >
        {tagline}
      </p>

      <div
        data-kh-ctas
        data-kh-fade
        className={`mt-10 flex flex-wrap items-center gap-4 ${styles.fade}`}
      >
        {children}
      </div>
    </div>
  );
}
