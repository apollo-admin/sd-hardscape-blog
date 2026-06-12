import Script from "next/script";

const postHogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const postHogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

function escapeForInlineScript(value: string) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default function PostHogInit() {
  if (!postHogToken) {
    return null;
  }

  return (
    <Script id="posthog-init" strategy="afterInteractive">
      {`
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags reloadFeatureFlags getFeatureFlag getFeatureFlagPayload group get_group_property captureException startSessionRecording stopSessionRecording".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])}}(document,window.posthog||[]);
function homeGuideScrubPostHogEvent(event) {
  var blocked = {
    name: true,
    email: true,
    phone: true,
    zip: true,
    address: true,
    message: true,
    lead_id: true,
    raw_payload: true,
    payload: true
  };
  var props = event && event.properties ? event.properties : {};
  for (var key in props) {
    if (Object.prototype.hasOwnProperty.call(blocked, String(key).toLowerCase())) {
      return null;
    }
    if (typeof props[key] === "string" && /^https?:\\/\\//i.test(props[key])) {
      props[key] = props[key].split("?")[0].split("#")[0];
    }
  }
  return event;
}
posthog.init(${escapeForInlineScript(postHogToken)}, {
  api_host: ${escapeForInlineScript(postHogHost)},
  defaults: "2026-01-30",
  autocapture: false,
  capture_pageview: false,
  capture_pageleave: false,
  person_profiles: "identified_only",
  enable_recording_console_log: false,
  before_send: homeGuideScrubPostHogEvent,
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: "*",
    maskCapturedNetworkRequestFn: function(request) {
      if (request && request.name) {
        request.name = request.name.split("?")[0].split("#")[0];
      }
      return request;
    }
  }
});
var homeGuidePathParts = location.pathname.split("/").filter(Boolean);
var homeGuideParams = new URLSearchParams(location.search);
var homeGuidePageView = {
  site: "homeguideiq",
  market: "san-diego",
  page_type: location.pathname === "/" ? "home" : homeGuidePathParts[1] === "cost" ? "cost_guide" : homeGuidePathParts[0] || "unknown",
  content_slug: homeGuidePathParts[1] === "cost" ? homeGuidePathParts[2] : location.pathname === "/" ? "home" : homeGuidePathParts.join("/") || "unknown",
  referrer_domain: document.referrer ? new URL(document.referrer).hostname.replace(/^www\\./, "") : null
};
["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","gbraid","wbraid"].forEach(function(key) {
  var value = homeGuideParams.get(key);
  if (value) {
    homeGuidePageView[key] = value.slice(0, 160);
  }
});
posthog.capture("hg_page_viewed", homeGuidePageView);
`}
    </Script>
  );
}
