"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";

const GITHUB_URL = "https://github.com/KRISHNATEJATATA";
const LINKEDIN_URL = "https://www.linkedin.com/in/venkata-krishna-teja/";

/**
 * Nav link styles. Padding + matching negative margin expands the pointer
 * target to >=24 CSS px (WCAG 2.2 Target Size Minimum) without shifting
 * the visual layout.
 */
function navLinkClass(active: boolean) {
  return [
    "inline-flex items-center py-2 -my-2 transition-colors",
    active
      ? "text-ink underline decoration-accent decoration-2 underline-offset-[10px]"
      : "text-muted hover:text-ink",
  ].join(" ");
}

export function SiteNav() {
  const pathname = usePathname();

  // Home matches exactly; section routes match themselves and their children.
  const isCurrent = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-background/85 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="shell flex h-16 items-center justify-between"
      >
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-display text-ink transition-colors hover:text-accent"
        >
          Krishna Teja
        </Link>

        <ul className="flex items-center gap-4 text-sm font-medium sm:gap-7">
          <li>
            <Link
              href="/"
              aria-current={isCurrent("/") ? "page" : undefined}
              className={navLinkClass(isCurrent("/"))}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              aria-current={isCurrent("/projects") ? "page" : undefined}
              className={navLinkClass(isCurrent("/projects"))}
            >
              Projects
            </Link>
          </li>
          <li>
            <a href="/resume.pdf" className={navLinkClass(false)}>
              Resume
            </a>
          </li>
          <li aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
          <li>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in new tab)"
              className="-m-2 flex items-center p-2 text-muted transition-colors hover:text-ink"
            >
              <GithubIcon size={18} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in new tab)"
              className="-m-2 flex items-center p-2 text-muted transition-colors hover:text-ink"
            >
              <LinkedinIcon size={18} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
