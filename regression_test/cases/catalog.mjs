import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {parse} from 'acorn';import YAML from 'yaml';import {inside} from '../lib/paths.mjs';
import {normalizeFilters,metadataMismatch,moduleMatches} from './filters.mjs';
const enums={surface:['gui','skill','integration'],priority:['critical','normal','extended'],origin:['requirement','bug','acceptance-gap'],status:['trial','active','rotten','obsolete'],effects:['read-only','isolated-write','external-write'],cost:['fast','normal','slow']};
function literal(n){
 if(n?.type==='Literal'&&!(n.regex))return n.value;
 if(n?.type==='TemplateLiteral'&&!n.expressions.length)return n.quasis[0].value.cooked;
 if(n?.type==='ArrayExpression')return n.elements.map(literal);
 if(n?.type==='ObjectExpression'){const o={};for(const p of n.properties){if(p.type!=='Property'||p.computed||p.kind!=='init'||p.method)throw Error('Metadata must be literal');const key=p.key.name??p.key.value;if(['__proto__','constructor','prototype'].includes(key))throw Error('Invalid metadata key');o[key]=literal(p.value);}return o;}
 throw Error('Metadata must be literal');
}
export function parseCase(text,file){
 const ast=parse(text,{ecmaVersion:'latest',sourceType:'module'});const exports={};let runnable=false;
 for(const n of ast.body){if(n.type!=='ExportNamedDeclaration')continue;const d=n.declaration;
 if(d?.type==='VariableDeclaration')for(const v of d.declarations)if(['USECASE','META','REQUIREMENTS'].includes(v.id.name))exports[v.id.name]=literal(v.init);
 if(d?.type==='FunctionDeclaration'&&d.id.name==='run')runnable=true;
 }
 const {USECASE:u,META:m,REQUIREMENTS:requirements={}}=exports;
 if(!requirements||typeof requirements!=='object'||Array.isArray(requirements))throw Error('REQUIREMENTS must be a literal object');
 if(!u||!m||typeof u.name!=='string'||!u.name.trim()||typeof u.description!=='string'||!u.description.trim())throw Error('Export literal USECASE {name,description} and META');
 if(typeof m.id!=='string'||!/^[-\w.]+$/.test(m.id)||typeof m.module!=='string'||!/^[-\w]+(?:\/[-\w]+)*$/.test(m.module))throw Error('Invalid case id/module');
 for(const [key,values]of Object.entries(enums))if(!values.includes(m[key]))throw Error('Invalid '+key);
 if(m.parallelSafe!==undefined&&typeof m.parallelSafe!=='boolean')throw Error('Invalid parallelSafe');
 if(m.locks!==undefined&&(!Array.isArray(m.locks)||m.locks.some(x=>typeof x!=='string'||!x.trim())))throw Error('Invalid locks');
 for(const key of ['covers','requires','affectedPaths'])if(!Array.isArray(m[key]??[])||(m[key]??[]).some(x=>typeof x!=='string'))throw Error('Invalid '+key);
 if(['rotten','obsolete'].includes(m.status)&&!m.statusReason)throw Error('Inactive case requires statusReason');
 return {id:m.id,name:u.name,description:u.description,runnable,requirements,meta:m,file,digest:crypto.createHash('sha256').update(text).digest('hex')};
}
export function project(repo,index='regression_test/regression.config.yaml'){
 repo=fs.realpathSync(repo);const file=inside(repo,index),config=YAML.parse(fs.readFileSync(file,'utf8'));
 if(config.schemaVersion!==1||!Array.isArray(config.caseDirectories)||!config.caseDirectories.length||typeof config.regressionDirectory!=='string')throw Error('Invalid regression index');
 const roots=config.caseDirectories.map(p=>inside(repo,path.relative(repo,path.resolve(path.dirname(file),p))));
 const recordRoot=inside(repo,path.relative(repo,path.resolve(path.dirname(file),config.regressionDirectory)));
 return {repo,index,config,roots,recordRoot};
}
export function catalog(p){const cases=[],diagnostics=[],seen=new Set(),files=new Set();
 function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){if(e.name.startsWith('_')||e.name.startsWith('.'))continue;const file=path.join(dir,e.name);if(e.isSymbolicLink()){diagnostics.push({file:path.relative(p.repo,file),error:'Symlinked cases are not discovered'});continue;}if(e.isDirectory())walk(file);else if(e.name.endsWith('.mjs')&&!files.has(file)){files.add(file);const rel=path.relative(p.repo,file);try{const c=parseCase(fs.readFileSync(file,'utf8'),rel);if(seen.has(c.id))throw Error('Duplicate case ID '+c.id);seen.add(c.id);cases.push(c);}catch(e){diagnostics.push({file:rel,error:e.message});}}}}
 for(const r of p.roots)try{walk(r);}catch(e){diagnostics.push({file:path.relative(p.repo,r),error:e.message});}
 return {cases,diagnostics};
}
export function plan(p,filters={}){const c=catalog(p);filters=normalizeFilters(filters,c.cases);const profile=filters.profile||'full';if(!['full','change','release'].includes(profile))throw Error('Unknown profile');
 const list=v=>Array.isArray(v)?v:typeof v==='string'?v.split(',').filter(Boolean):[];
 const ids=list(filters.ids),explicitIds=[...ids,...(filters.meta.id||[])],modules=list(filters.modules),changed=list(filters.changedModules);
 const items=c.cases.map(c=>{let reason='Selected by '+profile;let selected=true;
 if(!c.runnable){selected=false;reason='Script not implemented';}
 else if(!['trial','active'].includes(c.meta.status)&&!(filters.validateInactive===true&&explicitIds.includes(c.id)&&c.meta.status==='rotten')){selected=false;reason='Lifecycle '+c.meta.status;}
 else if(ids.length&&!ids.includes(c.id)){selected=false;reason='Case filter';}
 else if(modules.length&&!modules.some(m=>moduleMatches(c.meta.module,m))){selected=false;reason='Module filter';}
 else if(filters.surface&&c.meta.surface!==filters.surface){selected=false;reason='Surface filter';}
 else if(metadataMismatch(c.meta,filters.meta)){selected=false;reason=metadataMismatch(c.meta,filters.meta);}
 else if(!explicitIds.length&&profile==='change'&&!changed.some(m=>moduleMatches(c.meta.module,m))){selected=false;reason=changed.length?'Module unaffected':'Impact unknown; supply changedModules or explicit IDs';}
 else if(!explicitIds.length&&profile==='release'&&c.meta.priority!=='critical'&&!changed.some(m=>moduleMatches(c.meta.module,m))){selected=false;reason='Outside release scope';}
 return {...c,selected,reason};});
 return {profile,filters,diagnostics:c.diagnostics,items,selected:items.filter(i=>i.selected).length};
}
export function setStatus(p,id,status,reason){if(!enums.status.includes(status)||!reason?.trim())throw Error('Status and reason required');const c=catalog(p).cases.find(c=>c.id===id);if(!c)throw Error('Unknown case');const file=inside(p.repo,c.file),text=fs.readFileSync(file,'utf8'),ast=parse(text,{ecmaVersion:'latest',sourceType:'module'});const declaration=ast.body.find(n=>n.type==='ExportNamedDeclaration'&&n.declaration?.type==='VariableDeclaration'&&n.declaration.declarations.some(v=>v.id.name==='META'));const n=declaration.declaration.declarations.find(v=>v.id.name==='META').init;const next={...c.meta,status,statusReason:reason};const updated=text.slice(0,n.start)+JSON.stringify(next,null,2)+text.slice(n.end);parseCase(updated,c.file);fs.writeFileSync(file,updated);return {id,status};}
