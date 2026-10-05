import metadata from '../../package.json';
import {App} from '@modelcontextprotocol/ext-apps';
const app=window.parent!==window?new App({name:'Trace',version:metadata.version}):null;
const gui=document.querySelector('#gui'),command=document.querySelector('#command'),notice=document.querySelector('#notice');
let selected=null,selection=0,guiOrigin=null,loaded=false,pending=null;
async function call(action,args={}){
 if(app){const r=await app.callServerTool({name:'trace_'+action,arguments:args});if(r.isError)throw Error(r.content?.[0]?.text||'Query failed');return r.structuredContent?.data||JSON.parse(r.content[0].text);}
 const r=await fetch('/api/'+action+'?'+new URLSearchParams(args));const v=await r.json();if(!r.ok)throw Error(v.error);return v.data;
}
function sourceLabel(source){return [source.path,source.object,source.function].filter(Boolean).join(' → ');}
function message(text=''){notice.textContent=text;notice.hidden=!text;}
function locate(){if(pending&&loaded)gui.contentWindow.postMessage({type:'trace.locate',id:pending},guiOrigin);}
gui.addEventListener('load',()=>{loaded=true;locate();});
window.addEventListener('message',e=>{if(e.source===gui.contentWindow&&e.origin===guiOrigin&&e.data?.type==='trace.result'&&e.data.id===selected?.id)message(e.data.ok?'':e.data.message);});
async function select(o,button){
 selected=o;const mine=++selection;document.querySelectorAll('.operation').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelector('#header').hidden=false;document.querySelector('#source').textContent=sourceLabel(o.source);document.querySelector('#grafana').hidden=true;message();
 gui.hidden=true;command.hidden=true;pending=null;
 try{const v=await call('locate',{operation:o.id});if(mine!==selection)return;const link=document.querySelector('#grafana');if(v.grafanaUrl){link.href=v.grafanaUrl;link.hidden=false;}
  if(o.entry.kind==='command'){command.textContent=[o.entry.executable,...o.entry.args].join(' ');command.hidden=false;return;}
  if(v.embedUrl){const url=new URL(v.embedUrl);if(!['http:','https:'].includes(url.protocol))throw Error('Unsupported preview URL');pending=o.id;gui.hidden=false;if(gui.src!==url.href){loaded=false;guiOrigin=url.origin;gui.src=url.href;}else locate();}
  else if(v.url){command.replaceChildren();const a=document.createElement('a');a.href=v.url;a.target='_blank';a.rel='noreferrer';a.textContent='Open operation preview';command.append(a);command.hidden=false;}
  else message('No GUI preview adapter configured for this project');
 }catch(error){if(mine===selection)message(error.message);}
}
// Load only visible entries, with bounded concurrency; never derive percentiles from a trace list.
const queue=[];let active=0;const seen=new Set();
function pump(){while(active<3&&queue.length){const [o,label]=queue.shift();active++;call('operation_metrics',{operation:o.id}).then(v=>{const points=[['P50',v.p50Ms],['P90',v.p90Ms],['P95',v.p95Ms]].filter(([,n])=>Number.isFinite(n));label.textContent=points.length?'Last hour · '+points.map(([p,n])=>p+' '+Number(n.toFixed(2))+' ms').join(' · '):'No performance samples in the last hour';}).catch(()=>{label.textContent='Performance samples unavailable';}).finally(()=>{active--;pump();});}}
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting&&!seen.has(e.target)){seen.add(e.target);queue.push([e.target.operation,e.target.querySelector('.statistics')]);observer.unobserve(e.target);}pump();},{root:document.querySelector('.catalog')});
async function render(catalog){document.querySelector('#title').textContent=catalog.project.id+' · Trace';const list=document.querySelector('#entries');list.replaceChildren();observer.disconnect();const buttons=[];
 for(const o of catalog.operations){const b=document.createElement('button');b.className='operation';b.setAttribute('aria-pressed','false');b.operation=o;for(const [className,text] of [['name',o.id],['description',o.description],['path',sourceLabel(o.source)],['statistics','Loading performance samples…']]){const s=document.createElement('span');s.className=className;s.textContent=text;b.append(s);}b.onclick=()=>select(o,b);list.append(b);buttons.push([o,b]);observer.observe(b);}
 const requested=new URL(location.href).searchParams.get('operation');const initial=buttons.find(([o])=>o.id===requested)||buttons[0];if(initial)await select(...initial);
}
if(app){app.ontoolresult=r=>{if(r.structuredContent?.action==='operations')void render(r.structuredContent.data);};await app.connect();}
try{await render(await call('operations'));}catch(error){message(error.message);}
