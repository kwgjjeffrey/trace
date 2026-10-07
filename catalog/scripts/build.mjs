import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {build} from 'vite';
const root=fileURLToPath(new URL('../../',import.meta.url));
await build({configFile:path.join(root,'catalog/ui/vite.config.ts')});
// MCP serves the same React app as one self-contained resource, not a second UI implementation.
const output=path.join(root,'catalog/.runtime/ui');let html=fs.readFileSync(path.join(output,'index.html'),'utf8');
html=html.replace(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g,(_,url)=>'<script type="module">'+fs.readFileSync(path.join(output,url.replace(/^\//,'')),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
html=html.replace(/<link[^>]+href="([^"]+\.css)"[^>]*>/g,(_,url)=>'<style>'+fs.readFileSync(path.join(output,url.replace(/^\//,'')),'utf8')+'</style>');
fs.writeFileSync(path.join(output,'mcp.html'),html);
