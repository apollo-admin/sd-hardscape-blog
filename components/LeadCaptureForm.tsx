"use client";

import { useState, FormEvent } from "react";

export default function LeadCaptureForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      zip: formData.get("zip"),
      projectType: formData.get("projectType"),
    };

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
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
          Thanks — we&apos;ll be in touch.
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
        Tell us about your project and we&apos;ll connect you with vetted
        contractors in your area.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your name"
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
            Zip Code
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="92101"
          />
        </div>

        <div>
          <label
            htmlFor="projectType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
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

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Submitting..." : "Get My Free Estimate"}
        </button>
      </div>
    </form>
  );
}
