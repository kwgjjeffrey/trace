import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {managedPaths,dataDirectory} from '../setup/data-policy.mjs';
test('persistent data survives initialization and cannot enter upgrade or restoration file lists',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'trace-data-'));
 try{const data=dataDirectory(root);fs.writeFileSync(path.join(data,'suite.sqlite'),'existing database');dataDirectory(root);assert.equal(fs.readFileSync(path.join(data,'suite.sqlite'),'utf8'),'existing database');
 for(const file of ['.data/suite.sqlite','.data','.data\\runs\\record.yaml'])assert.throws(()=>managedPaths([file]),/persistent/);
 assert.deepEqual(managedPaths(['setup/setup.mjs','package.json']),['setup/setup.mjs','package.json']);
 assert.throws(()=>managedPaths(['../.data/a']),/Unsafe/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
