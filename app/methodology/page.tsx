import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How HomeGuide IQ builds San Diego outdoor project pricing guides and estimate ranges.",
  alternates: {
    canonical: "/methodology",
  },
  openGraph: {
    title: "HomeGuide IQ Methodology",
    description:
      "How HomeGuide IQ builds San Diego outdoor project pricing guides and estimate ranges.",
    url: "/methodology",
    siteName: "HomeGuide IQ",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HomeGuide IQ Methodology",
    description:
      "How HomeGuide IQ builds San Diego outdoor project pricing guides and estimate ranges.",
    images: ["/opengraph-image"],
  },
};

export default function MethodologyPage() {
  return (
    <article className="max-w-[760px] mx-auto pb-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Methodology
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight mb-4">
        How HomeGuide IQ Builds San Diego Cost Ranges
      </h1>
      <p className="text-lg text-gray-600 leading-8 mb-8">
        Our ranges are planning estimates for installed outdoor projects in San
        Diego County, not generic national averages.
      </p>

      <div className="space-y-6 text-gray-700 leading-7">
        <p>
          We compare contractor-informed installed pricing, common scope tiers,
          material and labor assumptions, access constraints, demolition,
          drainage, permitting, and San Diego neighborhood/site conditions.
        </p>
        <p>
          Each guide separates base installation from add-ons so homeowners can
          see why two projects with the same square footage may price very
          differently.
        </p>
        <p>
          Pricing is reviewed periodically and pages show the current update
          date. Final project pricing still depends on site access, drainage,
          existing hardscape removal, material selections, permitting, and the
          contractor&apos;s in-person scope review.
        </p>
        <p>
          Estimate submissions are routed to a vetted San Diego outdoor living
          partner for follow-up. HomeGuide IQ does not represent that every
          listed range is a guaranteed quote.
        </p>
      </div>
    </article>
  );
}
