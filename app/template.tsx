/// <reference types="react/canary" />
import { ViewTransition } from "react";

/**
 * Route transition layer — Next 16.3.2's officially supported mechanism.
 *
 * This Next version ships React's `<ViewTransition>` in the App Router with
 * no configuration (see node_modules/next/dist/docs/01-app/02-guides/
 * view-transitions.md): route navigations are async transitions, so
 * `<ViewTransition>` enter/exit animations activate automatically.
 *
 * It lives in `template.tsx` — not `layout.tsx` — because layouts persist
 * across navigations (their enter/exit never fire), while a template
 * remounts on every navigation, giving each route a clean exit/enter pair.
 * The nav, footer and chrome layers stay outside it and never move.
 *
 * Animation (CSS in app/globals.css, `.route-exit` / `.route-enter`):
 * old page fades up-and-out 160ms; new page rises in with a soft blur-out
 * 300ms after a 120ms handoff gap — echoing the site's Reveal language
 * (fade + rise + blur) at ~350ms total feel. Purpose: state transition —
 * confirming the navigation landed without a hard cut.
 *
 * Degrades gracefully: browsers without the View Transitions API simply
 * swap pages instantly; `prefers-reduced-motion: reduce` zeroes all view
 * transition durations via CSS.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="route-enter" exit="route-exit" default="none">
      {children}
    </ViewTransition>
  );
}
