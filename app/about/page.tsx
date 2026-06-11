import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "About HomeGuide IQ and how our San Diego outdoor project cost guides are produced.",
};

export default function AboutPage() {
  return (
    <article className="max-w-[760px] mx-auto pb-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        About
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight mb-4">
        HomeGuide IQ helps San Diego homeowners price outdoor projects before
        they call a contractor.
      </h1>
      <p className="text-lg text-gray-600 leading-8 mb-8">
        We publish cost guides for pavers, turf, concrete patios, pool decks,
        pergolas, fire features, and full backyard remodels across San Diego
        County.
      </p>

      <div className="space-y-6 text-gray-700 leading-7">
        <p>
          The guides are designed for planning: realistic installed ranges,
          line-item cost drivers, San Diego-specific site conditions, and the
          proposal details homeowners should compare before moving forward.
        </p>
        <p>
          When a homeowner submits the estimate form, HomeGuide IQ routes the
          request to a vetted San Diego outdoor living partner for follow-up.
          It is not a bid auction and we do not sell the same request to a list
          of unrelated contractors.
        </p>
        <p>
          For more detail on sourcing and update cadence, read our{" "}
          <Link href="/methodology" className="text-blue-600 underline">
            methodology
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
