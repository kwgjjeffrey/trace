import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {workspace,regressionProject} from './workspace.mjs';
import {recover} from '../../regression_test/record_store/store.mjs';import {inside} from '../../regression_test/lib/paths.mjs';
const build=fileURLToPath(new URL('../.runtime/ui/',import.meta.url));
export async function serve(repo,config,port=53481,index){
 const p=regressionProject(repo,index);if(p)recover(p);const origin=`http://127.0.0.1:${port}`;
 const server=http.createServer(async(req,res)=>{try{
  if(req.headers.host!==`127.0.0.1:${port}`){res.writeHead(403);return res.end();}
  const u=new URL(req.url,origin);res.setHeader('Cache-Control','no-store');res.setHeader('X-Frame-Options','SAMEORIGIN');
  if(u.pathname==='/config'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(await workspace(repo,'workspace',{},config,index)));}
  if(u.pathname.startsWith('/api/')){
   const action=u.pathname.slice(5),mut=['run','cancel','status','upgrade'].includes(action);
   if(mut&&(req.method!=='POST'||req.headers.origin!==origin))throw Error('Same-origin POST required');
   if(!mut&&req.method!=='GET')throw Error('Read-only action');
   let args=Object.fromEntries(u.searchParams);if(mut){let body='';for await(const chunk of req){body+=chunk;if(body.length>16384)throw Error('Request too large');}args=JSON.parse(body||'{}');}
   const data=await workspace(repo,action,args,config,index);res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({data}));
  }
  if(u.pathname==='/evidence'){
   if(!p)throw Error('No regression registry');const file=inside(repo,u.searchParams.get('path')||'');
   if(!file.startsWith(p.recordRoot+path.sep)||!file.includes(path.sep+'evidence'+path.sep)||!file.endsWith('.png'))throw Error('Invalid evidence');
   res.setHeader('Content-Type','image/png');return res.end(fs.readFileSync(file));
  }
  if(u.pathname==='/'||u.pathname.startsWith('/assets/')){
   const file=inside(build,u.pathname==='/'?'index.html':u.pathname.slice(1));
   res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html; charset=utf-8');return res.end(fs.readFileSync(file));
  }
  res.writeHead(404);res.end();
 }catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({error:e.message}));}});
 server.listen(port,'127.0.0.1',()=>console.log(origin));return server;
}
