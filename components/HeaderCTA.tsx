"use client";

import { captureHomeGuideCtaClick } from "@/lib/homeguideBrowserAnalytics";

export default function HeaderCTA() {
  return (
    <a
      href="#lead-form"
      onClick={() => captureHomeGuideCtaClick("header_estimate", "header")}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#27ae60] hover:bg-[#219a52] rounded-lg transition-colors"
    >
      Get Free Estimate
    </a>
  );
}
