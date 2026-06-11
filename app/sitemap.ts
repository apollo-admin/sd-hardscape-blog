import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/mdx";

const BASE_URL = "https://www.homeguideiq.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleUrls = articles.map((article) => ({
    url: `${BASE_URL}/${article.market}/cost/${article.slug}`,
    lastModified: new Date(article.frontmatter.updated || article.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/san-diego`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...articleUrls,
  ];
}
