import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesByMarket, getMarkets } from "@/lib/mdx";
import type { Metadata } from "next";

const marketNames: Record<string, string> = {
  "san-diego": "San Diego",
};

export async function generateStaticParams() {
  return getMarkets().map((market) => ({ market }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string }>;
}): Promise<Metadata> {
  const { market } = await params;
  const name = marketNames[market] || market;
  return {
    title: `${name} Outdoor Project Cost Guides`,
    description: `Cost guides for ${name} outdoor projects, updated for 2026.`,
  };
}

export default async function MarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const articles = getArticlesByMarket(market);
  if (!articles.length) notFound();

  const name = marketNames[market] || market;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        {name} Cost Guides
      </h1>
      <p className="text-gray-600 mb-8">
        Cost guides for {name} outdoor projects, updated for 2026.
      </p>

      <div className="space-y-6">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="border-b border-gray-100 pb-6"
          >
            <Link
              href={`/${article.market}/cost/${article.slug}`}
              className="block group no-underline"
            >
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                {article.frontmatter.title}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                {article.frontmatter.description}
              </p>
              <time className="text-xs text-gray-400">
                {article.frontmatter.date}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
