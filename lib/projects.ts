/**
 * A project image. `alt` is required at the type level on purpose: an image
 * without a meaningful description never ships (WCAG 1.1.1).
 */
export type ProjectImage = {
  /** Path relative to public/, e.g. "/projects/aws-etl.webp". */
  src: string;
  /** What the image shows, in a sentence. Read by screen readers. */
  alt: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string[];
  stack: string[];
  year: number;
  sourceUrl: string;
  demoUrl: string | null;
  featured: boolean;

  /* ------------------------------------------------------------------ */
  /* Optional media + case-study fields.                                 */
  /* Every field below is optional: existing entries need zero changes,  */
  /* and the site renders a designed text-only treatment until they      */
  /* exist. See public/projects/README.md for the drop-in convention.    */
  /* ------------------------------------------------------------------ */

  /**
   * Cover image. Overrides the public/projects/{slug} file convention.
   * When omitted, lib/project-media.ts looks for /public/projects/{slug}
   * .{webp,avif,jpg,jpeg,png} at build time and uses it automatically.
   */
  image?: ProjectImage;
  /** The owner's role on the project, e.g. "Solo build". Shown near the title. */
  role?: string;
  /** The problem the project solves. Empty until the owner writes it. */
  problem?: string[];
  /**
   * How it was built. When omitted, the detail page re-flows the tail of
   * `description` into this section so nothing looks unfinished.
   */
  approach?: string[];
  /** Decisions made and what they cost. Empty until the owner writes it. */
  tradeoffs?: string[];
  /** Result of the project. Shown as a placeholder until provided. */
  outcome?: string;
  /** Extra screenshots rendered below the case study on the detail page. */
  gallery?: ProjectImage[];
};

/**
 * Filename extensions tried, in order, for the drop-in image convention
 * public/projects/{slug}.{ext}. webp first because it is the recommended
 * format (see public/projects/README.md).
 */
export const PROJECT_IMAGE_EXTENSIONS = [
  "webp",
  "avif",
  "jpg",
  "jpeg",
  "png",
] as const;

export const projects: Project[] = [
  {
    slug: "scalable-ecommerce-backend",
    name: "Scalable E-Commerce Backend",
    tagline:
      "Microservice-ready Python backend: async processing, caching, messaging, auth, observability.",
    description: [
      "A Python backend structured to scale past a monolith: async request handling, caching layers, message-based communication between services, auth, and observability wired in from the start.",
      "Built to practice the architectural decisions production backends demand — where to draw service boundaries, what belongs on a queue instead of a request path, and how to see inside a running system.",
    ],
    stack: ["Python", "FastAPI", "Microservices"],
    year: 2026,
    sourceUrl: "https://github.com/KRISHNATEJATATA/scalable-ecommerce-backend",
    demoUrl: null,
    featured: true,
  },
  {
    slug: "kafka-event-pipeline",
    name: "Kafka Event Pipeline",
    tagline:
      "Event streaming on Kafka with schema validation, retries, dead-letter queues, and live metrics.",
    description: [
      "A streaming pipeline that moves events through Kafka the way production systems do: validate against schemas at the boundary, retry transient failures automatically, and park poison messages on a dead-letter queue instead of dropping them.",
      "Prometheus metrics expose throughput and failures in real time — so the pipeline can actually be operated, not just demoed.",
    ],
    stack: ["Python", "Apache Kafka", "Prometheus"],
    year: 2026,
    sourceUrl: "https://github.com/KRISHNATEJATATA/kafka-event-pipeline",
    demoUrl: null,
    featured: true,
  },
  {
    slug: "aws-etl",
    name: "AWS ETL Pipeline",
    tagline: "Python data pipeline on AWS that moves real data from raw to useful.",
    description: [
      "A Python ETL pipeline running on AWS: pull raw data in, transform it into something trustworthy, and land it where it can actually be queried. Built to learn cloud data engineering end to end rather than stopping at a tutorial.",
      "It covers the unglamorous parts that make pipelines real — scheduling runs, handling failures without duplicating data, and keeping storage costs sane.",
    ],
    stack: ["Python", "AWS", "ETL"],
    year: 2025,
    sourceUrl: "https://github.com/KRISHNATEJATATA/aws_etl",
    demoUrl: null,
    featured: true,
  },
  {
    slug: "generative-ai",
    name: "Generative AI Experiments",
    tagline: "Small experiments to understand what generative models actually do well.",
    description: [
      "A workshop of experiments with generative AI: prompt patterns, structured outputs, and small tools built while figuring out where these models genuinely help and where they don't.",
      "Each experiment is deliberately small — the goal is understanding, not a product.",
    ],
    stack: ["Python", "GenAI"],
    year: 2025,
    sourceUrl: "https://github.com/KRISHNATEJATATA/Generative-Ai",
    demoUrl: null,
    featured: false,
  },
  {
    slug: "pokedex",
    name: "Pokedex",
    tagline: "A data-driven web experiment in consuming an API cleanly.",
    description: [
      "A Pokedex interface built as a web experiment: fetch from a public API, render large lists without jank, and make search feel instant.",
      "A small project on purpose — it was about practicing fundamentals like state, caching, and list performance.",
    ],
    stack: ["JavaScript", "Web", "REST API"],
    year: 2023,
    sourceUrl: "https://github.com/KRISHNATEJATATA/Pokedex",
    demoUrl: null,
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}
