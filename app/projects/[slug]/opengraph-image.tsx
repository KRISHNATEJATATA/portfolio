import { ImageResponse } from "next/og";

import { getProjectBySlug } from "@/lib/projects";

/**
 * Per-project Open Graph share card for /projects/[slug].
 *
 * The root app/opengraph-image.tsx cascades down to every segment; this file
 * overrides it inside the [slug] segment so a shared project link renders the
 * project's own name, tagline, and stack instead of the generic site card.
 * Mirrors the root card's visual language exactly (same palette, spacing,
 * system fonts) so the two read as one family in a social feed.
 *
 * Statically generated at build time for every slug from
 * generateStaticParams in page.tsx. An unknown slug falls back to generic
 * card content rather than throwing, so the route handler never 500s.
 */

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Config exports are static strings (no per-image alt without
// generateImageMetadata), so one sensible alt covers all projects.
export const alt = "Project by Krishna Teja";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  const name = project?.name ?? "Krishna Teja";
  const tagline = project?.tagline ?? "Backend Engineer";
  const year = project?.year;
  const stack = project?.stack ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          backgroundColor: "#0a0a0b",
          color: "#f4f1ea",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 72,
            height: 10,
            backgroundColor: "#f59e0b",
            marginBottom: 48,
          }}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 30,
            color: "#a8a29e",
            marginTop: 24,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
            fontSize: 24,
            color: "#a8a29e",
            marginTop: 56,
          }}
        >
          {year !== undefined && <div>{year}</div>}
          {stack.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
