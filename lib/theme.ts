/**
 * Shared theme store — single source of truth for anything that reacts to
 * the light/dark toggle (ThemeToggle, FaviconLink). The value itself lives
 * on <html data-theme>; this module just centralizes reads/writes and a
 * subscribable "themechange" event so multiple components can stay in sync
 * without reaching into each other's DOM nodes.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
const THEME_EVENT = "themechange";

/** Browser-chrome colors per theme; keep in sync with THEME_BOOT_SCRIPT in app/layout.tsx. */
export const THEME_COLOR: Record<Theme, string> = {
  light: "#f7f5f0",
  dark: "#0a0a0b",
};

/** The <html> attribute is the single source of truth — never local state. */
export function getThemeSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

/** SSR/first render assume the server-rendered default attribute (dark). */
export function getServerThemeSnapshot(): Theme {
  return "dark";
}

/** For useSyncExternalStore consumers: re-renders on every setTheme() call. */
export function subscribeToTheme(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

/** Writes the theme, persists it, and notifies subscribers. Ignores OS preference by design — dark is the default until the user explicitly toggles. */
export function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* private mode: choice just won't survive reload; dark default applies */
  }

  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", THEME_COLOR[next]));

  window.dispatchEvent(new Event(THEME_EVENT));
}
