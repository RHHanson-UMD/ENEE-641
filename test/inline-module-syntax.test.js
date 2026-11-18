import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

const directory=new URL('../site/visualizations/',import.meta.url);
const htmlFiles=readdirSync(directory).filter(f=>f.endsWith('.html'));

for(const file of htmlFiles){
 test('Inline ES module syntax: '+file,()=>{
  const html=readFileSync(join(directory.pathname,file),'utf8');
  const scripts=[...html.matchAll(/<script\b[^>]*\btype=["']module["'][^>]*>([\s\S]*?)<\/script>/g)]
    .map(match=>match[1]).filter(body=>body.trim().length>0);
  for(const [index,script] of scripts.entries()){
   const result=spawnSync(process.execPath,['--check','--input-type=module'],{input:script,encoding:'utf8'});
   assert.equal(result.status,0,'Inline module '+index+' in '+file+' failed syntax check: '+result.stderr);
  }
 });
}
