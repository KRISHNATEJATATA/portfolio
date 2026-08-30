"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn } from "lucide-react";
import { DiagramLightbox } from "@/components/diagram-lightbox";
import styles from "./themed-diagram.module.css";

type ThemedDiagramProps = {
  /** Dark-theme variant, shown under the site's default (dark) theme. */
  src: string;
  /** Light-theme variant, swapped in via CSS when html[data-theme="light"]. */
  lightSrc: string;
  /** What the diagram shows, in a sentence. Read by screen readers. */
  alt: string;
  /**
   * Intrinsic viewBox dimensions of the rendered SVG (from lib/projects.ts,
   * as printed by `npm run diagrams`). They let the browser reserve the exact
   * final height before the file loads — no CLS. Optional on purpose: when a
   * gallery entry predates the dims convention the attributes are simply
   * omitted instead of guessing.
   */
  width?: number;
  height?: number;
  /** Project name; becomes the lightbox dialog's accessible name. */
  name: string;
};

/**
 * Theme-adaptive architecture diagram, clickable through to fullscreen.
 *
 * Renders a dark-styled SVG and its paired light-styled variant and lets CSS
 * pick the visible one — the swap itself stays zero-JS
 * (themed-diagram.module.css). Plain <img>, deliberately not next/image:
 * SVGs need no optimization, and skipping next/image sidesteps its
 * dangerouslyAllowSVG gate entirely.
 *
 * The frame is a real <button>: architecture diagrams are detail-dense at
 * gallery size, so every one of them opens fullscreen via DiagramLightbox.
 * Unlike the raster gallery cards there is no fixed aspect ratio — the
 * width/height attributes carry the SVG's natural viewBox ratio, so the
 * height-auto frame reserves the right space with no CLS and no letterbox.
 */
export function ThemedDiagram({
  src,
  lightSrc,
  alt,
  width,
  height,
  name,
}: ThemedDiagramProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // Hand focus back to the trigger however the lightbox closes (Esc, backdrop
  // click, X button): this cleanup runs on every path that flips `open` back
  // to false, so keyboard users are never dropped at the top of the page.
  // The button element is captured on open — it stays mounted for the
  // lightbox's whole lifetime, so the captured node is the right one.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    return () => {
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="relative block w-full cursor-zoom-in rounded-xl border border-line bg-background"
      >
        <span className="sr-only">Open architecture diagram fullscreen</span>
        {/* Both variants render; themed-diagram.module.css shows exactly one.
            Each carries the full alt on purpose: display:none removes the
            hidden one from the accessibility tree, so screen readers only
            ever hear the variant that is actually on screen. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> on purpose: SVGs need no optimization and this sidesteps dangerouslyAllowSVG */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={`block h-auto w-full ${styles.diagramDark}`}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- paired light variant of the same SVG; see above */}
        <img
          src={lightSrc}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={`block h-auto w-full ${styles.diagramLight}`}
        />
        {/* Corner affordance: signals clickability without stealing clicks or
            polluting the button's accessible name. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-background/85 text-muted backdrop-blur-sm"
        >
          <ZoomIn size={16} aria-hidden="true" />
        </span>
      </button>

      {open && (
        <DiagramLightbox
          src={src}
          lightSrc={lightSrc}
          alt={alt}
          width={width}
          height={height}
          name={name}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
