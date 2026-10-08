import crypto from 'node:crypto';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {spawn} from 'node:child_process';import {chromium} from 'playwright';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
export async function openRunBrowser(config={}){

 const profile=config.mode==='headless'?fs.mkdtempSync(path.join(os.tmpdir(),'trace-headless-')):path.resolve(config.profileDir||path.join(os.homedir(),'.local/share/trace/browser-profiles/default'));fs.mkdirSync(profile,{recursive:true,mode:0o700});const lock=path.join(profile,'.trace-lock');let fd;
 try{fd=fs.openSync(lock,'wx',0o600);}catch{let pid;try{pid=JSON.parse(fs.readFileSync(lock)).pid;process.kill(pid,0);}catch(e){if(e.code==='ESRCH'){fs.unlinkSync(lock);return openRunBrowser(config);} }throw Error('Browser profile busy; select a dedicated profile');}
 fs.writeFileSync(fd,JSON.stringify({pid:process.pid}));fs.closeSync(fd);
 let browser,child;
 const endpoint=()=>{try{const [port,ws]=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').trim().split('\n');if(!/^\d+$/.test(port)||!ws.startsWith('/devtools/browser/'))return null;return 'ws://127.0.0.1:'+port+ws;}catch{return null;}};
 const close=async()=>{try{await browser?.close();}finally{if(child&&child.exitCode===null){const exited=new Promise(r=>child.once('exit',r));child.kill('SIGTERM');let timer;await Promise.race([exited,new Promise(r=>{timer=setTimeout(()=>{child.kill('SIGKILL');r();},2000);})]);clearTimeout(timer);await exited;}try{fs.unlinkSync(lock);}catch{}if(config.mode==='headless')fs.rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}};
 try{
  const existing=endpoint();if(existing)try{browser=await chromium.connectOverCDP(existing,{timeout:2000});}catch{}
  if(!browser){const exe=config.executable||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';if(!fs.existsSync(exe))throw Error('System Chrome unavailable; configure browser.executable');
   const stale=path.join(profile,'DevToolsActivePort');if(fs.existsSync(stale))fs.unlinkSync(stale);
   child=spawn(exe,['--user-data-dir='+profile,'--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--no-first-run','--no-default-browser-check',...(config.mode==='headless'?['--headless=new']:[]),'about:blank'],{stdio:'ignore'});
   const deadline=Date.now()+20000;while(!browser&&Date.now()<deadline){if(child.exitCode!==null)throw Error('Chrome exited during startup');const ws=endpoint();if(ws)try{browser=await chromium.connectOverCDP(ws,{timeout:1000});}catch{}if(!browser)await pause(100);}
   if(!browser)throw Error('CDP startup timeout');
  }
  if(!browser.contexts()[0])throw Error('Default BrowserContext unavailable');return manager(browser,endpoint(),close,config);
 }catch(e){await close();throw e;}
}

async function manager(browser,endpoint,shutdown,config){
 const context=browser.contexts()[0],leases=new Set();
 // Tabs share the persistent context. The Run owns all pages, including auxiliary
 // client tabs, and releases them even when a worker throws or is terminated.
 return {mode:config.mode==='headless'?'headless':'device',connected:()=>browser.isConnected(),async lease(){
  const pages=new Set();leases.add(pages);
  async function newPage(){const page=await context.newPage();pages.add(page);const pageUrl='about:blank#trace-'+crypto.randomUUID();await page.goto(pageUrl);return {page,pageUrl};}
  const first=await newPage();
  return {connection:{endpoint,pageUrl:first.pageUrl,protocol:'cdp'},page:first.page,newPage,
   async close(){await Promise.all([...pages].map(p=>p.isClosed()?undefined:p.close()));leases.delete(pages);}};
 },async close(){try{await Promise.allSettled([...leases].flatMap(pages=>[...pages].map(p=>p.isClosed()?undefined:p.close())));}finally{await shutdown();}}};
}
export async function connectLease(connection){
 const browser=connection.protocol==='playwright'?await chromium.connect(connection.endpoint):await chromium.connectOverCDP(connection.endpoint);
 const page=browser.contexts().flatMap(c=>c.pages()).find(p=>p.url()===connection.pageUrl);
 if(!page){await browser.close();throw Error('Run-owned case tab unavailable');}page.setDefaultTimeout(10000);
 // Disconnect only this client's transport; the Run owns the context and process.
 return {page,async findPage(url){for(let i=0;i<50;i++){const p=browser.contexts().flatMap(c=>c.pages()).find(p=>p.url()===url);if(p)return p;await pause(20);}throw Error('Run-owned auxiliary tab unavailable');},close:()=>browser.close()};
}
// Standalone fixture preparation retains the same API; ownership stays in runtime.
export async function openBrowser(config={}){const run=await openRunBrowser(config);try{const lease=await run.lease();return {page:lease.page,mode:run.mode,close:()=>run.close()};}catch(e){await run.close();throw e;}}
