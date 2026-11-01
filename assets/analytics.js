!function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2===o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||(p=t.createElement("script"),p.type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

// Landing analytics: PostHog EU, cookieless. persistence "memory" keeps the anonymous ID in this page only,
// so nothing is written to cookies or browser storage and no consent banner is needed. Text, inputs and
// attributes are masked, there is no session recording, and URLs lose their query strings.
const safeUrl = value => { try { const u = new URL(value, location.origin); return u.origin + u.pathname; } catch { return undefined; } };
posthog.init("phc_zrUnirUNQg6hFqBkPTubzUfEBjxTc7J3TxSfCMky7pre", {
  api_host: "https://eu.i.posthog.com",
  defaults: "2026-05-30",
  persistence: "memory",
  person_profiles: "identified_only",
  respect_dnt: true,
  autocapture: { dom_event_allowlist: ["click"] },
  capture_pageview: true,
  capture_pageleave: true, // carries how far down the page the visitor scrolled
  capture_performance: false,
  capture_exceptions: false,
  mask_all_text: true,
  mask_all_element_attributes: true,
  mask_all_inputs: true,
  disable_session_recording: true,
  disable_surveys: true,
  before_send(event) {
    if (!event?.properties) return event;
    for (const key of ["$current_url", "$referrer", "$pathname", "$prev_pageview_pathname"]) {
      if (event.properties[key]) event.properties[key] = safeUrl(event.properties[key]);
    }
    return event;
  },
});

// Which button, and where on the page: "launch app" / "book demo" in header, hero, end or footer.
addEventListener("click", e => {
  const a = e.target.closest?.("a[href]"); if (!a) return;
  const cta = a.href.startsWith("https://app.kelvara.xyz") ? "launch app" : a.href.includes("calendly.com") ? "book demo" : null;
  if (!cta) return;
  const place = a.closest("header") ? "header" : a.closest("footer") ? "footer" : a.closest("section")?.className.split(" ")[0] || "page";
  posthog.capture("cta clicked", { cta, place });
}, { capture: true });

// How far visitors get through the 03:12 story (the page script announces each step once it is shown).
const seen = new Set();
addEventListener("kelvara:step", e => { const step = Number(e.detail); if (!seen.has(step)) { seen.add(step); posthog.capture("story step viewed", { step }); } });
