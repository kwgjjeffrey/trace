---
name: trace-page-locator
description: Install and connect a registered project's GUI location and breathing highlight module.
---

Run `node <trace-skill>/trace.mjs locator-install --repo <repo> --directory <unit-relative-directory>` (default `tracing/page-locator`). The module is installed as project source, carries a version/hash receipt and rejects upgrades over local modifications. Deploy it with the owning frontend or developer adapter. Registration remains in unit-owned files; this command does not copy the registry.

Import `mountLocator` from the installed `browser.mjs`. Enable it explicitly in the developer diagnostic entry, with exact `allowedOrigins` and `getOperations` returning the live operation array or catalog. Retain its returned dispose function and call it during teardown. Do not enable it globally for normal users.

```js
import {mountLocator} from './page-locator/browser.mjs';
const stop = mountLocator({
  enabled: diagnosticsEnabled,
  allowedOrigins: ['http://127.0.0.1:53481'],
  getOperations: () => fetch('/diagnostics/operations').then(r => {
    if (!r.ok) throw Error('Registry unavailable');
    return r.json();
  })
});
```

For registered GUI entries, bind `data-trace-target` to `entry.target` (space-separated values permit a shared control). The default selector uses that marker; explicit `entry.selector` is supported. Register result regions with `data-trace-region`, and `entry.locator={kind:'control'|'region',region,steps,unavailable}`. Steps use `{selector,unless?,optional?}` and may click only controls carrying `data-trace-nav`. Optional `entry.tab` selects a visible accessible `[role=tab]` by its label. Keep routes and page-specific prerequisites in the project registry. The module never clicks the highlighted business target.

The catalog sends `trace.locate` with an entry ID through postMessage; the module accepts only its parent window at an exact allowed origin and returns `trace.result` with the same ID. A fallback region reports `ok:false`; it is not a successful control location. Reduced-motion settings disable the animation.

Configure `project.previewUrl` in the repository index to the diagnostic GUI URL. Existing deployments may use TRACE_LOCATOR_EMBED_URL. Your frontend must permit framing by the chosen catalog origin; configure frame-ancestors explicitly where applicable. Keep authentication and HTTP/WebSocket proxy behavior project-owned. A developer proxy may import this module into the HTML it serves; do not implement another highlighter in that proxy.

Validate separately: trusted parent versus untrusted messages; safe navigation without business execution; missing-resource fallback; overlapping requests; disposal; and actual navigation/highlight from the formal catalog in the deployed diagnostic page. Start with controls, background-result regions, a dialog and unavailable resources. Registration validation alone is not UI acceptance.

## Complete the integration for the developer

Treat a request to enable GUI location as authorization to perform the project integration. Do not hand the developer a checklist of header changes. Inspect the repository and carry out the following steps yourself:

1. Identify the frontend's diagnostic entry, serving configuration, authentication and final public URL. Identify the actual catalog origin (scheme, hostname and port); do not assume the example port. Install the module with locator-install, wire its import/lifecycle and live registry access, and bind the registered controls and safe navigation markers.
2. Run `node <trace-skill>/instrumentation/locator/scripts/check-embedding.mjs <diagnostic-url> <catalog-origin>`. This prints enforced CSP frame-ancestors and X-Frame-Options without declaring success. For authenticated pages inspect the logged-in browser's final document response too; a login page is not acceptance.
3. Find which layer owns those headers: application middleware, development server, reverse proxy or hosting configuration. Modify that configuration for the diagnostic route. Preserve existing required frame ancestors and add the exact catalog origin to each enforced policy; preserve all unrelated CSP directives. If no frame-ancestors exists, add one with the project's required origins and the catalog origin. Report-only CSP does not grant permission. A conflicting X-Frame-Options DENY or cross-origin SAMEORIGIN must be removed on this diagnostic route; use CSP frame-ancestors for the precise allowlist. Do not use obsolete ALLOW-FROM, wildcard permission or global removal of frame protection. Configure mountLocator.allowedOrigins with the same exact catalog origin.
4. Prefer the project's developer-only diagnostic entry. If its public serving policy cannot be changed locally, implement a project-owned authenticated developer adapter using the standard module, or perform the authorized hosting configuration change. Preserve authentication, proxy and WebSocket boundaries. Do not send provider tokens to the browser. Set project.previewUrl to the working diagnostic URL. Inspect the catalog page's own frame-src policy if it blocks the preview.
5. Start/restart the affected service and repeat the response-header check. Open the formal catalog in a browser and select real entries: confirm the page renders, safe navigation reaches a control, and breathing highlight appears without executing its business action. Verify missing-resource feedback and rejection of an untrusted origin. Record the tested URLs, selected entries and results; do not declare completion from headers alone.

Use the repository's existing framework/hosting configuration rather than inventing another server. Ask the developer only for a missing deployment credential, unavailable configuration access or a product decision you cannot infer; complete all independent local work first. If cross-site authentication or a required ancestor policy prevents the preview, report that exact gap and implement an appropriate diagnostic adapter within the authorized scope.
