import {
  generateFAQSchema,
  generateAggregateOfferSchema,
  generateArticleSchema,
  generateBreadcrumbListSchema,
} from "@/lib/schema";
import type { ArticleFrontmatter } from "@/lib/mdx";
import LeadCaptureForm from "./LeadCaptureForm";
import MobileStickyCTA from "./MobileStickyCTA";

export default function ArticleLayout({
  frontmatter,
  children,
}: {
  frontmatter: ArticleFrontmatter;
  children: React.ReactNode;
}) {
  const schemas: object[] = [];

  if (frontmatter.faqs?.length) {
    schemas.push(generateFAQSchema(frontmatter.faqs));
  }
  if (frontmatter.schema?.offers) {
    schemas.push(generateAggregateOfferSchema(frontmatter.schema.offers));
  }
  schemas.push(generateArticleSchema(frontmatter));
  schemas.push(generateBreadcrumbListSchema(frontmatter));

  const updated = frontmatter.updated || frontmatter.date;
  const displayDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${updated}T00:00:00`));

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <article className="pb-16 max-w-[760px] mx-auto">
        <header className="mb-8 border-b border-gray-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            {frontmatter.marketName} Cost Guide
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight mb-4">
            {frontmatter.title}
          </h1>
          <p className="text-lg text-gray-600 leading-8">
            {frontmatter.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>Updated {displayDate}</span>
            <span>San Diego County pricing</span>
            <span>Contractor-informed estimates</span>
          </div>
        </header>

        <div>{children}</div>

        <LeadCaptureForm />

        <p className="text-xs text-gray-400 mt-4 italic">
          Pricing based on San Diego County materials and labor as of{" "}
          {frontmatter.updated || frontmatter.date}. Your actual cost will
          depend on site conditions, access, material selections, and project
          complexity. Ranges include standard installation on a properly prepared
          base.
        </p>
      </article>

      <MobileStickyCTA />
    </>
  );
}
