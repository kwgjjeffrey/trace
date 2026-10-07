import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {spawn} from 'node:child_process';import {chromium} from 'playwright';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
export async function openBrowser(config={}){
 if(config.mode==='headless'){const browser=await chromium.launch({headless:true});const context=await browser.newContext();return {page:await context.newPage(),mode:'headless',close:()=>browser.close()};}
 const profile=path.resolve(config.profileDir||path.join(os.homedir(),'.local/share/trace/browser-profiles/default'));fs.mkdirSync(profile,{recursive:true,mode:0o700});const lock=path.join(profile,'.trace-lock');let fd;
 try{fd=fs.openSync(lock,'wx',0o600);}catch{let pid;try{pid=JSON.parse(fs.readFileSync(lock)).pid;process.kill(pid,0);}catch(e){if(e.code==='ESRCH'){fs.unlinkSync(lock);return openBrowser(config);} }throw Error('Browser profile busy; select a dedicated profile');}
 fs.writeFileSync(fd,JSON.stringify({pid:process.pid}));fs.closeSync(fd);
 let browser,child,page;
 const endpoint=()=>{try{const [port,ws]=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').trim().split('\n');if(!/^\d+$/.test(port)||!ws.startsWith('/devtools/browser/'))return null;return 'ws://127.0.0.1:'+port+ws;}catch{return null;}};
 const close=async()=>{try{await page?.close();await browser?.close();}finally{if(child&&child.exitCode===null){child.kill('SIGTERM');}try{fs.unlinkSync(lock);}catch{}}};
 try{
  const existing=endpoint();if(existing)try{browser=await chromium.connectOverCDP(existing,{timeout:2000});}catch{}
  if(!browser){const exe=config.executable||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';if(!fs.existsSync(exe))throw Error('System Chrome unavailable; configure browser.executable');
   const stale=path.join(profile,'DevToolsActivePort');if(fs.existsSync(stale))fs.unlinkSync(stale);
   child=spawn(exe,['--user-data-dir='+profile,'--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'});
   const deadline=Date.now()+20000;while(!browser&&Date.now()<deadline){if(child.exitCode!==null)throw Error('Chrome exited during startup');const ws=endpoint();if(ws)try{browser=await chromium.connectOverCDP(ws,{timeout:1000});}catch{}if(!browser)await pause(100);}
   if(!browser)throw Error('CDP startup timeout');
  }
  const context=browser.contexts()[0];if(!context)throw Error('Default BrowserContext unavailable');page=await context.newPage();await page.bringToFront();page.setDefaultTimeout(10000);return {page,mode:'device',close};
 }catch(e){await close();throw e;}
}
