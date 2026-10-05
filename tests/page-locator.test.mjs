import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {installLocator} from '../instrumentation/locator/scripts/install.mjs';
const runtime=fs.readFileSync(new URL('../instrumentation/locator/lib/browser.mjs',import.meta.url),'utf8');
test('locator installs source independently and preserves local edits',()=>{
 const repo=fs.mkdtempSync(path.join(os.tmpdir(),'locator-unit-'));
 try{
  const result=installLocator(repo);assert.equal(result.registrationCopied,false);
  assert.equal(fs.readFileSync(result.runtime,'utf8'),runtime);
  installLocator(repo);
  fs.appendFileSync(result.runtime,'\n// local changes');
  assert.throws(()=>installLocator(repo),/Local module changes/);
  assert.throws(()=>installLocator(repo,'../escape'),/outside repo/);
 }finally{fs.rmSync(repo,{recursive:true,force:true});}
});
test('diagnostic activation validates parent and origin; dispose removes listeners',async()=>{
 let listener,reads=0,removed=false;
 const parent={},style={remove(){removed=true;}};
 const document={createElement:()=>style,head:{append(){}},querySelectorAll:()=>[]};
 const context=vm.createContext({URL,document,parent,window:{addEventListener:(type,f)=>listener=f,removeEventListener:()=>listener=null}});
 vm.runInContext(runtime.replace('export function','function'),context);
 const mount=context.mountLocator;
 mount({enabled:false});assert.equal(listener,undefined);
 assert.throws(()=>mount({enabled:true,getOperations:()=>[]}),/allowed origin/);
 const stop=mount({enabled:true,allowedOrigins:['http://localhost:5000'],getOperations:()=>{reads++;return [];}});
 await listener({origin:'http://attacker.example',source:parent,data:{type:'trace.locate',id:'sample.open'}});
 await listener({origin:'http://localhost:5000',source:{},data:{type:'trace.locate',id:'sample.open'}});
 assert.equal(reads,0);stop();assert.equal(listener,null);assert.equal(removed,true);
});
