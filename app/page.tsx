import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import HeroCTA from "@/components/HeroCTA";

const marketNames: Record<string, string> = {
  "san-diego": "San Diego",
};

export default function HomePage() {
  const articles = getAllArticles();

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Outdoor Cost Guide
        </h1>
        <p className="text-gray-600 mb-1">
          Real pricing for outdoor projects — not national averages.
        </p>
        <HeroCTA />

        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={`${article.market}-${article.slug}`}
              className="border-b border-gray-100 pb-6"
            >
              <Link
                href={`/${article.market}/cost/${article.slug}`}
                className="block group no-underline"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                    {marketNames[article.market] || article.market}
                  </span>
                  <span className="text-xs text-gray-300">&middot;</span>
                  <time className="text-xs text-gray-400">
                    {article.frontmatter.date}
                  </time>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                  {article.frontmatter.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {article.frontmatter.description}
                </p>
              </Link>
            </article>
          ))}
        </div>

        <LeadCaptureForm />
      </div>

      <MobileStickyCTA />
    </>
  );
}
