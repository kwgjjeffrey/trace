import test from 'node:test';import assert from 'node:assert/strict';import {performanceSummary} from '../record_store/performance.mjs';
test('performance summary separates points and sources, excludes unverified spans and labels single samples',()=>{
 const r=performanceSummary({measurements:[...Array.from({length:10},(_,i)=>({name:'send',durationMs:i+1})),{name:'open',durationMs:30}],traces:[{name:'send',durationMs:99},{entryId:'send',boundary:'operation-end-to-end',durationMs:20}]});
 assert.deepEqual(r.map(x=>[x.name,x.source,x.statistic,x.durationMs,x.count]),[['send','trace','single',20,1]]);
});

test('registered end-to-end trace samples use per-entry P90 and never include child spans',()=>{const result=performanceSummary({traces:[...Array.from({length:10},(_,i)=>({entryId:'messages.send',boundary:'operation-end-to-end',durationMs:i+1})),{entryId:'server.handler',boundary:'span',durationMs:1000},{name:'unregistered',boundary:'operation-end-to-end',durationMs:50}]});assert.equal(result.length,1);assert.equal(result[0].durationMs,9);assert.equal(result[0].statistic,'p90');});
