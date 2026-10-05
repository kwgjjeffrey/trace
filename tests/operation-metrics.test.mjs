import {test} from 'node:test';import assert from 'node:assert/strict';import {decodePercentiles,operationLink} from '../analysis/scripts/operation-metrics.mjs';
test('provider percentiles preserve missing P90 and convert seconds to milliseconds',()=>{
 assert.deepEqual(decodePercentiles({series:[{labels:[{key:'p',value:{doubleValue:.5}}],value:.012},{labels:[{key:'p',value:{doubleValue:.95}}],value:.04}]}),{p50Ms:12,p90Ms:null,p95Ms:40});
 assert.deepEqual(decodePercentiles({}),{p50Ms:null,p90Ms:null,p95Ms:null});
});
test('Grafana drilldown carries exact operation and GUI origin filters',()=>{
 const url=new URL(operationLink({grafanaUrl:'https://example.grafana.net',datasourceUid:'tempo',operationAttribute:'colab.operation',originAttribute:'colab.origin'},'messages.send','gui'));
 assert.equal(url.pathname,'/a/grafana-exploretraces-app/explore');assert.deepEqual(url.searchParams.getAll('var-filters'),['span.colab.operation|=|messages.send','span.colab.origin|=|gui']);assert.equal(url.searchParams.get('var-primarySignal'),'nestedSetParent<0');assert.equal(url.searchParams.get('from'),'now-1h');
});

test("generic project defaults to the registered entry attribute",()=>{const u=new URL(operationLink({grafanaUrl:"https://example.grafana.net",datasourceUid:"tempo"},"example.open","gui"));assert.deepEqual(u.searchParams.getAll("var-filters"),["span.trace.entry.id|=|example.open"]);});
