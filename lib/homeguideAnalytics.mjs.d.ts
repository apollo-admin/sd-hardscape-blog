export const HOMEGUIDE_SITE: "homeguideiq";
export const LEAD_SOURCE: "homeguideiq_blog";
export const CAMPAIGN_ID: "homeguideiq";
export const FORM_ID: "homeguideiq_lead_form";

export type AnalyticsValue = string | number | boolean | null;
export type AnalyticsProperties = Record<string, AnalyticsValue>;

export function getHomeGuidePageContext(
  pathname?: string | null,
): AnalyticsProperties;

export function getTrackingQueryProperties(
  search?: string | null,
): AnalyticsProperties;

export function getReferrerDomain(referrer?: string | null): string | null;

export function getPostHogPageViewProperties(input: {
  pathname?: string | null;
  search?: string | null;
  referrer?: string | null;
}): AnalyticsProperties;

export function getHomeGuideLeadAttribution(input: {
  pathname?: string | null;
  search?: string | null;
  referrer?: string | null;
  sessionId?: string | null;
  anonymousId?: string | null;
}): AnalyticsProperties;

export function getGa4GenerateLeadParams(input: {
  pathname?: string | null;
  projectType?: string | null;
  internalTest?: boolean | null;
}): AnalyticsProperties;

export function getPostHogLeadFunnelProperties(input: {
  pathname?: string | null;
  search?: string | null;
  referrer?: string | null;
  projectType?: string | null;
  budget?: string | null;
  timeline?: string | null;
  internalTest?: boolean | null;
  sessionId?: string | null;
  anonymousId?: string | null;
}): AnalyticsProperties;

export function sanitizeAnalyticsProperties(
  properties?: Record<string, unknown> | null,
): AnalyticsProperties;
