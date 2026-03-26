import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Outdoor Cost Guide",
    template: "%s | Outdoor Cost Guide",
  },
  description:
    "Real pricing for outdoor projects — not national averages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="y0hEjg_Og9_KQmk0z4xrNpvkpZnjFkhunjL0JC6afLY" />
        {/* GA4 measurement ID */}
      </head>
      <body className="min-h-screen antialiased">
        <header className="border-b border-gray-200">
          <div className="mx-auto max-w-[720px] px-5 py-4">
            <Link
              href="/"
              className="text-lg font-semibold text-gray-900 no-underline hover:text-gray-700"
            >
              Outdoor Cost Guide
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-[720px] px-5 py-8">{children}</main>
        <footer className="border-t border-gray-200 mt-16">
          <div className="mx-auto max-w-[720px] px-5 py-6 text-sm text-gray-500">
            &copy; 2026 Outdoor Cost Guide. For informational purposes only.
          </div>
        </footer>
      </body>
    </html>
  );
}
