import fs from 'node:fs';
import path from 'node:path';
import {inside} from '../../regression_test/lib/paths.mjs';
const start='<!-- trace-skill:start -->',end='<!-- trace-skill:end -->';
export function initializeProject(repo,{regression=false,index='regression_test/regression.config.yaml'}={}){
 repo=fs.realpathSync(repo);const changes=[];
 const queue=(relative,content,replace=false)=>{const file=inside(repo,relative);if(fs.existsSync(file)&&fs.lstatSync(file).isSymbolicLink())throw Error('Refusing symlinked project file: '+relative);if(!fs.existsSync(file)||replace&&fs.readFileSync(file,'utf8')!==content)changes.push({file,content,replace:fs.existsSync(file)});};
 const agents=inside(repo,'AGENTS.md');if(fs.existsSync(agents)&&fs.lstatSync(agents).isSymbolicLink())throw Error('Refusing symlinked AGENTS.md');
 const text=fs.existsSync(agents)?fs.readFileSync(agents,'utf8'):'';
 if((text.split(start).length-1)!==(text.split(end).length-1)||text.split(start).length>2||text.includes(end)&&text.indexOf(end)<text.indexOf(start))throw Error('Malformed Trace managed block in AGENTS.md');
 const block=`${start}\n## Agent Dev Suite dependency\n\nThis project uses the separately installed Agent Dev Suite for instrumentation, trace analysis and regression tests. It is not vendored or Git-tracked here.\n\nIf unavailable, install the whole skill:\n\n\`\`\`sh\ncurl -fsSL https://raw.githubusercontent.com/kwgjjeffrey/trace/main/setup/install.sh | sh\n\`\`\`\n\nThe installer verifies the release and prepares private runtime dependencies. Default installation: ~/.codex/skills/trace; set TRACE_INSTALL_DIR for another agent host. Read the installed SKILL.md, then load only instrumentation/, analysis/ or regression_test/ instructions needed for the task. Use setup/run.sh when Node is not on PATH.\n\nProject registries, adapters and cases stay in this repository; tokens and personal destinations stay in ignored or external private configuration. No configured destination means tracing stays disabled. Discover the project's actual registry paths; do not assume the skill installation owns project data.\n${end}`;
 queue('AGENTS.md',text.includes(start)?text.slice(0,text.indexOf(start))+block+text.slice(text.indexOf(end)+end.length):text+(text&&!text.endsWith('\n')?'\n':'')+'\n'+block+'\n',true);
 if(regression){
  const file=inside(repo,index),dir=path.dirname(file),relative=path.relative(repo,dir);
  queue(index,'# Paths are relative to this registry. Configure browser and prerequisites for this project.\nschemaVersion: 1\ncaseDirectories: [cases]\nregressionDirectory: .runs\n');
  for(const [name,template]of [['AGENTS.md','AGENTS.md'],['cases/_example.mjs','case-only.mjs']])queue(path.join(relative,name),fs.readFileSync(new URL('templates/'+template,import.meta.url),'utf8'));
  const ignore=path.join(relative,'.gitignore'),existing=inside(repo,ignore);const value=fs.existsSync(existing)?fs.readFileSync(existing,'utf8'):'';
  // Only the default local output is ignored; existing custom registries are never rewritten.
  queue(ignore,value.split(/\r?\n/).includes('/.runs/')?value:value+(value&&!value.endsWith('\n')?'\n':'')+'/.runs/\n',true);
 }
 // All paths and managed content are validated before the first mutation. Existing project files survive.
 for(const c of changes){fs.mkdirSync(path.dirname(c.file),{recursive:true});fs.writeFileSync(c.file,c.content,{flag:c.replace?'w':'wx'});}
 return {repo,changed:changes.map(c=>path.relative(repo,c.file)),regression};
}
