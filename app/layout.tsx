import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

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
    default: "Krishna Teja — Software Engineer",
    template: "%s — Krishna Teja",
  },
  description:
    "Krishna Teja is a software engineer building across the whole stack — AWS ETL pipelines, generative AI experiments, and an IoT smart pill box in C++.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Krishna Teja — Software Engineer",
    title: "Krishna Teja — Software Engineer",
    description:
      "Building across data, AI, and devices. AWS ETL pipelines, generative AI experiments, and embedded C++.",
  },
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishna Teja — Software Engineer",
    description:
      "Building across data, AI, and devices. AWS ETL pipelines, generative AI experiments, and embedded C++.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* If scripting is unavailable, never hide content behind the reveal animation */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;filter:none !important}`}</style>
        </noscript>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteNav />
        <main id="main-content" tabIndex={-1} className="flex-1 pt-16 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
