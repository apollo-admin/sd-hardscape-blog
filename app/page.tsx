import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import MobileStickyCTA from "@/components/MobileStickyCTA";

function getPriceLabel(title: string) {
  return (
    title.match(/\$[\d,.]+K?(?:[–-]\$?[\d,.]+K?\+?)?(?:\/sq ?ft|\/sqft)?\+?/i)?.[0] ??
    ""
  );
}

export default function HomePage() {
  const articles = getAllArticles();

  return (
    <>
      <div className="pb-16">
        <section className="py-10 sm:py-14 text-center max-w-[760px] mx-auto">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3 leading-tight"
            style={{ color: "var(--color-brand)" }}
          >
            San Diego Outdoor Project Cost Guides
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
            Local pricing for pavers, turf, concrete patios, pergolas, fire
            features, pool decks, and backyard remodels. Built for homeowners
            comparing real San Diego scopes, not national averages.
          </p>
          <a
            href="#guides"
            className="inline-flex items-center px-6 py-3 text-base font-semibold text-white rounded-lg transition-colors"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Browse Cost Guides
          </a>
        </section>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs sm:text-sm text-gray-500 border-y border-gray-200 py-3 mb-10">
          <span>San Diego County project pricing</span>
          <span>Updated March 2026</span>
          <span>Free handoff to a vetted local partner</span>
        </div>

        <section id="guides">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.map((article) => {
              const priceMatch = getPriceLabel(article.frontmatter.title);
              return (
                <Link
                  key={`${article.market}-${article.slug}`}
                  href={`/${article.market}/cost/${article.slug}`}
                  className="group block bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow no-underline"
                >
                  {priceMatch && (
                    <span
                      className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 text-white"
                      style={{ backgroundColor: "var(--color-brand)" }}
                    >
                      {priceMatch}
                    </span>
                  )}
                  <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 mb-2 leading-snug">
                    {article.frontmatter.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {article.frontmatter.description}
                  </p>
                  <span
                    className="inline-block mt-3 text-sm font-medium"
                    style={{ color: "var(--color-accent)" }}
                  >
                    Read Full Guide &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-14 text-center">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--color-brand)" }}
          >
            Ready to Price Your San Diego Backyard?
          </h2>
          <p className="text-gray-600 mb-5">
            Tell us about your project and we&apos;ll route it to a vetted San
            Diego outdoor living partner for follow-up.
          </p>
        </section>

        <LeadCaptureForm />
      </div>

      <MobileStickyCTA />
    </>
  );
}
