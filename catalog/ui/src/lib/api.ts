import metadata from '../../../../package.json';
import {App} from '@modelcontextprotocol/ext-apps';
const app=window.parent!==window?new App({name:'Agent Dev Suite',version:metadata.version}):null;
const connected=app?.connect();
const regressionActions=['environment_options','environment','filter_options','agent_prompt','ask_agent','run_record','cases','case_source','plan','records','record','run','cancel','status'];
export async function api<T=any>(action:string,args:Record<string,any>={},post=false):Promise<T>{
 if(app){await connected;const name=regressionActions.includes(action)?'regression_'+(action==='case_source'?'source':action):'trace_'+action;const result=await app.callServerTool({name,arguments:regressionActions.includes(action)?{args}:args});if(result.isError){const content=result.content?.find(c=>c.type==='text');throw Error(content?.type==='text'?content.text:'Request failed');}return result.structuredContent?.data as T;}
 const r=await fetch('/api/'+action+(post?'':'?'+new URLSearchParams(Object.fromEntries(Object.entries(args).filter(([,v])=>v!==undefined&&v!==null).map(([k,v])=>[k,k==='meta'&&typeof v==='object'?JSON.stringify(v):v])))),post?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(args)}:{});
 const value=await r.json();if(!r.ok)throw Error(value.error);return value.data;
}
export interface TestCase {preflight?:any;runnable?:boolean;id:string;name:string;description:string;meta:Record<string,any>;file:string;digest:string;status?:string;durationMs?:number;error?:string;reason?:string;assertions?:any[];steps?:any[];measurements?:any[];outputs?:any[];diagnostics?:any[];evidence?:any[];traces?:any[];telemetryDiagnostics?:any[];cleanupError?:string;}
export interface Regression {runId?:string;roundNumber?:number;id:string;name:string;startedAt:string;finishedAt?:string;durationMs:number;state:string;profile:string;filters?:Record<string,any>;environment:Record<string,any>;counts?:Record<string,number>;cases:TestCase[];}
export const duration=(n?:number)=>Number.isFinite(n)?(n!/1000).toFixed(2)+' s':'—';
export const labels:Record<string,Record<string,string>>={surface:{gui:'GUI',skill:'Agent command',integration:'Integration'},priority:{critical:'Critical',normal:'Normal',extended:'Extended'},origin:{requirement:'Feature',bug:'Bug regression','acceptance-gap':'Acceptance gap'},cost:{fast:'Short',normal:'Standard',slow:'Long'},status:{trial:'Trial',active:'Active',rotten:'Needs repair',obsolete:'Retired'}};
export const label=(key:string,value:string)=>labels[key]?.[value]||value;

export function selectionReason(s?:string){if(!s)return '—';const map:Record<string,string>={'Lifecycle rotten':'Needs repair — excluded','Lifecycle obsolete':'Retired — excluded','Case filter':'Outside selected cases','Module filter':'Outside selected modules','Surface filter':'Different entry type'};return map[s]||s;}
