import {defineConfig} from 'vite';import tailwindcss from '@tailwindcss/vite';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));export default defineConfig({root,plugins:[tailwindcss()],resolve:{alias:{'@':path.join(root,'src')}},build:{outDir:path.join(root,'../.runtime/ui'),emptyOutDir:true}});
