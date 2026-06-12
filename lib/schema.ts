export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateAggregateOfferSchema(offers: {
  lowPrice: number;
  highPrice: number;
  priceCurrency: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    lowPrice: offers.lowPrice,
    highPrice: offers.highPrice,
    priceCurrency: offers.priceCurrency,
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  market: string;
  slug: string;
}) {
  const url = `https://www.homeguideiq.com/${article.market}/cost/${article.slug}`;
  const imageUrl = "https://www.homeguideiq.com/opengraph-image";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updated || article.date,
    image: imageUrl,
    author: {
      "@type": "Organization",
      name: article.author || "HomeGuide IQ Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "HomeGuide IQ",
      url: "https://www.homeguideiq.com",
      logo: {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function generateBreadcrumbListSchema(article: {
  title: string;
  market: string;
  marketName: string;
  slug: string;
}) {
  const marketUrl = `https://www.homeguideiq.com/${article.market}`;
  const articleUrl = `${marketUrl}/cost/${article.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "HomeGuide IQ",
        item: "https://www.homeguideiq.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${article.marketName} Cost Guides`,
        item: marketUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };
}
