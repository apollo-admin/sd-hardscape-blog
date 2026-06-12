import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import HeaderCTA from "@/components/HeaderCTA";
import PostHogInit from "@/components/PostHogInit";
import "./globals.css";

const siteUrl = new URL("https://www.homeguideiq.com");
const ogImage = "/opengraph-image";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HomeGuide IQ",
  url: siteUrl.toString(),
  description:
    "San Diego outdoor living cost guides for hardscape, pavers, turf, concrete, pergolas, fire features, and backyard remodels.",
  publisher: {
    "@type": "Organization",
    name: "HomeGuide IQ",
    url: siteUrl.toString(),
  },
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "HomeGuide IQ - San Diego Outdoor Project Cost Guides",
    template: "%s | HomeGuide IQ",
  },
  description:
    "Line-item San Diego pricing for pavers, turf, concrete patios, pergolas, pool decks, fire features, and backyard remodels.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HomeGuide IQ - San Diego Outdoor Project Cost Guides",
    description:
      "Local cost guides for San Diego homeowners planning hardscape, turf, pavers, pergolas, fire features, and backyard remodels.",
    url: "/",
    siteName: "HomeGuide IQ",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "HomeGuide IQ San Diego outdoor project cost guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HomeGuide IQ - San Diego Outdoor Project Cost Guides",
    description:
      "Local cost guides for San Diego homeowners planning hardscape, turf, pavers, pergolas, fire features, and backyard remodels.",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="y0hEjg_Og9_KQmk0z4xrNpvkpZnjFkhunjL0JC6afLY"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased text-base">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PH5DT7C5CS"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-PH5DT7C5CS');`}
        </Script>
        <PostHogInit />
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="mx-auto max-w-[960px] px-5 py-3 flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-lg font-bold no-underline"
                style={{ color: "var(--color-brand)" }}
              >
                HomeGuide IQ
              </Link>
              <p className="text-xs text-gray-500 hidden sm:block -mt-0.5">
                Real costs. Local contractors. No guesswork.
              </p>
            </div>
            <HeaderCTA />
          </div>
        </header>
        <main className="mx-auto max-w-[960px] px-5 py-8">{children}</main>
        <footer className="border-t border-gray-200 mt-16 bg-white">
          <div className="mx-auto max-w-[960px] px-5 py-6 text-sm text-gray-500">
            <p>
              &copy; 2026 HomeGuide IQ. San Diego outdoor project pricing for
              homeowner planning.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
              <Link href="/about" className="hover:text-gray-900">
                About
              </Link>
              <Link href="/methodology" className="hover:text-gray-900">
                Methodology
              </Link>
              <Link href="/privacy" className="hover:text-gray-900">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
