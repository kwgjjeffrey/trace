import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import http from 'node:http';
import {project} from '../cases/catalog.mjs';import {start,cancel} from '../execution/runner.mjs';
const exe='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
test('Run allocates independent GUI tabs and one worker disconnect never closes a sibling',{skip:!fs.existsSync(exe)},async()=>{
 const server=http.createServer((q,r)=>r.end('<html><body>Ready</body></html>'));await new Promise(r=>server.listen(0,'127.0.0.1',r));const repo=fs.mkdtempSync(path.join(os.tmpdir(),'trace-tab-leases-'));
 try{fs.mkdirSync(path.join(repo,'cases'));fs.writeFileSync(path.join(repo,'index.yaml'),`schemaVersion: 1\ncaseDirectories: [cases]\nregressionDirectory: runs\nbaseUrl: http://127.0.0.1:${server.address().port}\nbrowser:\n  mode: headless\n  executable: ${exe}\n`);
 for(const [id,wait]of [['a',200],['b',900]])fs.writeFileSync(path.join(repo,'cases/'+id+'.mjs'),`export const USECASE={name:'${id}',description:'isolated leased tab'};export const META={id:'${id}',module:'sample',surface:'gui',priority:'normal',origin:'requirement',status:'trial',effects:'read-only',cost:'fast',locks:[]};export async function run(ctx){await ctx.page.evaluate(id=>document.body.dataset.case=id,ctx.caseId);const other=await ctx.newPage();await other.goto(ctx.baseUrl);await new Promise(r=>setTimeout(r,${wait}));ctx.assert('independent tab state',await ctx.page.evaluate(()=>document.body.dataset.case),ctx.caseId);ctx.assert('tab remains alive',await ctx.page.locator('body').innerText(),'Ready');}`);
 const run=await start(project(repo,'index.yaml'),{concurrency:2}).completion;assert.equal(run.counts.passed,2,JSON.stringify(run.cases.map(c=>({id:c.id,error:c.error}))));const[a,b]=run.cases;assert.ok(Date.parse(b.startedAt)<Date.parse(a.finishedAt));
 }finally{server.close();fs.rmSync(repo,{recursive:true,force:true});}
});

import {openRunBrowser} from '../browser/runtime.mjs';
test('three concurrent leases share one window and release primary and auxiliary tabs after every batch',{skip:!fs.existsSync(exe)},async()=>{
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'trace-window-test-'));const run=await openRunBrowser({mode:'device',profileDir:profile,executable:exe});
 try{const context=(await run.lease()).page.context();await run.close();
 // Start again without a lingering browser profile/process from the previous Run.
 const next=await openRunBrowser({mode:'device',profileDir:profile,executable:exe});
 try{for(let batch=0;batch<3;batch++){
 const leases=await Promise.all([next.lease(),next.lease(),next.lease()]);await leases[0].newPage();
 const ctx=leases[0].page.context(),windows=[];assert.equal(ctx.pages().length,5);
 for(const lease of leases){const cd=await ctx.newCDPSession(lease.page);windows.push((await cd.send('Browser.getWindowForTarget')).windowId);await cd.detach();}
 assert.equal(new Set(windows).size,1);await Promise.all(leases.map(l=>l.close()));assert.equal(ctx.pages().length,1,'only original blank tab remains');
 }}finally{await next.close();}
 }finally{await run.close();fs.rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}
});
