import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion-provider";
import { Preloader } from "@/components/chrome/preloader";
import { CustomCursor } from "@/components/chrome/custom-cursor";
import { GrainOverlay } from "@/components/chrome/grain-overlay";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
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
