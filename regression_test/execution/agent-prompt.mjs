import fs from 'node:fs';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const quote=v=>/^[a-zA-Z0-9_./:-]+$/.test(String(v))?String(v):"'"+String(v).replace(/'/g,"'\\''")+"'";
export function agentPrompt(p,selection){
 // Consumer instruction is extracted verbatim; the GUI owns no second copy of agent guidance.
 const md=fs.readFileSync(new URL('../SKILL.md',import.meta.url),'utf8');const section=md.match(/## Run regression\n([\s\S]*?)(?=\n## |$)/)?.[1]?.trim();if(!section)throw Error('Run regression instructions missing');
 const f=selection.filters,flags=['--meta',JSON.stringify(f.meta)];if(f.profile&&f.profile!=='full')flags.push('--profile',f.profile);
 for(const k of ['runId','environment','params','ids','modules','surface','changedModules','timeoutMs','concurrency','name'])if(f[k]!==undefined&&f[k]!==''&&!(k==='timeoutMs'&&Number(f[k])===60000))flags.push('--'+k,Array.isArray(f[k])?f[k].join(','):f[k]);
 for(const k of ['validateInactive','allowExternalWrites'])if(f[k])flags.push('--'+k,'true');
 const command=['sh',root+'setup/run.sh','regression_test/cli.mjs','run','--repo',p.repo,...(p.index==='regression_test/regression.config.yaml'?[]:['--index',p.index]),...flags].map(quote).join(' ');
 return {instruction:section,filters:f,selected:selection.selected,prompt:section+'\n\n```sh\n'+command+'\n```'};
}
