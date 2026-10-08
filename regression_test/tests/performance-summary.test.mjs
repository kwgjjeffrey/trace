import test from 'node:test';import assert from 'node:assert/strict';import {performanceSummary} from '../record_store/performance.mjs';
test('performance summary separates points and sources, excludes unverified spans and labels single samples',()=>{
 const r=performanceSummary({measurements:[...Array.from({length:10},(_,i)=>({name:'send',durationMs:i+1})),{name:'open',durationMs:30}],traces:[{name:'send',durationMs:99},{entryId:'send',boundary:'operation-end-to-end',durationMs:20}]});
 assert.deepEqual(r.map(x=>[x.name,x.source,x.statistic,x.durationMs,x.count]),[['send','operation','p90',9,10],['open','operation','single',30,1],['send','trace','single',20,1]]);
});
