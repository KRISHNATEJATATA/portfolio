import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="shell flex flex-col items-start justify-center py-32 sm:py-40">
      <p className="eyebrow">404</p>
      <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-tight tracking-display">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="mt-4 max-w-[50ch] text-lg text-muted">
        The link may be old or mistyped. The projects page is a good place to
        pick the trail back up.
      </p>
      <Link href="/projects" className="btn btn-primary mt-10">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to projects
      </Link>
    </section>
  );
}
