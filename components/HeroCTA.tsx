"use client";

export default function HeroCTA() {
  function scrollToForm() {
    document
      .getElementById("lead-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToForm}
      className="mt-3 mb-8 bg-blue-600 text-white py-2.5 px-6 rounded-md text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
    >
      Get a Free Estimate
    </button>
  );
}
