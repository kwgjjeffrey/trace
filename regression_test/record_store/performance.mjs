// Aggregate comparable samples inside one case result, never across rounds or spans.
export function performanceSummary(item){
 const groups=new Map();
 for(const [source,rows] of [['operation',item.measurements||[]],['trace',item.traces||[]]])for(const row of rows){
  if(!Number.isFinite(row.durationMs)||row.durationMs<0)continue;
  if(source==='trace'&&row.boundary!=='operation-end-to-end')continue;
  const name=row.entryId||row.name;if(!name)continue;const key=source+':'+name;
  if(!groups.has(key))groups.set(key,{name,source,samples:[]});groups.get(key).samples.push(row.durationMs);
 }
 return [...groups.values()].map(g=>{const samples=g.samples.sort((a,b)=>a-b);return {...g,count:samples.length,statistic:samples.length===1?'single':'p90',durationMs:samples[Math.ceil(samples.length*.9)-1]};});
}
