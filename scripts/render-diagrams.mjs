#!/usr/bin/env node
/**
 * Renders every architecture diagram in diagrams/ into theme-paired SVGs in
 * public/projects/, ready for components/themed-diagram.tsx to embed.
 *
 * For each diagrams/{slug}.d2 this emits:
 *   public/projects/{slug}-architecture.dark.svg   (--theme=201 Dark Flagship Terrastruct)
 *   public/projects/{slug}-architecture.light.svg  (--theme=302 Origami)
 *
 * Post-processing, per file:
 *   1. Canvas rect removed — the SVGs render transparent and pick up the
 *      site container's own bg-background in both themes, so the dark
 *      variant never clashes with #0a0a0b and the pair swap stays
 *      pixel-consistent.
 *   2. Embedded fonts stripped — d2 (Origami especially) inlines hundreds of
 *      KB of base64 @font-face data. The font classes are re-pointed at the
 *      site's own stack instead, keeping each SVG small and visually
 *      consistent with the page it sits on.
 *
 * Diagrams keep their NATURAL aspect ratio (architecture flows are wide);
 * no cropping or letterboxing. The script prints each file's final viewBox
 * dimensions — lib/projects.ts gallery entries carry them as width/height so
 * the themed viewer can reserve exact space (no CLS) without forcing a crop.
 *
 * Usage: npm run diagrams
 * Requires the d2 CLI on PATH — https://d2lang.com (winget install Terrastruct.D2).
 */

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIAGRAMS_DIR = path.join(ROOT, "diagrams");
const OUT_DIR = path.join(ROOT, "public", "projects");

/** Built-in d2 theme IDs chosen to sit closest to the site's two palettes. */
const VARIANTS = [
  { suffix: "dark", theme: "201" }, // Dark Flagship Terrastruct: near-black canvas tones
  { suffix: "light", theme: "302" }, // Origami: warm-neutral greys, near-black ink
];

function resolveD2() {
  try {
    execFileSync("d2", ["--version"], { stdio: "pipe" });
    return "d2";
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(
        "[diagrams] The d2 CLI was not found on PATH. Install it first —\n" +
          "  winget install --id Terrastruct.D2 -e\n" +
          "  (or see https://d2lang.com/tour/install) — then re-run `npm run diagrams`.",
      );
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Remove d2's full-canvas background <rect> (always the first rect emitted).
 * The class-based fill would beat a fill="none" attribute, so the element
 * goes entirely — what remains is a transparent canvas sized by the viewBox.
 */
function makeCanvasTransparent(svg) {
  return svg.replace(/<rect[^>]*\/>/, "");
}

/**
 * Strip d2's embedded base64 @font-face blocks and re-point its generated
 * font classes at the site's own stacks: Satoshi (via ui-sans-serif fallback)
 * for text, a system mono stack for code/mono labels.
 */
function stripEmbeddedFonts(svg) {
  let next = svg.replace(/@font-face\s*\{[^}]*\}/g, "");
  next = next.replace(
    /font-family:\s*"d2-[^"]*"/g,
    (match) =>
      /mono/i.test(match)
        ? 'font-family: ui-monospace, "Cascadia Mono", "Courier New", monospace'
        : 'font-family: "Satoshi", ui-sans-serif, system-ui, sans-serif',
  );
  return next;
}

/**
 * Remove decorative <pattern> defs (Origami tiles a ~435KB illustrated
 * "paper" texture behind the canvas). With the background rect gone these
 * are unreferenced-or-nearly-so dead weight; any CSS fill still pointing at
 * a stripped pattern falls back to flat white so textured nodes keep their
 * paper-card look at a fraction of the bytes.
 */
function stripDecorativePatterns(svg) {
  const ids = [...svg.matchAll(/<pattern[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
  let next = svg;
  for (const id of ids) {
    next = next.replace(
      new RegExp(`<pattern[^>]*\\b${id}[\\s\\S]*?</pattern>`),
      "",
    );
    next = next.split(`url(#${id})`).join("#FFFFFF");
  }
  return next;
}

/** Board viewBox dimensions, for the CLS-safe width/height report. */
function boardDimensions(svg) {
  const board = svg.match(/<svg[^>]*class="[^"]*\bd2-svg[^"]*"[^>]*>/)?.[0];
  const viewBox = board?.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/);
  if (!viewBox) throw new Error("board <svg> viewBox not found");
  return {
    width: Math.round(Number(viewBox[3])),
    height: Math.round(Number(viewBox[4])),
  };
}

const d2 = resolveD2();
const sources = readdirSync(DIAGRAMS_DIR).filter((f) => f.endsWith(".d2"));
if (sources.length === 0) {
  console.error(`[diagrams] No .d2 sources found in ${DIAGRAMS_DIR}.`);
  process.exit(1);
}

for (const source of sources) {
  const slug = path.basename(source, ".d2");
  for (const variant of VARIANTS) {
    const outFile = path.join(
      OUT_DIR,
      `${slug}-architecture.${variant.suffix}.svg`,
    );
    execFileSync(
      d2,
      [
        "--layout=elk",
        `--theme=${variant.theme}`,
        "--pad=20",
        path.join(DIAGRAMS_DIR, source),
        outFile,
      ],
      { stdio: "inherit" },
    );

    let svg = readFileSync(outFile, "utf8");
    svg = makeCanvasTransparent(svg);
    svg = stripEmbeddedFonts(svg);
    svg = stripDecorativePatterns(svg);
    writeFileSync(outFile, svg);

    const { width, height } = boardDimensions(svg);
    const kb = (Buffer.byteLength(svg) / 1024).toFixed(1);
    console.log(
      `[diagrams] wrote ${path.relative(ROOT, outFile)} — ${width}x${height}, ${kb}KB`,
    );
  }
}
