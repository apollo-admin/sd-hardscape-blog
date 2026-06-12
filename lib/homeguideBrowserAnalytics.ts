"use client";

import {
  getHomeGuideLeadAttribution,
  getHomeGuidePageContext,
  sanitizeAnalyticsProperties,
} from "@/lib/homeguideAnalytics.mjs";

type AnalyticsProperties = Record<string, string | number | boolean | null>;

type PostHogClient = {
  capture?: (eventName: string, properties?: AnalyticsProperties) => void;
};

declare global {
  interface Window {
    posthog?: PostHogClient;
  }
}

const ANONYMOUS_ID_KEY = "homeguideiq_anonymous_id";
const SESSION_ID_KEY = "homeguideiq_session_id";

function randomId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function readOrCreateStorageValue(key: string, prefix: string) {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(key);
    if (stored) return stored;
    const value = randomId(prefix);
    window.localStorage.setItem(key, value);
    return value;
  } catch {
    return randomId(prefix);
  }
}

export function getHomeGuideAnonymousId() {
  return readOrCreateStorageValue(ANONYMOUS_ID_KEY, "hg_anon");
}

export function getHomeGuideSessionId() {
  return readOrCreateStorageValue(SESSION_ID_KEY, "hg_session");
}

export function captureHomeGuideEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  window.posthog?.capture?.(
    eventName,
    sanitizeAnalyticsProperties(properties) as AnalyticsProperties,
  );
}

export function captureHomeGuideCtaClick(
  ctaId: string,
  ctaLocation: string,
) {
  const pageContext =
    typeof window === "undefined"
      ? (getHomeGuidePageContext("/") as Record<string, unknown>)
      : (getHomeGuidePageContext(window.location.pathname) as Record<
          string,
          unknown
        >);

  captureHomeGuideEvent("hg_cta_clicked", {
    ...pageContext,
    cta_id: ctaId,
    cta_location: ctaLocation,
  });
}

export function getHomeGuideBrowserLeadAttribution() {
  if (typeof window === "undefined") {
    return {};
  }

  return getHomeGuideLeadAttribution({
    pathname: window.location.pathname,
    search: window.location.search,
    referrer: document.referrer,
    sessionId: getHomeGuideSessionId(),
    anonymousId: getHomeGuideAnonymousId(),
  }) as Record<string, string | number | boolean | null>;
}
