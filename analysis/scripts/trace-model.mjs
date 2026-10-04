/** Causal parent links define order; cross-host timestamps never determine parentage. */
export function causalOrder(spans) {
  const byId=new Map(spans.map(s=>[s.id,s])), children=new Map(), roots=[];
  for(const span of spans){if(span.parentId&&byId.has(span.parentId)){const rows=children.get(span.parentId)||[];rows.push(span);children.set(span.parentId,rows);}else roots.push(span);}
  const result=[],seen=new Set();
  const visit=(span,depth)=>{if(seen.has(span.id))return;seen.add(span.id);result.push({...span,depth,parentAvailable:!span.parentId||byId.has(span.parentId)});for(const child of children.get(span.id)||[])visit(child,depth+1);};
  for(const root of roots)visit(root,0);for(const span of spans)visit(span,0);return result;
}
export function layerBoundaries(spans) {
  const byId=new Map(spans.map(s=>[s.id,s])),groups=new Map();
  for(const span of spans){const parent=byId.get(span.parentId);if(parent?.service===span.service)continue;const rows=groups.get(span.service)||[];rows.push({spanId:span.id,name:span.name,durationMs:span.durationMs,outcome:span.attributes['colab.outcome']||null,phase:span.attributes['colab.phase']||null,entryId:span.attributes['trace.entry.id']||null});groups.set(span.service,rows);}
  return [...groups].map(([service,boundaries])=>({service,semantics:'inclusive boundary durations; do not add nested layers or parallel requests',boundaries}));
}
