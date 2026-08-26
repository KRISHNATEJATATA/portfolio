"use client";

/**
 * Film-grain overlay — the site's texture layer.
 *
 * A single fixed, pointer-events-none element tiled with an inline SVG
 * feTurbulence noise texture (desaturated), blended over the page at ~3.5%
 * opacity. Static by design: no rAF loop, no repaint cost beyond the initial
 * composite. It sits ABOVE page content but BELOW nav / preloader / cursor
 * (see the z-scale comment in app/layout.tsx).
 *
 * Degrades to nothing under `prefers-reduced-motion` is unnecessary (it never
 * animates); it is purely decorative, so it is aria-hidden and conveys no
 * information available nowhere else.
 */
export function GrainOverlay() {
  return <div aria-hidden="true" className="grain-overlay" />;
}
