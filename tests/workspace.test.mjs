import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {workspace,regressionProject} from '../catalog/scripts/workspace.mjs';
test('workspace keeps tracing-only repositories usable and resolves project script source without executing it',async()=>{
 const repo=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'trace-workspace-')));
 try{
  fs.mkdirSync(path.join(repo,'tracing'));fs.writeFileSync(path.join(repo,'tracing/registry.yaml'),'schemaVersion: 1\nproject: {id: independent}\nregistries: []\n');
  assert.deepEqual(await workspace(repo,'workspace'),{project:path.basename(repo),regressionEnabled:false,performanceEnabled:true});
  assert.equal((await workspace(repo,'operations')).operations.length,0);
  await assert.rejects(()=>workspace(repo,'cases'),/No regression/);
  fs.mkdirSync(path.join(repo,'regression_test/cases'),{recursive:true});fs.writeFileSync(path.join(repo,'regression_test/regression.config.yaml'),'schemaVersion: 1\ncaseDirectories: [cases]\nregressionDirectory: .runs\n');
  const source="throw Error('Inspection must never run this script'); export const USECASE={name:'Independent case',description:'Own repository fixture'};export const META={id:'independent',module:'own',surface:'integration',priority:'normal',origin:'requirement',status:'active',effects:'read-only',cost:'fast'};export async function run(ctx){}";
  const file=path.join(repo,'regression_test/cases/example.mjs');fs.writeFileSync(file,source);
  assert.equal((await workspace(repo,'cases')).cases[0].id,'independent');
  assert.equal((await workspace(repo,'case_source',{id:'independent'})).absolutePath,file);
  assert.equal((await workspace(repo,'case_source',{id:'independent'})).content,source);
  assert.equal(regressionProject(repo).recordRoot,path.join(repo,'regression_test/.runs'));
  assert.deepEqual(await workspace(repo,'records'),[]);
 }finally{fs.rmSync(repo,{recursive:true,force:true});}
});
