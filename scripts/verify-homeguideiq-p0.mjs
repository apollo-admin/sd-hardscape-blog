import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertContains(source, needle, message) {
  assert.ok(source.includes(needle), message);
}

function assertNotContains(source, needle, message) {
  assert.ok(!source.includes(needle), message);
}

async function loadHomeGuideAnalytics() {
  return import(`../lib/homeguideAnalytics.mjs?cacheBust=${Date.now()}`);
}

function assertNoPiiProperties(properties, context) {
  for (const key of Object.keys(properties)) {
    assert.ok(
      !/^(name|email|phone|zip|address|message|lead_id|raw_payload|payload)$/i.test(
        key,
      ),
      `${context} must not include PII-like property ${key}`,
    );
  }
}

const analytics = await loadHomeGuideAnalytics();

{
  const context = analytics.getHomeGuidePageContext(
    "/san-diego/cost/paver-patio-cost",
  );
  assert.equal(context.market, "san-diego");
  assert.equal(context.page_type, "cost_guide");
  assert.equal(context.content_slug, "paver-patio-cost");
}

{
  const params = analytics.getGa4GenerateLeadParams({
    pathname: "/san-diego/cost/paver-patio-cost",
    projectType: "Pavers",
    internalTest: true,
  });
  assert.equal(params.lead_source, "homeguideiq_blog");
  assert.equal(params.campaign_id, "homeguideiq");
  assert.equal(params.project_type, "Pavers");
  assert.equal(params.market, "san-diego");
  assert.equal(params.page_type, "cost_guide");
  assert.equal(params.content_slug, "paver-patio-cost");
  assert.equal(params.form_id, "homeguideiq_lead_form");
  assert.equal(params.internal_test, true);
  assertNoPiiProperties(params, "GA4 generate_lead");
}

{
  const posthogProps = analytics.getPostHogLeadFunnelProperties({
    pathname: "/san-diego",
    projectType: "Turf",
    budget: "$25K-$50K",
    timeline: "1-3 months",
    internalTest: false,
  });
  assert.equal(posthogProps.lead_source, "homeguideiq_blog");
  assert.equal(posthogProps.campaign_id, "homeguideiq");
  assert.equal(posthogProps.budget_range, "$25K-$50K");
  assert.equal(posthogProps.timeline, "1-3 months");
  assertNoPiiProperties(posthogProps, "PostHog lead funnel");
}

{
  const scrubbed = analytics.sanitizeAnalyticsProperties({
    lead_source: "homeguideiq_blog",
    zip: "92101",
    email: "owner@example.com",
    lead_id: "abc",
    current_url: "https://www.homeguideiq.com/san-diego?email=x",
  });
  assert.equal(scrubbed.lead_source, "homeguideiq_blog");
  assert.equal(scrubbed.zip, undefined);
  assert.equal(scrubbed.email, undefined);
  assert.equal(scrubbed.lead_id, undefined);
  assert.equal(scrubbed.current_url, "https://www.homeguideiq.com/san-diego");
}

const layoutSource = read("app/layout.tsx");
assertContains(
  layoutSource,
  "PostHogInit",
  "layout must render the PostHog init component",
);
assertNotContains(
  layoutSource,
  "fonts.googleapis.com",
  "layout must not load render-blocking Google Fonts CSS",
);
const postHogInitSource = read("components/PostHogInit.tsx");
assertContains(
  postHogInitSource,
  "utm_source",
  "PostHog page view must preserve UTM parameters",
);
assertContains(
  postHogInitSource,
  "gclid",
  "PostHog page view must preserve Google click IDs",
);
assertNotContains(
  postHogInitSource,
  "posthog.identify",
  "HomeGuide must not identify homeowners in PostHog",
);

for (const [file, canonical] of [
  ["app/[market]/page.tsx", "`/${market}`"],
  ["app/about/page.tsx", '"/about"'],
  ["app/methodology/page.tsx", '"/methodology"'],
  ["app/privacy/page.tsx", '"/privacy"'],
]) {
  const source = read(file);
  assertContains(source, "alternates", `${file} must set alternates`);
  assertContains(source, "canonical", `${file} must set canonical`);
  assertContains(source, canonical, `${file} must set route canonical`);
  assertContains(source, "openGraph", `${file} must set Open Graph metadata`);
  assertContains(source, "twitter", `${file} must set Twitter metadata`);
}

const privacySource = read("app/privacy/page.tsx");
assertContains(
  privacySource,
  "index: false",
  "privacy page should be noindexed via Metadata robots.index=false",
);

const sitemapSource = read("app/sitemap.ts");
assertContains(
  sitemapSource,
  "/about",
  "dynamic sitemap must include the about page",
);
assertContains(
  sitemapSource,
  "/methodology",
  "dynamic sitemap must include the methodology page",
);
assert.ok(
  !fs.existsSync(path.join(root, "public/sitemap.xml")),
  "stale public/sitemap.xml must be removed so app/sitemap.ts owns sitemap.xml",
);
assert.ok(
  !fs.existsSync(path.join(root, "public/sitemap-static.xml")),
  "stale public/sitemap-static.xml must be removed",
);

const robotsSource = read("app/robots.ts");
assertContains(robotsSource, 'disallow: "/api/"', "robots must disallow /api/");

const schemaSource = read("lib/schema.ts");
assert.ok(
  fs.existsSync(path.join(root, "app/opengraph-image.tsx")),
  "root opengraph-image.tsx must provide a reusable social image",
);
assertContains(
  schemaSource,
  "image",
  "article schema must expose a reusable image URL",
);
assertContains(
  schemaSource,
  "generateBreadcrumbListSchema",
  "schema helpers must include BreadcrumbList generation",
);
assertContains(
  read("components/ArticleLayout.tsx"),
  "generateBreadcrumbListSchema",
  "article layout must emit BreadcrumbList JSON-LD",
);

console.log("HomeGuide IQ P0 verification passed");
