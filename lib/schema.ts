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

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updated || article.date,
    author: {
      "@type": "Organization",
      name: article.author || "HomeGuide IQ Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "HomeGuide IQ",
      url: "https://www.homeguideiq.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
