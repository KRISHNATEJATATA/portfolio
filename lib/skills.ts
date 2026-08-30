/**
 * Skills grouped by domain. Deliberately flat lists: no percentage bars,
 * star ratings, or invented proficiency levels. A grouped list states what
 * the owner actually works with; fake numbers would state only confidence
 * (requirement from docs/portfolio-gap-report.md item 4).
 */
export type SkillGroup = {
  /** Domain heading shown to visitors, e.g. "Languages". */
  domain: string;
  /** Skills in the domain, most-central first. */
  items: string[];
};

// Mirrors the decided positioning (docs/about-me.md, 2026-08-26): backend /
// data-intensive systems engineer. Everything listed is exercised daily in
// the ACC recommendation platform at Encora or evidenced by the personal
// projects below; web tech stays a deliberate secondary color.
export const skillGroups: SkillGroup[] = [
  {
    domain: "Languages",
    items: ["Python", "SQL"],
  },
  {
    domain: "Backend",
    items: ["FastAPI", "asyncio", "REST APIs", "Pydantic"],
  },
  {
    domain: "Streaming & Data",
    items: [
      "Apache Kafka / MSK",
      "Amazon Kinesis",
      "SQS & EventBridge",
      "RabbitMQ",
      "Snowflake",
      "DynamoDB",
      "PostgreSQL / Aurora",
      "Valkey / Redis",
    ],
  },
  {
    domain: "ML Serving",
    items: ["LightGBM", "scikit-learn", "pandas"],
  },
  {
    domain: "Cloud & DevOps",
    items: ["AWS", "Docker", "GitHub Actions"],
  },
  {
    domain: "Observability & Quality",
    items: ["OpenTelemetry", "Prometheus", "pytest + testcontainers"],
  },
];
