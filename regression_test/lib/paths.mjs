import fs from 'node:fs';
import path from 'node:path';
export function inside(root, relative) {
 root=fs.realpathSync(root);const target=path.resolve(root,relative);
 if(target!==root&&!target.startsWith(root+path.sep))throw Error('Path escapes repository');
 let ancestor=target;while(!fs.existsSync(ancestor))ancestor=path.dirname(ancestor);
 const real=fs.realpathSync(ancestor);
 if(real!==root&&!real.startsWith(root+path.sep))throw Error('Symlink escapes repository');
 return target;
}
export const shortError=e=>String(e?.message||e).replace(/(token|secret|authorization|cookie)\s*[:=]\s*\S+/gi,'$1=[REDACTED]').slice(0,1500);
