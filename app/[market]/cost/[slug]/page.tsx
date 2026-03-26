import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getArticleBySlug, getAllArticles } from "@/lib/mdx";
import { mdxComponents } from "@/components/MDXComponents";
import ArticleLayout from "@/components/ArticleLayout";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    market: article.market,
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string; slug: string }>;
}): Promise<Metadata> {
  const { market, slug } = await params;
  const article = getArticleBySlug(market, slug);
  if (!article) return {};

  const { frontmatter } = article;
  const url = `/${market}/cost/${slug}`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: "article",
      url,
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.updated,
      authors: [frontmatter.author],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ market: string; slug: string }>;
}) {
  const { market, slug } = await params;
  const article = getArticleBySlug(market, slug);
  if (!article) notFound();

  return (
    <ArticleLayout frontmatter={article.frontmatter}>
      <MDXRemote
        source={article.content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </ArticleLayout>
  );
}
