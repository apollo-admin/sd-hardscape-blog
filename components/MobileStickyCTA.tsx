"use client";

import { captureHomeGuideCtaClick } from "@/lib/homeguideBrowserAnalytics";

export default function MobileStickyCTA() {
  function scrollToForm() {
    captureHomeGuideCtaClick("mobile_sticky_estimate", "mobile_sticky");
    document
      .getElementById("lead-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-3">
      <button
        onClick={scrollToForm}
        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
      >
        Get a Free Estimate
      </button>
    </div>
  );
}
