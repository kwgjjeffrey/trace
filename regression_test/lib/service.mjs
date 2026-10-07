import {groupResults} from '../record_store/grouping.mjs';
import {environmentOptions,resolveEnvironment,checkEnvironment,environmentPlan} from '../environment/resolver.mjs';
import fs from 'node:fs';
import {filterOptions} from '../cases/filters.mjs';
import {agentPrompt} from '../execution/agent-prompt.mjs';import {execFileSync} from 'node:child_process';
import {catalog,plan,setStatus} from '../cases/catalog.mjs';import {records,record,runs,runRecord,latestResult} from '../record_store/store.mjs';import {start,cancel} from '../execution/runner.mjs';import {inside} from './paths.mjs';
export async function service(p,action,args={}){
 if(action==='environment_options')return environmentOptions(p);
 if(action==='environment'){const r=await resolveEnvironment(p,args);return checkEnvironment(r,args.requirements||{});}
 if(action==='filter_options')return filterOptions(catalog(p).cases);
 if(action==='agent_prompt')return agentPrompt(p,plan(p,args));
 if(action==='cases')return catalog(p);
 if(action==='plan')return environmentPlan(p,plan(p,args),args);
 if(action==='source'){const c=catalog(p).cases.find(c=>c.id===args.id);if(!c)throw Error('Unknown case');return {path:c.file,absolutePath:inside(p.repo,c.file),content:fs.readFileSync(inside(p.repo,c.file),'utf8')};}
 if(action==='status')return setStatus(p,args.id,args.status,args.reason);
 if(action==='records')return runs(p);
 if(action==='run_record'){const r=runRecord(p,args.id);if(args.groupBy)r.groups=groupResults(r.cases,args.groupBy,{moduleDepth:args.moduleDepth}).map(({cases,...group})=>({...group,caseIds:cases.map(c=>c.id)}));if(args.problems)r.cases=r.cases.filter(c=>!['passed','excluded'].includes(c.status));return r;}
 if(action==='ask_agent'){const q=v=>"'"+String(v).replaceAll("'","'\"'\"'")+"'";return {prompt:'Use the Trace skill to inspect this regression run, its rounds and recorded evidence. Answer my question below; distinguish defects, script issues and environment blockers.\n\n'+['sh',new URL('../../setup/run.sh',import.meta.url).pathname,'regression_test/cli.mjs','record','--repo',p.repo,'--index',p.index,'--id',args.id,'--latest'].map(q).join(' ')+'\n\nMy question: '};}
 if(action==='record'){const r=args.latest?latestResult(p,args.id):record(p,args.id);if(args.groupBy)r.groups=groupResults(r.cases,args.groupBy,{moduleDepth:args.moduleDepth}).map(({cases,...group})=>({...group,caseIds:cases.map(c=>c.id)}));if(args.problems)r.cases=r.cases.filter(c=>!['passed','excluded'].includes(c.status));return r;}
 if(action==='run'){const j=start(p,args);return args.wait?j.completion:{id:j.id};}
 if(action==='cancel')return cancel(args.id);
 if(action==='doctor'){try{execFileSync(process.execPath,['-e',"import('playwright').then(()=>{})"],{cwd:new URL('..',import.meta.url),stdio:'ignore'});return {ready:true,systemChrome:fs.existsSync(p.config.browser?.executable||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),browserMode:p.config.browser?.mode||'device'};}catch{return {ready:false};}}
 throw Error('Unknown regression action');
}
