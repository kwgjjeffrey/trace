import test from 'node:test';import assert from 'node:assert/strict';import {performanceSummary} from '../record_store/performance.mjs';
test('performance summary separates points and sources, excludes unverified spans and labels single samples',()=>{
 const r=performanceSummary({measurements:[...Array.from({length:10},(_,i)=>({name:'send',durationMs:i+1})),{name:'open',durationMs:30}],traces:[{name:'send',durationMs:99},{entryId:'send',boundary:'operation-end-to-end',durationMs:20}]});
 assert.deepEqual(r.map(x=>[x.name,x.source,x.statistic,x.durationMs,x.count]),[['send','trace','single',20,1]]);
});

test('registered end-to-end trace samples use per-entry P90 and never include child spans',()=>{const result=performanceSummary({traces:[...Array.from({length:10},(_,i)=>({entryId:'messages.send',boundary:'operation-end-to-end',durationMs:i+1})),{entryId:'server.handler',boundary:'span',durationMs:1000},{name:'unregistered',boundary:'operation-end-to-end',durationMs:50}]});assert.equal(result.length,1);assert.equal(result[0].durationMs,9);assert.equal(result[0].statistic,'p90');});

import {casePerformanceP90} from '../record_store/performance.mjs';
test('list combines all registered operation durations in one case into one P90',()=>{const result=casePerformanceP90({traces:Array.from({length:10},(_,i)=>({entryId:i%2?'open':'send',boundary:'operation-end-to-end',durationMs:i+1}))});assert.deepEqual(result,{durationMs:9,count:10});assert.equal(casePerformanceP90({measurements:[{durationMs:100}],traces:[{entryId:'child',boundary:'span',durationMs:999}]}),null);assert.deepEqual(casePerformanceP90({traces:[{entryId:'send',boundary:'operation-end-to-end',durationMs:12}]}),{durationMs:12,count:1});});
