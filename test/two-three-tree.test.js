import test from 'node:test';
import assert from 'node:assert/strict';
import {build,insert,contains,validateTree} from '../site/visualizations/two-three-tree-engine.js';
test('ascending insertions preserve keys and equal leaf depth',()=>{
 const seq=Array.from({length:100},(_,i)=>i+1);const r=build(seq);
 const check=validateTree(r.tree);assert.equal(check.valid,true);assert.equal(check.count,100);
 for(const k of seq)assert.equal(contains(r.tree,k),true);
 assert.equal(contains(r.tree,101),false);
 assert.ok(check.height<=8);
});
test('descending and interleaved insertions remain valid',()=>{
 const sequences=[[10,9,8,7,6,5,4,3,2,1],[8,4,12,2,6,10,14,1,3,5,7,9,11,13,15]];
 for(const seq of sequences){
  const r=build(seq);assert.equal(validateTree(r.tree).valid,true);
  assert.equal(validateTree(r.tree).count,new Set(seq).size);
  assert.ok(seq.every(k=>contains(r.tree,k)));
 }
});
test('root splits on third insertion',()=>{
 const r=build([10,20,30]);assert.deepEqual(r.tree.keys,[20]);
 assert.deepEqual(r.tree.children.map(c=>c.keys),[[10],[30]]);
 assert.equal(validateTree(r.tree).height,2);
});
test('duplicate inserts leave tree unchanged',()=>{
 const old=build([1,2,3]).tree,r=insert(old,2);
 assert.equal(r.added,false);assert.strictEqual(r.tree,old);
 assert.equal(validateTree(r.tree).count,3);
});
test('arbitrary distinct key order yields same search membership',()=>{
 const seq=[25,-5,17,100,0,13,-30,44,39,27,9];
 const r=build(seq);const c=validateTree(r.tree);
 assert.equal(c.valid,true);assert.equal(c.count,seq.length);
 for(const key of seq)assert.equal(contains(r.tree,key),true);
});
test('invalid noninteger key rejected',()=>assert.throws(()=>insert(null,1.5)));
