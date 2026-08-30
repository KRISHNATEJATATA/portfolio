"use client";

import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./themed-diagram.module.css";

type DiagramLightboxProps = {
  /** Dark-theme variant, shown under the site's default (dark) theme. */
  src: string;
  /** Light-theme variant, swapped in via CSS when html[data-theme="light"]. */
  lightSrc: string;
  /** What the diagram shows, in a sentence. Read by screen readers. */
  alt: string;
  /** Intrinsic viewBox dimensions; omitted attrs simply mean the browser
      sizes the image after load — fine inside a fixed overlay (no CLS risk). */
  width?: number;
  height?: number;
  /** Project name; becomes the dialog's accessible name. */
  name: string;
  /** Closes the overlay. The trigger keeps focus management (see ThemedDiagram). */
  onClose: () => void;
};

/**
 * Selectors for the Tab focus trap. Deliberately shallow: this dialog's only
 * interactive element is the close button, so a full list is cheap and exact.
 */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Fullscreen viewer for one architecture diagram (see ThemedDiagram, which
 * owns the open state and hands focus back to its trigger on close).
 *
 * Portal target is document.body so no ancestor stacking context (Reveal's
 * transforms, the grain overlay) can bury or clip the overlay; it is only
 * ever mounted from a click handler, i.e. client-side by construction, which
 * is what makes the unconditional createPortal SSR-safe.
 *
 * Scroll lock uses `documentElement.style.overflow = "hidden"` because the
 * site's Lenis instance is created inside a gsap.matchMedia() closure with no
 * global handle to pause (docs/diagram-lightbox-handoff.md §4) — the
 * sanctioned fallback. The scrollbar's width is re-added as padding so the
 * page doesn't jump sideways when the bar disappears, and overflow:hidden
 * (unlike body position:fixed hacks) preserves the scroll position for the
 * close path.
 */
export function DiagramLightbox({
  src,
  lightSrc,
  alt,
  width,
  height,
  name,
  onClose,
}: DiagramLightboxProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus lands on the visible close button on open: an obvious exit is the
  // first thing keyboard and screen reader users need from a modal.
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Esc closes; Tab is trapped inside the overlay while it is open.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const backdrop = backdropRef.current;
      if (!backdrop) return;

      const focusable = Array.from(
        backdrop.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      // Focus outside the overlay (e.g. browser moved it) snaps back inside.
      if (!backdrop.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Scroll lock + scrollbar-width compensation, restored verbatim on close.
  useEffect(() => {
    const { documentElement } = document;
    const previousOverflow = documentElement.style.overflow;
    const previousPaddingRight = documentElement.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      documentElement.style.paddingRight = `${scrollbarWidth}px`;
    }
    documentElement.style.overflow = "hidden";

    return () => {
      documentElement.style.overflow = previousOverflow;
      documentElement.style.paddingRight = previousPaddingRight;
    };
  }, []);

  // Backdrop click closes — but only when the backdrop itself is the target:
  // clicks on the diagram or close button bubble through here too.
  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className={styles.lightboxBackdrop}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${name} architecture diagram`}
        className={styles.lightboxDialog}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> on purpose: SVGs need no optimization and this sidesteps dangerouslyAllowSVG */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          draggable={false}
          className={`${styles.lightboxImage} ${styles.diagramDark}`}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- paired light variant of the same SVG; see themed-diagram.tsx */}
        <img
          src={lightSrc}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          draggable={false}
          className={`${styles.lightboxImage} ${styles.diagramLight}`}
        />
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close diagram"
          className={styles.lightboxClose}
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body,
  );
}
