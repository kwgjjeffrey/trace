// Aggregate comparable samples inside one case result, never across rounds or spans.
export function performanceSummary(item){
 const groups=new Map();
 for(const [source,rows] of [['trace',item.traces||[]]])for(const row of rows){
  if(!Number.isFinite(row.durationMs)||row.durationMs<0)continue;
  if(source==='trace'&&row.boundary!=='operation-end-to-end')continue;
  const name=row.entryId;if(!name)continue;const key=source+':'+name;
  if(!groups.has(key))groups.set(key,{name,source,samples:[]});groups.get(key).samples.push(row.durationMs);
 }
 return [...groups.values()].map(g=>{const samples=g.samples.sort((a,b)=>a-b);return {...g,count:samples.length,statistic:samples.length===1?'single':'p90',durationMs:samples[Math.ceil(samples.length*.9)-1]};});
}
// The list is a case-level distribution of all captured registered operation
// durations in that result, as requested. It is neither a sum nor script elapsed time.
export function casePerformanceP90(item){
 const samples=(item.traces||[]).filter(t=>t.entryId&&t.boundary==='operation-end-to-end'&&Number.isFinite(t.durationMs)&&t.durationMs>=0).map(t=>t.durationMs).sort((a,b)=>a-b);
 return samples.length?{durationMs:samples[Math.ceil(samples.length*.9)-1],count:samples.length}:null;
}
