import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PARTNER_LEADS_ENDPOINT =
  process.env.PARTNER_LEADS_ENDPOINT ??
  "https://api.revko.co/api/partner-leads";

const RESEND_EMAIL_ENDPOINT =
  process.env.HOMEGUIDE_INTERNAL_TEST_EMAIL_ENDPOINT ??
  "https://api.resend.com/emails";

const PROJECT_TYPE_MAP: Record<string, string> = {
  pavers: "pavers",
  "outdoor kitchen": "outdoor_kitchen",
  "retaining wall": "retaining_wall",
  "fire feature": "fire_feature",
  pergola: "other",
  concrete: "other",
  turf: "other",
  fencing: "other",
  other: "other",
};

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function scrubUrl(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, parsed.pathname === "/" ? "/" : "");
  } catch {
    return raw.split("?")[0].split("#")[0] || null;
  }
}

function normalizeProjectType(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  const direct = PROJECT_TYPE_MAP[raw.toLowerCase()];
  return direct ?? null;
}

function error(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

async function sendInternalTestEmail(params: {
  to: string;
  leadId: string;
  payload: Record<string, unknown>;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && !process.env.HOMEGUIDE_INTERNAL_TEST_EMAIL_ENDPOINT) {
    throw new Error("RESEND_API_KEY missing");
  }

  const subject = `HomeGuide IQ test lead: ${params.leadId}`;
  const textBody = [
    "HomeGuide IQ internal test lead submitted.",
    "",
    `Lead ID: ${params.leadId}`,
    `Name: ${String(params.payload.contact_name ?? "Not provided")}`,
    `Phone: ${String(params.payload.contact_phone ?? "Not provided")}`,
    `Email: ${String(params.payload.contact_email ?? "Not provided")}`,
    `Project: ${String(params.payload.project_type ?? "Not specified")}`,
    `ZIP: ${String(params.payload.zip_code ?? "Not provided")}`,
    "",
    "This confirms the HomeGuide form reached the lead API and sent the internal test email.",
  ].join("\n");

  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      from: process.env.HOMEGUIDE_EMAIL_FROM ?? "HomeGuide IQ <leads@revko.co>",
      to: params.to,
      subject,
      text: textBody,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`email failed: ${response.status} ${body}`);
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return error("Invalid JSON body.", 400);
  }

  const contactName = text(body.name);
  const contactPhone = text(body.phone);
  const contactEmail = text(body.email);
  const zipCode = text(body.zip);
  const rawProjectType = text(body.projectType);
  const projectType = normalizeProjectType(body.projectType);
  const budgetRange = text(body.budget);
  const timeline = text(body.timeline);
  const homeownerMessage = text(body.message);
  const internalTest = body.internalTest === true;
  const referrer = scrubUrl(body.referrer);
  const landingPage = text(body.landing_page) ?? text(body.page);
  const guideSlug = text(body.guide_slug);
  const variantId = text(body.variant_id);
  const sessionId = text(body.session_id);
  const anonymousId = text(body.anonymous_id);
  const rawUtm = {
    utm_source: text(body.utm_source),
    utm_medium: text(body.utm_medium),
    utm_campaign: text(body.utm_campaign),
    utm_content: text(body.utm_content),
    utm_term: text(body.utm_term),
    gclid: text(body.gclid),
    gbraid: text(body.gbraid),
    wbraid: text(body.wbraid),
  };

  if (!contactPhone) {
    return error("Phone is required so the contractor can call you back.", 400);
  }
  if (!contactEmail) {
    return error("Email is required.", 400);
  }
  if (rawProjectType && !projectType) {
    return error("Unsupported project type.", 400);
  }

  const message = [
    rawProjectType ? `HomeGuide project: ${rawProjectType}` : null,
    budgetRange ? `Budget: ${budgetRange}` : null,
    timeline ? `Timeline: ${timeline}` : null,
    homeownerMessage ? `Notes: ${homeownerMessage}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const partnerPayload: Record<string, unknown> = {
    partner_id: "isaac_col",
    source: "organic",
    campaign_id: "homeguideiq",
    contact_name: contactName,
    contact_phone: contactPhone,
    contact_email: contactEmail,
    project_type: projectType,
    budget_range: budgetRange,
    timeline,
    zip_code: zipCode,
    message: message || null,
    lead_source: "homeguideiq_blog",
    utm_source: text(body.utm_source),
    utm_medium: text(body.utm_medium),
    utm_campaign: text(body.utm_campaign),
    utm_content: text(body.utm_content),
    utm_term: text(body.utm_term),
    raw_utm: rawUtm,
    raw_payload: {
      source_site: "homeguideiq.com",
      page: text(body.page),
      referrer,
      landing_page: landingPage,
      guide_slug: guideSlug,
      variant_id: variantId,
      session_id: sessionId,
      anonymous_id: anonymousId,
      project_type_label: rawProjectType,
      budget_range: budgetRange,
      timeline,
      homeowner_message: homeownerMessage,
      internal_test: internalTest,
      internal_test_email: internalTest
        ? process.env.HOMEGUIDE_INTERNAL_TEST_EMAIL
        : null,
    },
  };

  let partnerResponse: Response;
  try {
    partnerResponse = await fetch(PARTNER_LEADS_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(partnerPayload),
    });
  } catch (fetchError) {
    console.error("[homeguideiq-leads] partner endpoint fetch failed", fetchError);
    return error("Lead service unavailable. Please try again.", 502);
  }

  const partnerBody = (await partnerResponse
    .json()
    .catch(() => ({}))) as { lead_id?: string; error?: string };

  if (!partnerResponse.ok || !partnerBody.lead_id) {
    console.error("[homeguideiq-leads] partner endpoint rejected lead", {
      status: partnerResponse.status,
      error: partnerBody.error,
    });
    return error(
      partnerBody.error ?? "Lead service rejected the submission.",
      partnerResponse.ok ? 502 : partnerResponse.status,
    );
  }

  if (internalTest) {
    const internalEmail = process.env.HOMEGUIDE_INTERNAL_TEST_EMAIL;
    if (!internalEmail) {
      return error("Internal test email is not configured.", 500);
    }

    try {
      await sendInternalTestEmail({
        to: internalEmail,
        leadId: partnerBody.lead_id,
        payload: partnerPayload,
      });
    } catch (emailError) {
      console.error("[homeguideiq-leads] internal test email failed", emailError);
      return error("Lead saved, but internal test email failed.", 502);
    }
  }

  return NextResponse.json({
    success: true,
    lead_id: partnerBody.lead_id,
  });
}
