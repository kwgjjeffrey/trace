import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {dispatch} from '../lib/dispatch.mjs';

test('GUI locating returns explicit project page and embedding endpoints',async()=>{
 const repo=fs.mkdtempSync(path.join(os.tmpdir(),'trace-locator-'));
 const previous={page:process.env.TRACE_LOCATOR_URL,embed:process.env.TRACE_LOCATOR_EMBED_URL};
 try{
  fs.mkdirSync(path.join(repo,'tracing'));
  fs.writeFileSync(path.join(repo,'tracing/registry.yaml'),JSON.stringify({schemaVersion:1,project:{id:'example'},registries:['registry.json']}));
  fs.writeFileSync(path.join(repo,'tracing/registry.json'),JSON.stringify({schemaVersion:1,unit:'example',operations:[{id:'example.open',description:'Open example',owner:'example',entry:{kind:'gui',page:'example',target:'example.open'},completion:{success:'shown',failure:'failed'},source:{path:'example.ts',function:'open'}}]}));
  process.env.TRACE_LOCATOR_URL='http://127.0.0.1:54100/locate';
  process.env.TRACE_LOCATOR_EMBED_URL='http://127.0.0.1:54100/embed';
  const result=await dispatch(repo,'locate',{operation:'example.open'});
  assert.equal(result.url,'http://127.0.0.1:54100/locate?operation=example.open');
  assert.equal(result.embedUrl,'http://127.0.0.1:54100/embed');
  delete process.env.TRACE_LOCATOR_URL;delete process.env.TRACE_LOCATOR_EMBED_URL;
  const metadata=await dispatch(repo,'locate',{operation:'example.open'});
  assert.equal(metadata.url,null);assert.equal(metadata.embedUrl,null);
 }finally{
  for(const [key,value] of [['TRACE_LOCATOR_URL',previous.page],['TRACE_LOCATOR_EMBED_URL',previous.embed]]){if(value===undefined)delete process.env[key];else process.env[key]=value;}
  fs.rmSync(repo,{recursive:true,force:true});
 }
});
