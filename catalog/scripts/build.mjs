import {build} from 'esbuild';import fs from 'node:fs';
await build({entryPoints:['catalog/frontend/view.mjs'],bundle:true,format:'esm',write:true,outfile:'catalog/frontend/view.bundle.js',minify:true});
const html=fs.readFileSync('catalog/frontend/index.html','utf8');fs.writeFileSync('catalog/frontend/mcp.html',html.replace('<script type="module" src="/view.bundle.js"></script>','<script type="module">'+fs.readFileSync('catalog/frontend/view.bundle.js','utf8').replace(/<\/script/gi,'<\\/script')+'</script>'));
