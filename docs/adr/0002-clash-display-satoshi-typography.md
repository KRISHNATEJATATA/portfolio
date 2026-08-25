# Clash Display + Satoshi typography, dark theme with warm amber accent

Status: accepted

Research showed nearly every notable developer portfolio uses Inter (or Geist) — Brittany Chiang, Lee Robinson, and every `create-next-app` scaffold. We deliberately chose the uncommon-but-premium pairing **Clash Display** (headings) + **Satoshi** (body) from Fontshare (free commercial license, self-hosted via `next/font/local`) so the site feels designed rather than generated. Theme: near-black background (`#0a0a0b`), warm off-white text, single warm amber accent — rejecting the near-universal teal-on-navy look.

## Considered Options

- **Inter + JetBrains Mono** — strongest adoption evidence, but reads as default/template
- **Geist Sans/Mono** — Next.js-native zero-config, but is *the* create-next-app look
- **Clash Display + Satoshi** — chosen: distinctive, premium feel, free license
- **Space Grotesk / Bricolage Grotesque combos** — viable Google Fonts alternatives, less distinctive than Fontshare pairings

## Consequences

- Fonts are NOT on `next/font/google` — must download woff2 files from Fontshare and self-host via `next/font/local`
- Fallback stacks must be defined carefully (Satoshi → Inter → system-ui) to avoid layout shift
