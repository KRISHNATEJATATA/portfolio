import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  PROJECT_IMAGE_EXTENSIONS,
  type Project,
  type ProjectImage,
} from "./projects";

/**
 * Server-only helper: resolves the cover image for a project.
 *
 * Two sources, in order:
 *  1. Explicit `project.image` (full control, alt required by the type).
 *  2. Drop-in convention: a file named public/projects/{slug}.{ext} plus a
 *     one-line alt-text sidecar public/projects/{slug}.alt.txt. Both are
 *     read at build/render time on the server, so dropping files into
 *     public/projects/ makes imagery appear with no code changes.
 *
 * If a convention image exists without its .alt.txt sidecar it is skipped
 * (with a build-time warning) rather than rendered with an empty or guessed
 * alt: meaningful alt text is mandatory whenever an image is shown.
 *
 * This module imports node:fs and must only be imported from server
 * components (app/** pages). Client components receive already-resolved
 * media via props.
 */

const PROJECTS_DIR = path.join(process.cwd(), "public", "projects");

function readAltText(slug: string): string | null {
  const altPath = path.join(PROJECTS_DIR, `${slug}.alt.txt`);
  if (!existsSync(altPath)) {
    return null;
  }
  const alt = readFileSync(altPath, "utf8").trim();
  return alt.length > 0 ? alt : null;
}

export function resolveProjectImage(project: Project): ProjectImage | null {
  // 1. Explicit field wins.
  if (project.image) {
    return project.image;
  }

  // 2. Convention lookup over public/projects/.
  for (const ext of PROJECT_IMAGE_EXTENSIONS) {
    const filePath = path.join(PROJECTS_DIR, `${project.slug}.${ext}`);
    if (!existsSync(filePath)) {
      continue;
    }

    const alt = readAltText(project.slug);
    if (!alt) {
      console.warn(
        `[projects] Found /projects/${project.slug}.${ext} but no ` +
          `/projects/${project.slug}.alt.txt. Add a one-line description in ` +
          "that file so the image can render with meaningful alt text.",
      );
      return null;
    }

    return { src: `/projects/${project.slug}.${ext}`, alt };
  }

  return null;
}
