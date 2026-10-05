import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inspectEmbedding} from '../instrumentation/locator/scripts/check-embedding.mjs';
test('embedding inspection retains all enforced ancestor policies and conflicts', () => {
 const h = new Headers({'Content-Security-Policy': "default-src 'self'; frame-ancestors 'self', frame-ancestors https://catalog.example", 'X-Frame-Options': 'SAMEORIGIN', 'Content-Security-Policy-Report-Only': 'frame-ancestors *'});
 const r = inspectEmbedding(h, 'https://catalog.example');
 assert.deepEqual(r.frameAncestors, ["frame-ancestors 'self'", 'frame-ancestors https://catalog.example']);
 assert.equal(r.xFrameOptions, 'SAMEORIGIN');
 assert.equal(r.browserAcceptanceRequired, true);
 assert.throws(() => inspectEmbedding(h, 'https://catalog.example/path'), /exact/);
});
