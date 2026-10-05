import {pathToFileURL} from 'node:url';

export function inspectEmbedding(headers, catalogOrigin) {
 const origin = new URL(catalogOrigin);
 if (origin.origin !== catalogOrigin) throw Error('Catalog origin must be an exact HTTP(S) origin');
 if (!['http:', 'https:'].includes(origin.protocol)) throw Error('Catalog origin must use HTTP(S)');
 const policies = (headers.get('content-security-policy') || '').split(',').map(p =>
  p.split(';').map(d => d.trim()).find(d => /^frame-ancestors(?:\s|$)/i.test(d))
 ).filter(Boolean);
 return {
  catalogOrigin,
  frameAncestors: policies,
  xFrameOptions: headers.get('x-frame-options'),
  // This is evidence for the agent, not a replacement for browser CSP evaluation.
  browserAcceptanceRequired: true,
  instruction: 'Inspect every enforced CSP policy and X-Frame-Options at the final response. Configure the diagnostic route to allow the exact catalog origin; preserve other CSP directives. Verify by loading the real catalog iframe.'
 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
 const [url, origin] = process.argv.slice(2);
 if (!url || !origin) throw Error('Usage: check-embedding.mjs <diagnostic-url> <catalog-origin>');
 const target = new URL(url);
 if (!['http:', 'https:'].includes(target.protocol)) throw Error('Diagnostic URL must use HTTP(S)');
 if (target.username || target.password) throw Error('Do not put credentials in the URL');
 const response = await fetch(target, {signal: AbortSignal.timeout(10000)});
 await response.body?.cancel();
 console.log(JSON.stringify({status: response.status, ...inspectEmbedding(response.headers, origin)}, null, 2));
}
