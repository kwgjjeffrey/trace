import {query} from '../../analysis/scripts/grafana.mjs';
import {load} from '../../instrumentation/scripts/registry.mjs';
async function pool(rows,fn){let cursor=0;await Promise.all(Array.from({length:Math.min(4,rows.length)},async()=>{while(cursor<rows.length)await fn(rows[cursor++]);}));}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
export function operationSamples(trace,operations,mapping={}){
 const registered=new Map(operations.map(o=>[o.id,o]));
 return trace.spans.flatMap(span=>{const a=span.attributes||{},entryId=a['trace.entry.id'],o=registered.get(entryId);
 // Only the terminal's registered operation span owns the entrance-to-return interval.
 // HTTP, server, resumed feedback and nested spans are breakdowns, never samples.
 const operation=a[mapping.operationAttribute||'trace.operation.id'],phase=mapping.phaseAttribute?a[mapping.phaseAttribute]:undefined,outcome=a[mapping.outcomeAttribute||'trace.outcome'];if(!o||operation!==entryId||!(mapping.phaseAttribute?phase:outcome)||!Number.isFinite(span.durationMs))return [];if(trace.spans.some(parent=>parent.id===span.parentId&&parent.attributes?.[mapping.operationAttribute||'trace.operation.id']===entryId))return [];
 if(mapping.originAttribute&&a[mapping.originAttribute]!==mapping.originValues?.[o.entry.kind])return [];
 return [{entryId,name:entryId,description:o.description,traceId:trace.traceId,spanId:span.id,boundary:'operation-end-to-end',durationMs:span.durationMs,phase,outcome,source:o.source,grafanaUrl:trace.grafanaUrl,spans:trace.spans.map(s=>({id:s.id,parentId:s.parentId,name:s.name,service:s.service,durationMs:s.durationMs,source:{path:s.attributes?.['code.file.path'],function:s.attributes?.['code.function.name'],revision:s.attributes?.['code.revision']}}))}];
 });
}
export async function collectPerformance({repo,config,parameters,refs,queryTrace=query}){
 const file=parameters[config?.queryConfigParameter||'traceQueryConfig']||process.env[config?.queryConfigEnvironment||'TRACE_CONFIG'];
 if(!file)return {samples:[],diagnostics:[{state:'unavailable',reason:'Trace query configuration missing'}]};
 const operations=load(repo).operations,remaining=new Map(refs.map(r=>[r.traceId,r])),samples=[],diagnostics=[];
 const deadline=Date.now()+(config?.waitMs??20000);let attempt=0;
 while(remaining.size){await pool([...remaining],async([id])=>{try{const trace=await queryTrace(file,'trace',{id}),rows=operationSamples(trace,operations,config);if(rows.length){samples.push(...rows);remaining.delete(id);}}catch(e){if(!/404/.test(e.message)){remaining.delete(id);diagnostics.push({traceId:id,state:'unavailable',reason:e.message});}}});if(!remaining.size||Date.now()>=deadline)break;await pause(Math.min(1000*++attempt,3000));}
 for(const traceId of remaining.keys())diagnostics.push({traceId,state:'unavailable',reason:'Trace ingestion deadline exceeded'});
 return {samples,diagnostics};
}
