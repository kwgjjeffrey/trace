import fs from 'node:fs';
import path from 'node:path';
// Runtime data is never a managed source file, including in older or malformed packages.
export function managedPaths(files){
 for(const file of files){
  const parts=file.replaceAll('\\','/').split('/');
  if(path.isAbsolute(file)||parts.includes('..'))throw Error('Unsafe package path: '+file);
  if(parts[0]==='.data')throw Error('Release must not contain persistent .data: '+file);
 }
 return files;
}
export function dataDirectory(root){
 const directory=path.join(root,'.data');
 if(fs.existsSync(directory)&&(!fs.lstatSync(directory).isDirectory()||fs.lstatSync(directory).isSymbolicLink()))throw Error('Persistent .data must be a real directory');
 fs.mkdirSync(directory,{recursive:true,mode:0o700});
 return directory;
}
