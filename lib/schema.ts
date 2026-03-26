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
