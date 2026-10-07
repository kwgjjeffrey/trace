// Snapshot metadata is authoritative for this result. Array classifications may overlap;
// deduplicate within each group rather than counting a repeated tag twice.
export function groupResults(cases,field,{moduleDepth}={}){
 if(typeof field!=='string'||!field)throw Error('groupBy must be a metadata field');
 if(!cases.some(c=>Object.hasOwn(c.meta||{},field)))throw Error('Unknown result metadata field: '+field);
 if(moduleDepth!==undefined&&(!Number.isInteger(Number(moduleDepth))||Number(moduleDepth)<1))throw Error('moduleDepth must be a positive integer');
 const groups=new Map();
 for(const c of cases){if(c.status==='excluded')continue;const v=c.meta?.[field];const values=Array.isArray(v)?v:[v];const keys=[...new Set((values.length?values:[null]).map(v=>v===undefined||v===null?'Unspecified':typeof v==='string'&&field==='module'&&moduleDepth?v.split('/').slice(0,Number(moduleDepth)).join('/'):String(v)))];
  for(const key of keys){const g=groups.get(key)||{key,cases:[],counts:{},total:0};g.cases.push(c);g.total++;const status=c.status||'pending';g.counts[status]=(g.counts[status]||0)+1;groups.set(key,g);}
 }
 const priorities=['critical','normal','extended'];
 return [...groups.values()].sort((a,b)=>field==='priority'?(priorities.indexOf(a.key)<0?99:priorities.indexOf(a.key))-(priorities.indexOf(b.key)<0?99:priorities.indexOf(b.key))||a.key.localeCompare(b.key):a.key.localeCompare(b.key));
}
