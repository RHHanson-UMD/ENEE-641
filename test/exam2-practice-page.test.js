import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const site=fileURLToPath(new URL('../site/',import.meta.url));
const path=resolve(site,'reviews/exam-2-practice.html');
const page=readFileSync(path,'utf8');
test('Exam 2 practice is an original five-question drill with hidden solutions and self-rubrics',()=>{
 assert.equal((page.match(/<section class="question" id="q\d+"/g)||[]).length,5);
 assert.equal((page.match(/class="rubric-check"/g)||[]).length,20);
 assert.ok((page.match(/<details class="solution"/g)||[]).length>=8);
 for(const id of ['route-lab','mst-lab','score','priorities','answer-method','mock','cumulative'])assert.ok(page.includes('id="'+id+'"'));
 assert.match(page,/historical midterm/i);assert.match(page,/not copies of its questions/i);
});
test('No private exam document, Drive URL, protected material path or public solution key is embedded',()=>{
 for(const banned of [/F25_Midterm2/i,/drive\.google\.com/i,/umd\.instructure\.com/i,/github_pat/i,/ENEE_641_HW\d/i,/Midterm 2 December 3, 2025/i])assert.doesNotMatch(page,banned);
 assert.doesNotMatch(page,/<img[^>]+src=["']https?:/i);
});
test('All controls have IDs without duplicates and expected interactivity targets',()=>{
 const ids=[...page.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length,'Duplicate id in Exam 2 practice page');
 for(const id of ['theme-toggle','route-edges','route-source','route-target','route-run','route-reset','route-output','mst-edges','mst-cut','mst-run','mst-reset','mst-output','score-value','clear-scores'])assert.ok(ids.includes(id),'Missing '+id);
 for(let i=1;i<=5;i++)assert.ok(ids.includes('answer'+i),'Missing student answer field');
});
test('Practice inline ES module parses and imported engine exists',()=>{
 const source=[...page.matchAll(/<script\s+type="module"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
 assert.ok(source.length>200);
 const run=spawnSync(process.execPath,['--check','--input-type=module'],{input:source,encoding:'utf8'});
 assert.equal(run.status,0,'Inline module syntax invalid: '+run.stderr);
 assert.ok(existsSync(resolve(site,'reviews/exam-2-practice-engine.js')));
});
test('All review practice link destinations and hash anchors exist',()=>{
 const links=[...page.matchAll(/href="([^"]+)"/g)].map(m=>m[1]).filter(x=>/\.html(?:#|$)/.test(x)&&!/^https?:/.test(x));
 assert.ok(links.length>=5);
 for(const href of links){const [relative,anchor]=href.split('#');const dest=resolve(dirname(path),relative);assert.ok(dest.startsWith(site));assert.ok(existsSync(dest),'Missing '+href);if(anchor){let contents=readFileSync(dest,'utf8');assert.ok(contents.includes('id="'+anchor+'"'),'Missing '+href);}}
});
