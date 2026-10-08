import {performanceSummary} from '../record_store/performance.mjs';
export function evaluatePerformance(checks,traces){return checks.map(check=>{
 const samples=traces.filter(t=>t.entryId===check.entryId&&(!check.traceId||t.traceId===check.traceId));
 const point=performanceSummary({traces:samples})[0];
 if(!point)return {name:check.name,entryId:check.entryId,kind:'performance',passed:false,state:'inconclusive',reason:'No matching registered end-to-end trace sample',boundary:'provider trace'};
 return {name:check.name,entryId:check.entryId,kind:'performance',passed:point.durationMs<=check.maximumMs,actual:point.durationMs,maximumMs:check.maximumMs,unit:'ms',statistic:point.statistic,sampleCount:point.count,boundary:'provider trace',traceIds:samples.map(s=>s.traceId)};
 });}
