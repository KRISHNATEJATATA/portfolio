"use client";

import { useCallback, useReducer, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Light/dark theme toggle — the only UI that writes the theme.
 *
 * Mechanism: the theme lives entirely on <html data-theme="light|dark">;
 * CSS token overrides in app/globals.css do the rest. This component flips
 * the attribute, persists the explicit choice to localStorage("theme"),
 * and re-synchronizes the media-scoped theme-color metas (see the viewport
 * export in app/layout.tsx). The pre-paint boot script in layout.tsx owns
 * the initial value; this button only ever runs post-hydration.
 *
 * Hydration strategy: the rendered icon/label READS the <html> attribute
 * through useSyncExternalStore — same contract as the preloader's skip-intro
 * check. The server snapshot assumes "dark" (the SSR default attribute), so
 * server HTML and first client render always match; on the client the
 * snapshot reflects whatever the boot script actually resolved, correcting
 * within the first commit without an effect or a cascading render. Clicking
 * mutates the attribute directly (it IS the store), then forces one re-render
 * so the snapshot is re-read.
 *
 * Accessibility: aria-label announces the ACTION ("Switch to light theme"),
 * not the state, so screen reader users hear what clicking will do. The
 * focus ring comes from the global :focus-visible rule in globals.css — no
 * local outline overrides. Padding + negative margin mirror the sibling
 * social icons: 18px glyph + 2×8px padding = 34px pointer target, clearing
 * WCAG 2.2 Target Size Minimum (24px) without shifting the nav layout.
 *
 * Reduced motion: switching is a bare attribute change — an instant repaint
 * by design. No transitions are added on <html>/<body>, and none exist in
 * globals.css, so themes never cross-fade.
 */

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Browser-chrome colors per theme. MUST stay in sync with the `viewport`
 * export (themeColor) in app/layout.tsx and the values baked into
 * THEME_BOOT_SCRIPT there.
 */
const THEME_COLOR: Record<Theme, string> = {
  light: "#f7f5f0",
  dark: "#0a0a0b",
};

/** The <html> attribute is the single source of truth — never local state. */
function getThemeSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

/** SSR/first render assume the server-rendered default attribute. */
function getServerThemeSnapshot(): Theme {
  return "dark";
}

/** Nothing else mutates data-theme at runtime, so no real subscription. */
const noopSubscribe = () => () => {};

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    noopSubscribe,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  // Click rewires the external store (the attribute) imperatively; bump a
  // counter so the snapshot is re-read and the icon/label follow.
  const [, rerender] = useReducer((count: number) => count + 1, 0);

  const handleClick = useCallback(() => {
    const next: Theme = getThemeSnapshot() === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode: choice just won't survive reload; OS fallback applies */
    }

    // Both metas get the same value: whichever entry the browser currently
    // honors (its OS preference decides) then shows the ACTIVE theme's color,
    // even when the manual choice contradicts the OS preference.
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", THEME_COLOR[next]));

    rerender();
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className="-m-2 flex items-center p-2 text-muted transition-colors hover:text-ink"
    >
      {/* Sun invites you INTO light; Moon back into dark. */}
      {theme === "dark" ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}
