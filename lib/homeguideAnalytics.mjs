export const HOMEGUIDE_SITE = "homeguideiq";
export const LEAD_SOURCE = "homeguideiq_blog";
export const CAMPAIGN_ID = "homeguideiq";
export const FORM_ID = "homeguideiq_lead_form";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];
const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"];
const BLOCKED_PROPERTY_KEYS = new Set([
  "name",
  "email",
  "phone",
  "zip",
  "address",
  "message",
  "lead_id",
  "raw_payload",
  "payload",
]);

function cleanPathname(pathname) {
  if (typeof pathname !== "string" || pathname.trim() === "") {
    return "/";
  }
  const withoutQuery = pathname.split("?")[0].split("#")[0];
  return withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
}

function nullableString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function stripQuery(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!/^https?:\/\//i.test(value)) {
    return value.split("?")[0].split("#")[0];
  }
  try {
    const parsed = new URL(value);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, parsed.pathname === "/" ? "/" : "");
  } catch {
    return value.split("?")[0].split("#")[0];
  }
}

function getVariantId(search) {
  if (typeof search !== "string" || search.trim() === "") {
    return "estimate_v1";
  }
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  return (
    nullableString(params.get("variant_id")) ??
    nullableString(params.get("variant")) ??
    nullableString(params.get("hg_variant")) ??
    "estimate_v1"
  );
}

export function getHomeGuidePageContext(pathname) {
  const path = cleanPathname(pathname);
  const parts = path.split("/").filter(Boolean);
  const market = parts[0] || "san-diego";

  if (path === "/") {
    return {
      site: HOMEGUIDE_SITE,
      market: "san-diego",
      page_type: "home",
      content_slug: "home",
    };
  }

  if (parts[1] === "cost" && parts[2]) {
    return {
      site: HOMEGUIDE_SITE,
      market,
      page_type: "cost_guide",
      content_slug: parts[2],
    };
  }

  if (parts.length === 1 && market === "san-diego") {
    return {
      site: HOMEGUIDE_SITE,
      market,
      page_type: "market_hub",
      content_slug: market,
    };
  }

  return {
    site: HOMEGUIDE_SITE,
    market: market === "about" || market === "methodology" || market === "privacy"
      ? "san-diego"
      : market,
    page_type: parts[0] || "unknown",
    content_slug: parts.join("/") || "unknown",
  };
}

export function getTrackingQueryProperties(search) {
  const properties = {};
  if (typeof search !== "string" || search.trim() === "") {
    return properties;
  }
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const value = params.get(key);
    if (value) {
      properties[key] = value.slice(0, 160);
    }
  }
  return properties;
}

export function getReferrerDomain(referrer) {
  if (typeof referrer !== "string" || referrer.trim() === "") {
    return null;
  }
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host || null;
  } catch {
    return null;
  }
}

export function getPostHogPageViewProperties({ pathname, search, referrer }) {
  return sanitizeAnalyticsProperties({
    ...getHomeGuidePageContext(pathname),
    ...getTrackingQueryProperties(search),
    referrer_domain: getReferrerDomain(referrer),
  });
}

export function getHomeGuideLeadAttribution({
  pathname,
  search,
  referrer,
  sessionId,
  anonymousId,
}) {
  const context = getHomeGuidePageContext(pathname);
  return sanitizeAnalyticsProperties({
    ...getTrackingQueryProperties(search),
    referrer: stripQuery(referrer),
    landing_page: cleanPathname(pathname),
    guide_slug: context.content_slug,
    variant_id: getVariantId(search),
    session_id: nullableString(sessionId),
    anonymous_id: nullableString(anonymousId),
  });
}

export function getGa4GenerateLeadParams({
  pathname,
  projectType,
  internalTest,
}) {
  return sanitizeAnalyticsProperties({
    ...getHomeGuidePageContext(pathname),
    lead_source: LEAD_SOURCE,
    campaign_id: CAMPAIGN_ID,
    project_type: nullableString(projectType),
    form_id: FORM_ID,
    internal_test: Boolean(internalTest),
  });
}

export function getPostHogLeadFunnelProperties({
  pathname,
  search,
  referrer,
  projectType,
  budget,
  timeline,
  internalTest,
  sessionId,
  anonymousId,
}) {
  return sanitizeAnalyticsProperties({
    ...getGa4GenerateLeadParams({ pathname, projectType, internalTest }),
    ...getTrackingQueryProperties(search),
    referrer_domain: getReferrerDomain(referrer),
    budget_range: nullableString(budget),
    timeline: nullableString(timeline),
    session_id: nullableString(sessionId),
    anonymous_id: nullableString(anonymousId),
    variant_id: getVariantId(search),
  });
}

export function sanitizeAnalyticsProperties(properties) {
  const sanitized = {};
  if (!properties || typeof properties !== "object") {
    return sanitized;
  }

  for (const [key, value] of Object.entries(properties)) {
    if (BLOCKED_PROPERTY_KEYS.has(key.toLowerCase())) {
      continue;
    }
    if (value === undefined) {
      continue;
    }
    if (typeof value === "string") {
      const cleanValue = stripQuery(value.trim());
      sanitized[key] = cleanValue ? cleanValue.slice(0, 200) : null;
      continue;
    }
    if (
      typeof value === "boolean" ||
      typeof value === "number" ||
      value === null
    ) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
