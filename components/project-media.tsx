import Image from "next/image";

import type { ProjectImage } from "@/lib/projects";

/**
 * Shared project media frame: renders the project image when one resolves,
 * nothing otherwise.
 *
 * Server component. The resolved image is passed in by a server page via
 * lib/project-media.ts (which owns the filesystem convention lookup).
 */

export function ProjectMedia({
  media,
  sizes,
  preload = false,
  className = "",
}: {
  media: ProjectImage | null;
  /** next/image `sizes` for the responsive srcset. */
  sizes: string;
  /** Preload only for imagery likely above the fold (LCP candidate). */
  preload?: boolean;
  className?: string;
}) {
  if (!media) {
    return null;
  }

  return (
    <div
      className={`relative aspect-[16/9] overflow-hidden bg-background ${className}`}
    >
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
      />
    </div>
  );
}
