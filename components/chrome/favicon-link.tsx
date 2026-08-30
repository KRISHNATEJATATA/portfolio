"use client";

import { useSyncExternalStore } from "react";
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeToTheme,
} from "@/lib/theme";

/**
 * Theme-aware favicon. React 19 hoists <link> tags rendered anywhere in the
 * tree into <head> and dedupes by tag+props, so this component fully owns
 * the icon <link> — no manual DOM mutation of Next's metadata-generated
 * link, which would otherwise get out of sync across client navigations.
 * app/layout.tsx's metadata.icons only sets the static dark default (for
 * no-JS / pre-hydration); this takes over once mounted and follows the
 * user's explicit toggle, ignoring OS preference by design.
 */
export function FaviconLink() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  return (
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href={`/icon-${theme}.png`}
    />
  );
}
