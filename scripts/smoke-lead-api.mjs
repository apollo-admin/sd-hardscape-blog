import http from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";

const BLOG_PORT = 4329;
const PARTNER_PORT = 4330;
const BLOG_URL = `http://127.0.0.1:${BLOG_PORT}`;
const PARTNER_URL = `http://127.0.0.1:${PARTNER_PORT}/api/partner-leads`;
const EMAIL_URL = `http://127.0.0.1:${PARTNER_PORT}/emails`;

const received = [];
const emails = [];

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

const partnerServer = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/emails") {
    const payload = await readJson(req);
    emails.push(payload);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ id: "email-smoke-123" }));
    return;
  }

  if (req.method !== "POST" || req.url !== "/api/partner-leads") {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
    return;
  }

  const payload = await readJson(req);
  received.push(payload);

  if (payload.contact_email === "fail@example.com") {
    res.writeHead(503, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "partner unavailable" }));
    return;
  }

  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: true, lead_id: "lead-smoke-123" }));
});

function waitForReady(proc) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Next dev server did not become ready"));
    }, 30_000);

    const onData = (chunk) => {
      const text = chunk.toString();
      if (text.includes("Ready")) {
        clearTimeout(timeout);
        resolve();
      }
    };

    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);
    proc.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Next dev server exited early with code ${code}`));
    });
  });
}

async function postLead(body) {
  return fetch(`${BLOG_URL}/api/leads`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

await new Promise((resolve) => partnerServer.listen(PARTNER_PORT, "127.0.0.1", resolve));

const next = spawn(
  "npm",
  ["run", "dev", "--", "-H", "127.0.0.1", "-p", String(BLOG_PORT)],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PARTNER_LEADS_ENDPOINT: PARTNER_URL,
      HOMEGUIDE_INTERNAL_TEST_EMAIL: "anthony@revko.co",
      HOMEGUIDE_INTERNAL_TEST_EMAIL_ENDPOINT: EMAIL_URL,
      RESEND_API_KEY: "resend-smoke-key",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

try {
  await waitForReady(next);

  const okResponse = await postLead({
    name: "Smoke Tester",
    phone: "+16195550123",
    email: "smoke@example.com",
    zip: "92101",
    projectType: "Pavers",
    page: "/san-diego/cost/paver-patio-cost",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "paver-cost-test",
    utm_content: "hero",
    utm_term: "paver patio cost",
    gclid: "test-gclid",
    gbraid: "test-gbraid",
    wbraid: "test-wbraid",
    referrer: "https://www.google.com/search?q=pavers",
    landing_page: "/san-diego/cost/paver-patio-cost",
    guide_slug: "paver-patio-cost",
    variant_id: "estimate_v1",
    session_id: "hg-session-123",
    anonymous_id: "hg-anon-456",
    internalTest: true,
  });

  if (!okResponse.ok) {
    throw new Error(`expected success response, got ${okResponse.status}`);
  }

  const okBody = await okResponse.json();
  if (okBody.success !== true || okBody.lead_id !== "lead-smoke-123") {
    throw new Error(`unexpected success body: ${JSON.stringify(okBody)}`);
  }

  const submitted = received[0];
  if (!submitted) throw new Error("partner endpoint did not receive payload");
  if (submitted.partner_id !== "isaac_col") throw new Error("partner_id not mapped");
  if (submitted.source !== "organic") throw new Error("source not organic");
  if (submitted.contact_name !== "Smoke Tester") throw new Error("name not mapped");
  if (submitted.contact_phone !== "+16195550123") throw new Error("phone not mapped");
  if (submitted.contact_email !== "smoke@example.com") throw new Error("email not mapped");
  if (submitted.project_type !== "pavers") throw new Error("project type not normalized");
  if (submitted.zip_code !== "92101") throw new Error("zip not mapped");
  if (submitted.lead_source !== "homeguideiq_blog") throw new Error("lead source not tagged");
  if (submitted.utm_source !== "google") throw new Error("utm_source not forwarded");
  if (submitted.utm_medium !== "cpc") throw new Error("utm_medium not forwarded");
  if (submitted.utm_campaign !== "paver-cost-test") throw new Error("utm_campaign not forwarded");
  if (submitted.utm_content !== "hero") throw new Error("utm_content not forwarded");
  if (submitted.utm_term !== "paver patio cost") throw new Error("utm_term not forwarded");
  if (submitted.raw_utm?.gclid !== "test-gclid") throw new Error("gclid not forwarded in raw_utm");
  if (submitted.raw_utm?.gbraid !== "test-gbraid") throw new Error("gbraid not forwarded in raw_utm");
  if (submitted.raw_utm?.wbraid !== "test-wbraid") throw new Error("wbraid not forwarded in raw_utm");
  if (submitted.raw_payload?.referrer !== "https://www.google.com/search") {
    throw new Error("referrer not scrubbed and forwarded");
  }
  if (submitted.raw_payload?.landing_page !== "/san-diego/cost/paver-patio-cost") {
    throw new Error("landing_page not forwarded");
  }
  if (submitted.raw_payload?.guide_slug !== "paver-patio-cost") {
    throw new Error("guide_slug not forwarded");
  }
  if (submitted.raw_payload?.variant_id !== "estimate_v1") {
    throw new Error("variant_id not forwarded");
  }
  if (submitted.raw_payload?.session_id !== "hg-session-123") {
    throw new Error("session_id not forwarded");
  }
  if (submitted.raw_payload?.anonymous_id !== "hg-anon-456") {
    throw new Error("anonymous_id not forwarded");
  }
  if (submitted.raw_payload?.internal_test_email !== "anthony@revko.co") {
    throw new Error("internal test email not attached to raw payload");
  }

  const testEmail = emails[0];
  if (!testEmail) throw new Error("internal test email was not sent");
  if (testEmail.to !== "anthony@revko.co") throw new Error("internal test email recipient wrong");
  if (!String(testEmail.subject ?? "").includes("HomeGuide IQ test lead")) {
    throw new Error("internal test email subject wrong");
  }
  if (!String(testEmail.text ?? "").includes("lead-smoke-123")) {
    throw new Error("internal test email body missing lead id");
  }

  const failedResponse = await postLead({
    name: "Failure Tester",
    phone: "+16195550124",
    email: "fail@example.com",
    projectType: "Pavers",
  });

  if (failedResponse.ok) {
    throw new Error("expected upstream failure to return non-2xx");
  }

  console.log("lead API smoke passed");
} finally {
  next.kill("SIGTERM");
  partnerServer.close();
  await Promise.race([once(next, "exit"), new Promise((resolve) => setTimeout(resolve, 1000))]);
}
