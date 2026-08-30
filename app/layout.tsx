import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion-provider";
import { Preloader } from "@/components/chrome/preloader";
import { CustomCursor } from "@/components/chrome/custom-cursor";
import { GrainOverlay } from "@/components/chrome/grain-overlay";
import { FaviconLink } from "@/components/chrome/favicon-link";

/**
 * Site-wide z-index scale (chrome motion layer):
 *   content (auto/0) < grain 30 < nav 50 < skip-link 60
 *     < preloader 70 < cursor 80
 */

const clashDisplay = localFont({
  src: [
    { path: "./fonts/ClashDisplay-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ClashDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ClashDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ClashDisplay-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

/**
 * Browser-chrome color (mobile address bar, etc.) per theme. Two media-scoped
 * entries cover the pre-JS paint: the browser picks the entry matching the OS
 * preference, which is also what the boot script below falls back to when no
 * explicit choice is stored. If the visitor's stored theme differs from their
 * OS preference, the boot script — and later the toggle — rewrite BOTH meta
 * contents to the active theme's value, so whichever entry the browser
 * currently honors shows the right color.
 * Values must stay in sync with THEME_COLOR in components/chrome/theme-toggle.tsx.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://krishna-teja.vercel.app"),
  title: {
    default: "Krishna Teja — Backend Engineer",
    template: "%s — Krishna Teja",
  },
  description:
    "Krishna Teja is a software consultant at Encora Digital (a Coforge company) building event-driven data platforms in Python on AWS — Kafka/Kinesis ingestion, Snowflake analytics, and low-latency ML serving.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Krishna Teja — Backend Engineer",
    title: "Krishna Teja — Backend Engineer",
    description:
      "Event-driven data platforms in Python on AWS. Kafka/Kinesis ingestion, Snowflake analytics, low-latency ML serving.",
  },
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishna Teja — Backend Engineer",
    description:
      "Event-driven data platforms in Python on AWS. Kafka/Kinesis ingestion, Snowflake analytics, low-latency ML serving.",
  },
  /**
   * favicon.ico (dark, via the app/favicon.ico file convention) is the
   * no-JS/pre-hydration fallback. The theme-aware png icon is owned by
   * <FaviconLink> below, not metadata, so it can react to the toggle
   * without fighting Next's head reconciliation. apple-icon.png (dark) is
   * the iOS home-screen bookmark artwork, which has no theme.
   */
  icons: {
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

/**
 * Schema.org structured data describing the site owner for search engines
 * and AI crawlers. Rendered as a native <script> tag in the body below —
 * JSON-LD is data, not executable code, so next/script is not appropriate.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Krishna Teja",
  jobTitle: "Software Consultant",
  knowsAbout: [
    "Python",
    "AWS",
    "Apache Kafka",
    "Amazon Kinesis",
    "FastAPI",
    "Snowflake",
    "Event-driven architecture",
  ],
  sameAs: [
    "https://github.com/KRISHNATEJATATA",
    "https://www.linkedin.com/in/venkata-krishna-teja/",
  ],
};

/**
 * Theme boot script — runs synchronously as the FIRST child of <body>, i.e.
 * before anything after it can paint, so the correct palette is on <html>
 * pre-first-paint (no FOUC, no dark flash for light-theme visitors).
 *
 * Resolution order: explicit choice (localStorage "theme", written by the
 * toggle) → OS preference. It also rewrites the media-scoped theme-color
 * metas when the stored choice differs from the OS preference (see the
 * viewport export above).
 *
 * Hydration safety: React server-renders data-theme="dark"; this script may
 * flip it to "light" before hydration. The suppressHydrationWarning on
 * <html> tells React the attribute is owned by this script, not a mismatch
 * bug. The attribute is never touched by React state, so no re-render can
 * clobber it.
 */
const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t="dark"}var d=document.documentElement;d.setAttribute("data-theme",t);var c=t==="light"?"#f7f5f0":"#0a0a0b";var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++){m[i].setAttribute("content",c)}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme="dark" is the SSR/brand default; the boot script below may
    // override it pre-hydration (hence suppressHydrationWarning).
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${clashDisplay.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* MUST stay the first body child: synchronous, parser-blocking, so
            data-theme lands before any content paints. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        {/* React hoists this <link> into <head> and keeps it reactive to the
            theme toggle, taking over from the static favicon.ico fallback. */}
        <FaviconLink />
        {/* Structured data for crawlers: schema.org Person JSON-LD. The "<"
            is escaped so stringified JSON can never break out into markup. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/* If scripting is unavailable, never hide content behind the reveal
            animation or the intro preloader */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;filter:none !important}.preloader{display:none !important}`}</style>
        </noscript>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {/* Preloader mounts FIRST in the body so it covers the viewport from
            the first paint and its inline guard script runs before any page
            content parses. The real page renders underneath it (overlay
            pattern) — LCP is never delayed. */}
        <Preloader />
        <SiteNav />
        <main id="main-content" tabIndex={-1} className="flex-1 pt-16 focus:outline-none">
          {/* Single shared animation clock (Lenis + gsap.ticker) for all routes */}
          <MotionProvider>{children}</MotionProvider>
        </main>
        <SiteFooter />
        {/* Chrome motion layer: texture above content, cursor on top */}
        <GrainOverlay />
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  );
}
