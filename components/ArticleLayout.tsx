import { generateFAQSchema, generateAggregateOfferSchema } from "@/lib/schema";
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

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <article className="pb-16">
        {children}

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
