import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { Reveal } from "@/components/reveal";
import { getProjectBySlug, projects } from "@/lib/projects";

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
          <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-tight tracking-display">
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

      <Reveal delay={200}>
        <div className="max-w-[65ch] space-y-6 py-12 text-lg text-muted">
          {project.description.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      <Reveal delay={240}>
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
          {project.demoUrl !== null && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <ExternalLink size={16} aria-hidden="true" />
              Live Demo <span className="sr-only">(opens in new tab)</span>
            </a>
          )}
        </div>
      </Reveal>
    </article>
  );
}
