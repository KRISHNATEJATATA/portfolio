"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeToTheme,
} from "@/lib/theme";

/**
 * Light/dark theme toggle — the only UI that writes the theme.
 *
 * Mechanism: the theme lives entirely on <html data-theme="light|dark">;
 * CSS token overrides in app/globals.css do the rest. lib/theme.ts owns the
 * read/write/subscribe logic (shared with FaviconLink). The pre-paint boot
 * script in layout.tsx sets the initial value; this button only ever runs
 * post-hydration.
 *
 * Hydration strategy: the rendered icon/label READS the <html> attribute
 * through useSyncExternalStore — same contract as the preloader's skip-intro
 * check. The server snapshot assumes "dark" (the SSR default attribute), so
 * server HTML and first client render always match; on the client the
 * snapshot reflects whatever the boot script actually resolved, correcting
 * within the first commit without an effect or a cascading render.
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

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const handleClick = useCallback(() => {
    setTheme(getThemeSnapshot() === "dark" ? "light" : "dark");
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
