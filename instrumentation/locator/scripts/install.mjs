import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {inside} from '../../scripts/registry.mjs';
const base=path.dirname(fileURLToPath(import.meta.url));
const digest=data=>crypto.createHash('sha256').update(data).digest('hex');
export function installLocator(repo,directory='tracing/page-locator'){
 repo=fs.realpathSync(repo);
 const destination=inside(repo,directory),runtime=path.join(destination,'browser.mjs'),receipt=path.join(destination,'trace-module.json');
 if(fs.existsSync(destination)&&!fs.realpathSync(destination).startsWith(fs.realpathSync(repo)+path.sep))throw Error('Module directory escapes repository');
 inside(repo,path.relative(repo,runtime));inside(repo,path.relative(repo,receipt));
 if(fs.existsSync(runtime)){
  const previous=fs.existsSync(receipt)?JSON.parse(fs.readFileSync(receipt)):null;
  if(previous?.module!=='trace-page-locator'||digest(fs.readFileSync(runtime))!==previous.sha256)throw Error('Local module changes detected; preserve changes before upgrading');
 }
 const types=path.join(destination,'browser.d.mts');inside(repo,path.relative(repo,types));
 if(fs.existsSync(types)){const previous=fs.existsSync(receipt)?JSON.parse(fs.readFileSync(receipt)):null;if(digest(fs.readFileSync(types))!==previous?.typesSha256)throw Error('Local type declaration changes detected');}
 const declarations=fs.readFileSync(path.join(base,'../lib/browser.d.mts'));
 const data=fs.readFileSync(path.join(base,'../lib/browser.mjs'));
 const version=JSON.parse(fs.readFileSync(path.join(base,'../../../package.json'))).version;
 fs.mkdirSync(destination,{recursive:true});fs.writeFileSync(runtime,data);fs.writeFileSync(types,declarations);
 fs.writeFileSync(receipt,JSON.stringify({module:'trace-page-locator',version,sha256:digest(data),typesSha256:digest(declarations)},null,2)+'\n');
 return {installed:true,directory:destination,version,runtime,registrationCopied:false};
}
