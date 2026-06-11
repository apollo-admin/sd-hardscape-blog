"use client";

import { useState, FormEvent } from "react";

type GtagEventParams = Record<string, string | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params: GtagEventParams,
    ) => void;
  }
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export default function LeadCaptureForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const internalTest =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("homeguide_test") === "1";
    const data = {
      name: getFormString(formData, "name"),
      phone: getFormString(formData, "phone"),
      email: getFormString(formData, "email"),
      zip: getFormString(formData, "zip"),
      projectType: getFormString(formData, "projectType"),
      budget: getFormString(formData, "budget"),
      timeline: getFormString(formData, "timeline"),
      message: getFormString(formData, "message"),
      page: typeof window !== "undefined" ? window.location.pathname : null,
      internalTest,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseBody = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };
      if (!response.ok || responseBody.success !== true) {
        throw new Error(
          responseBody.error ?? "Lead submission failed. Please try again.",
        );
      }
      window.gtag?.("event", "generate_lead", {
        source: "homeguideiq_blog",
        project_type: data.projectType || null,
        zip: data.zip || null,
        page: data.page,
        internal_test: data.internalTest,
      });
      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        id="lead-form"
        className="bg-green-50 border border-green-200 rounded-lg p-6 my-10 text-center"
      >
        <p className="text-green-800 font-medium">
          Thanks - your request was routed to a San Diego outdoor living
          partner.
        </p>
        <p className="text-sm text-green-700 mt-2">
          They&apos;ll follow up using the phone or email you provided.
        </p>
      </div>
    );
  }

  return (
    <form
      id="lead-form"
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-10"
    >
      <h3 className="text-xl font-semibold mb-1 text-gray-900">
        Get a Free Estimate
      </h3>
      <p className="text-gray-600 text-sm mb-5">
        Tell us about your project and we&apos;ll route it to a vetted San Diego
        outdoor living partner.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="(619) 555-0123"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="zip"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            required
            inputMode="numeric"
            pattern="[0-9]{5}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="92101"
          />
        </div>

        <div>
          <label
            htmlFor="projectType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Type <span className="text-red-500">*</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Select a project type</option>
            <option value="Pavers">Pavers</option>
            <option value="Outdoor Kitchen">Outdoor Kitchen</option>
            <option value="Pergola">Pergola</option>
            <option value="Retaining Wall">Retaining Wall</option>
            <option value="Concrete">Concrete</option>
            <option value="Turf">Turf</option>
            <option value="Fencing">Fencing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Budget Range
          </label>
          <select
            id="budget"
            name="budget"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Select a budget range</option>
            <option value="Under $10K">Under $10K</option>
            <option value="$10K-$25K">$10K-$25K</option>
            <option value="$25K-$50K">$25K-$50K</option>
            <option value="$50K-$100K">$50K-$100K</option>
            <option value="$100K+">$100K+</option>
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="timeline"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Select a timeline</option>
            <option value="ASAP">ASAP</option>
            <option value="Next 30 days">Next 30 days</option>
            <option value="1-3 months">1-3 months</option>
            <option value="3+ months">3+ months</option>
            <option value="Just planning">Just planning</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Notes
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us what you want built, where it is, and any site constraints."
          />
        </div>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Submitting..." : "Get My Free Estimate"}
        </button>

        <p className="text-xs text-gray-500 leading-5">
          By submitting, you agree that HomeGuide IQ may route your project
          details to a San Diego outdoor living partner for follow-up.
        </p>
      </div>
    </form>
  );
}
