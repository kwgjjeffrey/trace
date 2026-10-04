import {build} from 'esbuild';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const file=name=>fileURLToPath(new URL('../frontend/'+name,import.meta.url));
await build({absWorkingDir:root,entryPoints:[file('view.mjs')],bundle:true,format:'esm',outfile:file('view.bundle.js'),minify:true});
const html=fs.readFileSync(file('index.html'),'utf8');
fs.writeFileSync(file('mcp.html'),html.replace('<script type="module" src="/view.bundle.js"></script>','<script type="module">'+fs.readFileSync(file('view.bundle.js'),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>'));
