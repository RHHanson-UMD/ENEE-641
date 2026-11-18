import test from 'node:test';
import assert from 'node:assert/strict';
import {insert,contains,snapshot,verify,build} from '../site/visualizations/red-black-engine.js';
test('ascending 100 insertions maintain all red-black properties and height',()=>{
 const seq=Array.from({length:100},(_,i)=>i+1);
 const r=build(seq),check=verify(r.root);
 assert.equal(check.valid,true);assert.equal(check.size,100);
 assert.ok(check.height<=2*Math.log2(101));
 for(const k of seq)assert.ok(contains(r.root,k));
});
test('known rotation: inserting 1,2,3 makes 2 black root',()=>{
 const r=build([1,2,3]);
 assert.equal(r.root.key,2);assert.equal(r.root.color,'B');
 assert.equal(r.root.left.key,1);assert.equal(r.root.right.key,3);
 assert.equal(verify(r.root).valid,true);
 assert.ok(r.states[3].events.some(s=>s.includes('Rotate left')));
});
test('red uncle triggers recoloring',()=>{
 const r=build([10,5,15,1]);
 assert.equal(verify(r.root).valid,true);
 assert.ok(r.states[4].events.some(s=>s.includes('red uncle')));
});
test('descending, zigzag and negative keys remain valid',()=>{
 const cases=[[10,9,8,7,6,5,4,3,2,1],[20,10,30,5,15,25,35,1,7,13,17],[-5,-10,-7,0,12,-20]];
 for(const seq of cases){
  const r=build(seq);assert.equal(verify(r.root).valid,true);
  seq.forEach(key=>assert.ok(contains(r.root,key)));
 }
});
test('duplicate insertion leaves original tree unchanged',()=>{
 const original=build([3,1,5]).root,r=insert(original,1);
 assert.equal(r.added,false);assert.strictEqual(r.root,original);
 assert.equal(verify(r.root).size,3);
});
test('invalid key rejected',()=>assert.throws(()=>insert(null,2.5)));
