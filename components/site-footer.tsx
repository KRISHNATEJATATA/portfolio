import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";

const GITHUB_URL = "https://github.com/KRISHNATEJATATA";
const LINKEDIN_URL = "https://www.linkedin.com/in/venkata-krishna-teja/";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted sm:flex-row">
        <p>&copy; {year} Krishna Teja</p>
        <div className="flex items-center gap-5">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in new tab)"
            className="-m-2 flex items-center p-2 transition-colors hover:text-ink"
          >
            <GithubIcon size={18} aria-hidden="true" />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in new tab)"
            className="-m-2 flex items-center p-2 transition-colors hover:text-ink"
          >
            <LinkedinIcon size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
