// Composition layer only: project data stays in the repository; tracing and regression own their services.
import fs from 'node:fs';import path from 'node:path';
import {dispatch} from '../../lib/dispatch.mjs';
import {project} from '../../regression_test/cases/catalog.mjs';
import {service} from '../../regression_test/lib/service.mjs';
export const regressionActions=['environment_options','environment','filter_options','agent_prompt','ask_agent','run_record','cases','case_source','plan','records','record','run','cancel','status'];
export function regressionProject(repo,index='regression_test/regression.config.yaml'){return fs.existsSync(path.join(repo,index))?project(repo,index):null;}
export async function workspace(repo,action,args={},config,index){
 if(action==='workspace')return {project:path.basename(repo),regressionEnabled:!!regressionProject(repo,index),performanceEnabled:fs.existsSync(path.join(repo,'tracing/registry.yaml'))};
 if(regressionActions.includes(action)){const p=regressionProject(repo,index);if(!p)throw Error('No regression_test/regression.config.yaml registered in this repository');return service(p,action==='case_source'?'source':action,args);}
 return dispatch(repo,action,args,config);
}
