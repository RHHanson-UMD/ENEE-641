import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const site=fileURLToPath(new URL('../site/',import.meta.url));
const targets=['index.html','reviews/exam-1.html','reviews/exam-2.html','reviews/exam-2-practice.html','visualizations/gpu-slide-figures.html'];
for (const file of targets) {
 test('All local review/homepage HTML lesson links resolve: '+file,()=>{
  const path=resolve(site,file),html=readFileSync(path,'utf8');
  const hrefs=[...html.matchAll(/href=["']([^"']+)["']/g)].map(x=>x[1]).filter(x=>x.includes('.html')&&!/^https?:/.test(x));
  assert.ok(hrefs.length>4);
  for(const href of hrefs) {
    const [local,anchor]=href.split('#');
    const target=resolve(dirname(path),local);
    assert.ok(target.startsWith(site),'Local link must stay inside site: '+href);
    assert.ok(existsSync(target),'Missing linked page '+file+' → '+href);
    if(anchor) {
      const targetHtml=readFileSync(target,'utf8');
      assert.ok(targetHtml.includes('id="'+anchor+'"')||targetHtml.includes("id='"+anchor+"'"),'Missing anchor '+file+' → '+href);
    }
  }
 });
}
test('Chapter-first catalog contains all known early topics and separate exam guides',()=>{
 const html=readFileSync(resolve(site,'index.html'),'utf8');
 const nums=[1,2,3,4,6,7,8,9,11,12,13,14,15,16,17,18,22,23,24,25,34,35];
 for(const n of nums)assert.match(html,new RegExp('id="chapter-'+n+'"'));
 assert.equal((html.match(/<details class="chapter-group"/g)||[]).length,nums.length);
 assert.equal((html.match(/<\/details>/g)||[]).length,nums.length);
 assert.match(html,/reviews\/exam-1.html/);assert.match(html,/reviews\/exam-2.html/);
});
