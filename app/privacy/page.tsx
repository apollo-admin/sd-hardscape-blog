import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "HomeGuide IQ privacy policy for estimate requests.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "HomeGuide IQ Privacy Policy",
    description: "HomeGuide IQ privacy policy for estimate requests.",
    url: "/privacy",
    siteName: "HomeGuide IQ",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HomeGuide IQ Privacy Policy",
    description: "HomeGuide IQ privacy policy for estimate requests.",
    images: ["/opengraph-image"],
  },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-[760px] mx-auto pb-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Privacy
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight mb-4">
        Privacy Policy
      </h1>
      <p className="text-lg text-gray-600 leading-8 mb-8">
        HomeGuide IQ collects only the information needed to route an estimate
        request and understand site performance.
      </p>

      <div className="space-y-6 text-gray-700 leading-7">
        <p>
          If you submit an estimate request, we collect the contact details and
          project information you provide, including name, phone, email, ZIP
          code, project type, budget range, timeline, and notes.
        </p>
        <p>
          We use that information to route your request to a vetted San Diego
          outdoor living partner for follow-up and to understand whether the
          guide helped produce a qualified project inquiry.
        </p>
        <p>
          We may use analytics tools such as Google Analytics to measure page
          traffic and form conversion. We do not sell your estimate request to a
          marketplace of contractors.
        </p>
        <p>
          To request removal of a submitted lead, contact the business that
          followed up with you or reply to the original follow-up thread.
        </p>
      </div>
    </article>
  );
}
