import test from 'node:test';import assert from 'node:assert/strict';
import {insert as rbInsert,contains as rbContains,verify as rbVerify} from '../site/visualizations/red-black-engine.js';
import {insert as ttInsert,contains as ttContains,validateTree} from '../site/visualizations/two-three-tree-engine.js';
import {redBlackDelete,twoThreeDelete} from '../site/visualizations/balanced-deletion-engine.js';
function checkParents(root){if(!root)return;assert.equal(root.parent,null);const walk=(n,parent)=>{if(!n)return;assert.strictEqual(n.parent,parent);walk(n.left,n);walk(n.right,n)};walk(root,null)}
test('RB delete root, leaf, one child, two children, absent key and all keys',()=>{
 let r=null;for(const k of [20,10,30,5,15,25,35,1,7,13,17])r=rbInsert(r,k).root;
 for(const k of [7,20,5,30,10,25,35,13,17,1,15]){const res=redBlackDelete(r,k);r=res.root;assert.equal(res.removed,true);assert.equal(rbVerify(r).valid,true);checkParents(r);assert.equal(rbContains(r,k),false);}
 assert.equal(r,null);const missing=redBlackDelete(r,99);assert.equal(missing.removed,false);
});
test('2-3 delete underflows, sibling borrow, merge and root contraction',()=>{
 let t=null;const values=[8,4,12,2,6,10,14,1,3,5,7,9,11,13,15];for(const k of values)t=ttInsert(t,k).tree;
 for(const k of [4,2,12,14,8,6,1,3,5,7,9,10,11,13,15]){const res=twoThreeDelete(t,k);t=res.tree;assert.equal(res.removed,true);assert.equal(validateTree(t).valid,true);assert.equal(ttContains(t,k),false);}
 assert.equal(t,null);assert.equal(twoThreeDelete(null,1).removed,false);
});
test('both structures match independent Set oracle after random mixed operations',()=>{
 let state=123456789;const rnd=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state};
 for(let trial=0;trial<8;trial++){
  let rb=null,tt=null;const expected=new Set();
  for(let step=0;step<130;step++){
   const key=(rnd()%75)-35,op=rnd()%4;
   if(op===0){rb=redBlackDelete(rb,key).root;tt=twoThreeDelete(tt,key).tree;expected.delete(key);}
   else{rb=rbInsert(rb,key).root;tt=ttInsert(tt,key).tree;expected.add(key);}
   assert.equal(rbVerify(rb).valid,true,'RB trial '+trial+' step '+step);
   assert.equal(validateTree(tt).valid,true,'2–3 trial '+trial+' step '+step);
   assert.equal(rbVerify(rb).size,expected.size);
   assert.equal(validateTree(tt).count,expected.size);
   checkParents(rb);
   for(const k of expected){assert.equal(rbContains(rb,k),true);assert.equal(ttContains(tt,k),true);}
  }
 }
});
test('invalid deletion keys rejected',()=>{assert.throws(()=>redBlackDelete(null,1.5));assert.throws(()=>twoThreeDelete(null,1.5));});
