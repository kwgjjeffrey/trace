import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import YAML from 'yaml';import {inside,shortError} from '../lib/paths.mjs';
function safe(v){if(v===null||['string','number','boolean'].includes(typeof v))return;if(Array.isArray(v)){v.forEach(safe);return;}if(!v||typeof v!=='object')throw Error('Environment values must be JSON data');for(const[k,x]of Object.entries(v)){if(/token|secret|password|bearer|authorization|cookie|__proto__|constructor|prototype/i.test(k))throw Error('Credentials are forbidden in environment parameters/resources');safe(x);}}
function object(v){if(typeof v==='string')v=JSON.parse(v);if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Environment parameters must be an object');safe(v);return v;}
async function bounded(fn){let timer;try{return await Promise.race([fn(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Environment check timeout')),15000);})]);}finally{clearTimeout(timer);}}
export function environmentOptions(p){return {default:p.config.environment?.default||null,profiles:Object.keys(p.config.environment?.profiles||{})};}
export async function resolveEnvironment(p,args={}){
 const config=p.config.environment,name=args.environment||config?.default;const parameters={};
 if(name){const ref=config?.profiles?.[name];if(!ref)throw Error('Unknown environment profile');Object.assign(parameters,object(YAML.parse(fs.readFileSync(inside(p.repo,path.relative(p.repo,path.resolve(path.dirname(inside(p.repo,p.index)),ref))),'utf8')).parameters||{}));}
 Object.assign(parameters,args.params?object(args.params):{});let resources={},adapter,error;
 if(config?.adapter){adapter=await import(pathToFileURL(inside(p.repo,path.relative(p.repo,path.resolve(path.dirname(inside(p.repo,p.index)),config.adapter)))).href);try{resources=object(await bounded(()=>adapter.resolve({repo:p.repo,parameters})));}catch(e){error=shortError(e);}}
 else if(name||Object.keys(parameters).length)error='No project environment adapter registered';
 return {adapter,snapshot:{profile:name||null,parameters,resources,checkedAt:new Date().toISOString(),...(error?{error}:{})}};
}
export async function checkEnvironment(resolved,requirements={}){
 const s=resolved.snapshot;let checks=[];
 if(s.error)checks=[{ready:false,reason:s.error}];
 else if(Object.keys(requirements).length){if(!resolved.adapter?.check)checks=[{ready:false,reason:'Project environment adapter required'}];else try{checks=await bounded(()=>resolved.adapter.check({resources:structuredClone(s.resources),parameters:structuredClone(s.parameters),requirements:structuredClone(requirements)}));safe(checks);if(!Array.isArray(checks)||!checks.length||checks.some(c=>typeof c.ready!=='boolean'))throw Error('Adapter must return explicit ready checks');}catch(e){checks=[{ready:false,reason:shortError(e)}];}}
 return {...s,checkedAt:new Date().toISOString(),checks,ready:checks.every(c=>c.ready)};
}
export async function environmentPlan(p,selection,args){const resolved=await resolveEnvironment(p,args);return {...selection,environment:resolved.snapshot,items:await Promise.all(selection.items.map(async c=>({...c,...(c.selected?{preflight:await checkEnvironment(resolved,c.requirements)}:{})})))};}
