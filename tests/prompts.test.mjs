import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {dispatch} from '../lib/dispatch.mjs';
test('trace exploration omits prompt bodies; explicit prompt selection returns one assembly',async()=>{
 const repo=fs.mkdtempSync(path.join(os.tmpdir(),'trace-prompts-'));const previous=globalThis.fetch;
 try{
 fs.mkdirSync(path.join(repo,'tracing'));fs.mkdirSync(path.join(repo,'unit'));
 fs.writeFileSync(path.join(repo,'tracing/registry.yaml'),JSON.stringify({schemaVersion:1,project:{id:'example'},registries:['../unit/registry.json']}));fs.writeFileSync(path.join(repo,'unit/registry.json'),JSON.stringify({schemaVersion:1,operations:[]}));
 fs.writeFileSync(path.join(repo,'credentials.json'),JSON.stringify({token:'fixture-token'}),{mode:0o600});const config=path.join(repo,'connection.json');fs.writeFileSync(config,JSON.stringify({queryEndpoint:'https://fixture.invalid',queryInstanceId:'fixture',credentialsFile:'credentials.json'}));
 const make=(id,body)=>({spanId:id,name:'colab.prompt.assemble',startTimeUnixNano:'100',endTimeUnixNano:'200',attributes:[['prompt.content',body],['prompt.kind','canvas_mention'],['prompt.stage','dispatch'],['prompt.bytes',body.length]].map(([key,value])=>({key,value:{[typeof value==='number'?'intValue':'stringValue']:value}}))});
 globalThis.fetch=async()=>new Response(JSON.stringify({batches:[{resource:{attributes:[{key:'service.name',value:{stringValue:'example'}}]},scopeSpans:[{spans:[make('one','Final instruction A'),make('two','Final instruction B')]}]}]}),{headers:{'content-type':'application/json'}});
 const args={id:'1'.repeat(32)};const chain=await dispatch(repo,'trace',args,config);assert.ok(chain.spans.every(s=>s.attributes['prompt.content']===undefined));
 const list=await dispatch(repo,'prompts',args,config);assert.equal(list.prompts.length,2);assert.ok(list.prompts.every(p=>!('content' in p)));
 const selected=await dispatch(repo,'prompts',{...args,span:'one'},config);assert.equal(selected.prompts[0].content,'Final instruction A');assert.ok(!('content' in selected.prompts[1]));
 await assert.rejects(()=>dispatch(repo,'prompts',{...args,span:'missing'},config),/not found/);
 }finally{globalThis.fetch=previous;fs.rmSync(repo,{recursive:true,force:true});}
});
