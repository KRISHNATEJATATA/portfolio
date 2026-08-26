/**
 * One entry in the work history. Kept small on purpose — the section is a
 * highlight reel of recent roles, one impact line each, not a CV dump
 * (docs/portfolio-gap-report.md item 5).
 */
export type Experience = {
  /** Job title, e.g. "Software Engineer Intern". */
  role: string;
  /** Employer or organisation name. */
  org: string;
  /**
   * Period as a display string, e.g. "2025 — Present" or "Summer 2024".
   * Free-form so unusual ranges never need date plumbing.
   */
  period: string;
  /** One impact-focused line: what changed because you were there. */
  summary: string;
  /** Optional link to the employer's site or a relevant write-up. */
  url?: string;
};

// Highlight reel of recent roles — one impact line each (see the type docs
// above). Facts verified 2026-08-26 against LinkedIn + docs/about-me.md.
export const experiences: Experience[] = [
  {
    role: "Software Consultant",
    org: "Encora Digital (a Coforge company)",
    period: "Aug 2025 — Present",
    summary:
      "Building the recommendation platform for Avid Content Core with the team: Kafka/Kinesis ingestion pipelines, Snowflake-backed batch scoring, and FastAPI services serving results over Valkey and PostgreSQL.",
    url: "https://www.avid.com/",
  },
];
