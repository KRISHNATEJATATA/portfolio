import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { ProjectMedia } from "@/components/project-media";
import { Reveal } from "@/components/reveal";
import { ThemedDiagram } from "@/components/themed-diagram";
import { resolveProjectImage } from "@/lib/project-media";
import { getProjectBySlug, projects } from "@/lib/projects";

const HERO_SIZES = "(min-width: 768px) 1052px, calc(100vw - 3rem)";
const GALLERY_SIZES = "(min-width: 640px) 514px, calc(100vw - 3rem)";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.name,
    description: project.tagline,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const media = resolveProjectImage(project);

  // Case-study copy. Existing `description` is re-flowed rather than
  // rewritten: paragraph one becomes the overview, the rest becomes the
  // approach notes until the owner fills the dedicated field.
  const overview = project.description.slice(0, 1);
  const approach = project.approach ?? project.description.slice(1);

  const sections: { heading: string; paragraphs: string[] }[] = [
    { heading: "Overview", paragraphs: overview },
    { heading: "Approach", paragraphs: approach },
  ];

  return (
    <article className="shell py-16 sm:py-20 lg:py-24">
      <Reveal>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          All projects
        </Link>
      </Reveal>

      <header className="mt-10 border-b border-line pb-10 sm:mt-14">
        <Reveal delay={80}>
          <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-tight tracking-display text-accent">
            {project.name}
          </h1>
          <p className="mt-4 max-w-[60ch] text-lg text-muted sm:text-xl">
            {project.tagline}
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="chip border-accent/50 text-accent">
              {project.year}
            </span>
            {project.stack.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </header>

      {/* Cover imagery. Renders automatically once files follow the convention
          in public/projects/README.md; nothing renders until then. */}
      {/* TODO(owner): drop public/projects/{slug}.webp plus a one-line
          public/projects/{slug}.alt.txt (see public/projects/README.md), or set
          the optional `image` field on this project in lib/projects.ts.
          Recommended size 1600x900 (16:9). */}
      <Reveal delay={200}>
        <ProjectMedia
          media={media}
          sizes={HERO_SIZES}
          preload={media !== null}
          className="mt-10 rounded-xl border border-line"
        />
      </Reveal>

      {/* Case study: overview -> approach. */}
      <Reveal delay={240}>
        <div className="mt-12">
          {sections.map((section) => (
            <section
              key={section.heading}
              className="grid gap-4 border-t border-line py-10 first:border-t-0 lg:grid-cols-[12rem_1fr] lg:gap-10"
            >
              <h2 className="font-display text-xl font-semibold tracking-display text-ink lg:sticky lg:top-24 lg:self-start">
                {section.heading}
              </h2>
              <div className="max-w-[65ch] space-y-5 text-lg text-muted">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Reveal>

      {project.gallery && project.gallery.length > 0 && (
        /* TODO(owner): add screenshots via the optional `gallery` field in
           lib/projects.ts ({ src, alt } entries pointing at files in
           public/projects/; alt is required). */
        <Reveal delay={280}>
          <section className="border-t border-line py-10">
            <h2 className="font-display text-xl font-semibold tracking-display text-ink">
              {project.gallery.every((s) => Boolean(s.lightSrc))
                ? "Architecture"
                : "Screenshots"}
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {project.gallery.map((shot) =>
                shot.lightSrc && shot.width && shot.height ? (
                  // Theme-paired diagram (SVG): CSS swaps the variant, and the
                  // frame is a button that opens it fullscreen — see
                  // components/themed-diagram.
                  <li key={shot.src}>
                    <ThemedDiagram
                      src={shot.src}
                      lightSrc={shot.lightSrc}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      name={project.name}
                    />
                  </li>
                ) : (
                  <li
                    key={shot.src}
                    className="relative aspect-[16/9] overflow-hidden rounded-xl border border-line bg-background"
                  >
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes={GALLERY_SIZES}
                      className="object-cover"
                    />
                  </li>
                ),
              )}
            </ul>
          </section>
        </Reveal>
      )}

      <Reveal delay={320}>
        <div className="flex flex-wrap gap-4 border-t border-line pt-10">
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <GithubIcon size={16} aria-hidden="true" />
            View Source <span className="sr-only">(opens in new tab)</span>
          </a>
        </div>
      </Reveal>
    </article>
  );
}
