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
