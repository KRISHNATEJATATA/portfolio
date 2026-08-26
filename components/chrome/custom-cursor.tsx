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

        const onPointerMove = (event: PointerEvent) => {
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
          if (event.target.closest(INTERACTIVE_SELECTOR)) {
            gsap.to(ring, { scale: 1.9, duration: 0.25, ease: "power3.out" });
            gsap.to(dot, { scale: 0.5, duration: 0.25, ease: "power3.out" });
          }
        };

        const onOut = (event: MouseEvent) => {
          if (!(event.target instanceof Element)) return;
          if (event.target.closest(INTERACTIVE_SELECTOR)) {
            gsap.to(ring, { scale: 1, duration: 0.25, ease: "power3.out" });
            gsap.to(dot, { scale: 1, duration: 0.25, ease: "power3.out" });
          }
        };

        const onPress = () => {
          gsap.to(dot, { scale: 0.35, duration: 0.12, ease: "power2.out" });
        };

        const onPressRelease = () => {
          gsap.to(dot, { scale: 1, duration: 0.2, ease: "power2.out" });
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
          document.documentElement.classList.remove("has-custom-cursor");
          shown = false;
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
