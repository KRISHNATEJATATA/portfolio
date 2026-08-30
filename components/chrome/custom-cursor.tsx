"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Custom cursor — amber dot with a trailing ring, desktop (fine pointer) only.
 *
 * Motion purpose: feedback. The ring's scale-up over interactive elements
 * affirms "this is clickable" before the click, and the press pulse confirms
 * the click itself. It never conveys information that is not available
 * elsewhere: keyboard focus outlines in globals.css remain untouched.
 *
 * Mechanics:
 *   - One `gsap.matchMedia()` context guards on
 *     `(pointer: fine) and (prefers-reduced-motion: no-preference)`. Outside
 *     that context the elements stay at opacity 0 and the native cursor is
 *     never hidden — touch devices and reduced-motion users are unaffected.
 *   - Movement uses `gsap.quickTo` (transform-only) on the shared gsap.ticker
 *     clock owned by MotionProvider; the dot tracks fast, the ring trails
 *     slower for the follow effect.
 *   - `html.has-custom-cursor` (toggled by this component, matched by CSS in
 *     globals.css) hides the native cursor site-wide EXCEPT form fields,
 *     which keep their native text caret.
 */
const INTERACTIVE_SELECTOR =
  'a[href], button, [role="button"], summary, label, input[type="submit"], input[type="button"], [data-cursor="hover"]';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        document.documentElement.classList.add("has-custom-cursor");

        // Center both elements on the pointer via negative margins (CSS);
        // transforms are reserved exclusively for movement + scale.
        gsap.set([dot, ring], { x: -100, y: -100 }); // parked off-screen

        const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
        const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
        const ringX = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
        const ringY = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });

        let shown = false;
        let hoveringInteractive = false;
        let pressed = false;
        let lastX = -100;
        let lastY = -100;
        let releaseRecheck = 0;

        // Single source of truth for the hover scale. Guarded so repeated
        // mouseover events while crossing children of the same interactive
        // don't restart the tween (which would make the ring pulse).
        const setHoverState = (hovering: boolean) => {
          if (hovering === hoveringInteractive) return;
          hoveringInteractive = hovering;
          gsap.to(ring, { scale: hovering ? 1.9 : 1, duration: 0.25, ease: "power3.out" });
          const dotScale = pressed ? 0.35 : hovering ? 0.5 : 1;
          gsap.to(dot, { scale: dotScale, duration: 0.25, ease: "power3.out" });
        };

        const debugEl = document.getElementById("cursor-debug");
        const updateDebug = () => {
          if (!debugEl) return;
          const r = gsap.getProperty(ring, "scale") as number;
          const d = gsap.getProperty(dot, "scale") as number;
          debugEl.textContent = `ring:${r.toFixed(2)} dot:${d.toFixed(2)} hov:${hoveringInteractive}`;
        };
        const tickerFn = () => updateDebug();
        gsap.ticker.add(tickerFn);

        const onPointerMove = (event: PointerEvent) => {
          lastX = event.clientX;
          lastY = event.clientY;
          if (!shown) {
            shown = true;
            // First move: snap to the pointer, then fade in. Prevents the
            // cursor pair flashing in the viewport corner on load.
            gsap.set([dot, ring], { x: event.clientX, y: event.clientY });
            gsap.to([dot, ring], { opacity: 1, duration: 0.2, ease: "power2.out" });
          }
          dotX(event.clientX);
          dotY(event.clientY);
          ringX(event.clientX);
          ringY(event.clientY);
        };

        const onOver = (event: MouseEvent) => {
          if (!(event.target instanceof Element)) return;
          // `mouseover` fires on every element boundary crossing, so it is the
          // authoritative sync point: it both enlarges over interactives AND
          // resets when moving to a non-interactive. This fixes the stuck
          // hover when `mouseout` is missed (e.g. the hovered element is
          // removed from the DOM by a click — navigation, menu close, card
          // unmount — so its `mouseout` never fires).
          setHoverState(Boolean(event.target.closest(INTERACTIVE_SELECTOR)));
        };

        const onOut = (event: MouseEvent) => {
          if (!(event.target instanceof Element)) return;
          const leaving = event.target.closest(INTERACTIVE_SELECTOR);
          if (!leaving) return;
          // Only reset if the pointer is leaving the interactive for somewhere
          // OUTSIDE it. `mouseover`/`mouseout` fire on every child transition,
          // so without this guard the ring would flicker back to scale 1 every
          // time the cursor crossed an icon inside a link, then immediately
          // re-enlarge on the next sibling's `mouseover` — and in practice the
          // `mouseout` from the old child often arrives AFTER the `mouseover`
          // from the new one, leaving the ring stuck at scale 1.
          const entering =
            event.relatedTarget instanceof Element
              ? event.relatedTarget.closest(INTERACTIVE_SELECTOR)
              : null;
          if (entering && (entering === leaving || entering.contains(leaving) || leaving.contains(entering))) {
            return;
          }
          setHoverState(false);
        };

        const onPress = () => {
          pressed = true;
          gsap.to(dot, { scale: 0.35, duration: 0.12, ease: "power2.out" });
        };

        const onPressRelease = () => {
          pressed = false;
          // Recompute from the element actually under the pointer instead of
          // trusting the cached flag: clicks often mutate the DOM (page swap,
          // menu close), so the cached state can be stale.
          const recheck = () => {
            const el = document.elementFromPoint(lastX, lastY);
            setHoverState(Boolean(el?.closest(INTERACTIVE_SELECTOR)));
          };
          recheck();
          // A click can also swap the DOM slightly AFTER pointerup (React
          // commit, route transition). Re-check twice so a stationary pointer
          // over newly-rendered (or removed) content still resolves to the
          // correct scale — the second pass covers slower route transitions
          // that haven't committed by the first one.
          window.clearTimeout(releaseRecheck);
          releaseRecheck = window.setTimeout(recheck, 50);
          window.setTimeout(recheck, 300);
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("mouseover", onOver, { passive: true });
        window.addEventListener("mouseout", onOut, { passive: true });
        window.addEventListener("pointerdown", onPress, { passive: true });
        window.addEventListener("pointerup", onPressRelease, { passive: true });

        return () => {
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("mouseover", onOver);
          window.removeEventListener("mouseout", onOut);
          window.removeEventListener("pointerdown", onPress);
          window.removeEventListener("pointerup", onPressRelease);
          window.clearTimeout(releaseRecheck);
          document.documentElement.classList.remove("has-custom-cursor");
          shown = false;
          hoveringInteractive = false;
          pressed = false;
        };
      },
    );

    return () => mm.revert();
  }, []);

return (
      <>
        <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
        <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
      </>
    );
}
