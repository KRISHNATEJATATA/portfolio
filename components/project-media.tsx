import Image from "next/image";

import type { ProjectImage } from "@/lib/projects";

/**
 * Shared project media frame: renders the project image when one resolves,
 * otherwise a designed typographic texture (ghost index numeral + the site's
 * amber tick motif) so empty slots read as intentional, never broken.
 *
 * Server component. The resolved image is passed in by a server page via
 * lib/project-media.ts (which owns the filesystem convention lookup).
 */

const NUMERAL_BY_SIZE = {
  card: "text-7xl sm:text-8xl",
  hero: "text-[clamp(5rem,16vw,10rem)]",
} as const;

const PADDING_BY_SIZE = {
  card: "p-6 sm:p-8",
  hero: "p-8 sm:p-12",
} as const;

export function ProjectMedia({
  media,
  index,
  sizes,
  preload = false,
  size = "card",
  className = "",
}: {
  media: ProjectImage | null;
  /** Zero-based position in the projects list; drives the ghost numeral. */
  index: number;
  /** next/image `sizes` for the responsive srcset. */
  sizes: string;
  /** Preload only for imagery likely above the fold (LCP candidate). */
  preload?: boolean;
  size?: keyof typeof NUMERAL_BY_SIZE;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[16/9] overflow-hidden bg-background ${className}`}
    >
      {media ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
        />
      ) : (
        /* Decorative texture: hidden from assistive tech, purely typographic */
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex flex-col justify-between ${PADDING_BY_SIZE[size]}`}
        >
          <span className="block h-0.5 w-8 bg-accent" />
          <span
            className={`font-display font-semibold leading-none tracking-display text-line ${NUMERAL_BY_SIZE[size]}`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
