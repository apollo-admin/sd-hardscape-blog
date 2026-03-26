import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string;
  updated: string;
  author: string;
  slug: string;
  market: string;
  marketName: string;
  keywords: string[];
  schema: {
    type: string;
    offers: {
      type: string;
      lowPrice: number;
      highPrice: number;
      priceCurrency: string;
      unitText: string;
    };
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
  market: string;
  slug: string;
}

export function getArticleBySlug(
  market: string,
  slug: string
): Article | null {
  const filePath = path.join(contentDirectory, market, "cost", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data as ArticleFrontmatter,
    content,
    market,
    slug,
  };
}

export function getAllArticles(): Article[] {
  const markets = getMarkets();
  const articles: Article[] = [];

  for (const market of markets) {
    const costDir = path.join(contentDirectory, market, "cost");
    if (!fs.existsSync(costDir)) continue;

    const files = fs.readdirSync(costDir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const slug = file.replace(".mdx", "");
      const article = getArticleBySlug(market, slug);
      if (article) articles.push(article);
    }
  }

  return articles.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getArticlesByMarket(market: string): Article[] {
  return getAllArticles().filter((a) => a.market === market);
}

export function getMarkets(): string[] {
  if (!fs.existsSync(contentDirectory)) return [];
  return fs
    .readdirSync(contentDirectory)
    .filter((f) => fs.statSync(path.join(contentDirectory, f)).isDirectory());
}
