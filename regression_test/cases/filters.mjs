export const moduleMatches=(actual,parent)=>typeof parent==='string'&&(actual===parent||actual.startsWith(parent+'/'));
const fields=['id','module','surface','priority','origin','status','effects','cost','covers','requires','affectedPaths','statusReason'];
export function filterOptions(cases){const keys=[...new Set([...fields,...cases.flatMap(c=>Object.keys(c.meta))])];return keys.map(key=>({key,values:[...new Set(cases.flatMap(c=>{const v=c.meta[key];return key==='module'&&typeof v==='string'?v.split('/').map((_,i)=>v.split('/').slice(0,i+1).join('/')):v===undefined?[]:Array.isArray(v)?v:[v];}))].filter(v=>['string','number','boolean'].includes(typeof v)).sort((a,b)=>String(a).localeCompare(String(b)))}));}
export function normalizeFilters(filters,cases){
 let meta=filters.meta===undefined?{}:filters.meta;if(typeof meta==='string'){try{meta=JSON.parse(meta);}catch{throw Error('meta must be a JSON object');}}
 if(!meta||Array.isArray(meta)||typeof meta!=='object')throw Error('meta must be an object');
 const known=new Set(filterOptions(cases).map(f=>f.key)),clean={};
 for(const [key,value] of Object.entries(meta)){if(!known.has(key))throw Error('Unknown metadata filter: '+key);const values=Array.isArray(value)?value:[value];if(!values.length||values.some(v=>!['string','number','boolean'].includes(typeof v)))throw Error('Invalid metadata filter: '+key);clean[key]=[...new Set(values)];}
 if(filters.timeoutMs!==undefined&&(!Number.isInteger(Number(filters.timeoutMs))||Number(filters.timeoutMs)<=0||Number(filters.timeoutMs)>2147483647))throw Error('timeoutMs must be a positive integer within the timer range');
 if(filters.concurrency!==undefined&&(!Number.isInteger(Number(filters.concurrency))||Number(filters.concurrency)<1||Number(filters.concurrency)>8))throw Error('concurrency must be an integer from 1 to 8');
 const boolean=(key)=>{const v=filters[key];if(v===undefined)return false;if(v===true||v==='true')return true;if(v===false||v==='false')return false;throw Error(key+' must be true or false');};
 return {...filters,...(filters.concurrency!==undefined?{concurrency:Number(filters.concurrency)}:{}),...(filters.timeoutMs!==undefined?{timeoutMs:Number(filters.timeoutMs)}:{}),meta:clean,validateInactive:boolean('validateInactive'),allowExternalWrites:boolean('allowExternalWrites')};
}
// Different fields intersect; values within a field are alternatives. Array metadata matches any selected member.
export function metadataMismatch(meta,filters){for(const [key,wanted]of Object.entries(filters)){const actual=Array.isArray(meta[key])?meta[key]:[meta[key]];if(!wanted.some(v=>key==='module'?actual.some(a=>typeof a==='string'&&moduleMatches(a,v)):actual.includes(v)))return 'Metadata '+key+' filter';}return null;}
