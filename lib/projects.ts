/**
 * A project image. `alt` is required at the type level on purpose: an image
 * without a meaningful description never ships (WCAG 1.1.1).
 */
export type ProjectImage = {
  /** Path relative to public/, e.g. "/projects/aws-etl.webp". */
  src: string;
  /**
   * Paired light-theme variant of `src` (e.g. a light-styled architecture
   * diagram), swapped in via CSS when html[data-theme="light"]. When omitted,
   * the single `src` renders in both themes.
   */
  lightSrc?: string;
  /**
   * Intrinsic viewBox dimensions of the rendered SVG, as printed by
   * `npm run diagrams`. With the height-auto gallery frame these let the
   * browser reserve the exact final height before the file loads — no CLS,
   * no forced crop. Diagram entries should always carry them.
   */
  width?: number;
  height?: number;
  /** What the image shows, in a sentence. Read by screen readers. */
  alt: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  /** Case-study copy. Paragraph one is the Overview section on the detail page. */
  description: string[];
  stack: string[];
  year: number;
  sourceUrl: string;
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
  /**
   * How it was built. When omitted, the detail page re-flows the tail of
   * `description` into this section so nothing looks unfinished.
   */
  approach?: string[];
  /**
   * Extra visuals rendered below the case study on the detail page —
   * screenshots and architecture diagrams alike.
   */
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
    featured: true,
    gallery: [
      {
        src: "/projects/scalable-ecommerce-backend-architecture.dark.svg",
        lightSrc:
          "/projects/scalable-ecommerce-backend-architecture.light.svg",
        width: 1304,
        height: 648,
        alt: "Request path through the FastAPI layers — middleware, routes, schemas, services, repositories — into PostgreSQL, Valkey, and S3, beside the transactional-outbox relay feeding the SNS/SQS bus and its image, cache-invalidation, and reservation-reaper workers.",
      },
    ],
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
    featured: true,
    gallery: [
      {
        src: "/projects/kafka-event-pipeline-architecture.dark.svg",
        lightSrc: "/projects/kafka-event-pipeline-architecture.light.svg",
        width: 1040,
        height: 480,
        alt: "An event's journey from the producer through JSON-schema validation into Kafka topics, multi-stage validation and batch offset commits in the consumer, exponential-backoff retries dead-lettering onto the broker, with Prometheus scraping consumer metrics.",
      },
    ],
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
    featured: true,
    gallery: [
      {
        src: "/projects/aws-etl-architecture.dark.svg",
        lightSrc: "/projects/aws-etl-architecture.light.svg",
        width: 1040,
        height: 480,
        alt: "Ingest-to-query flow: enterprise.csv lands in a private S3 source bucket, a Glue crawler registers it in the Data Catalog, a Glue ETL job transforms it into a curated S3 target bucket, and Athena queries the result.",
      },
    ],
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
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}
