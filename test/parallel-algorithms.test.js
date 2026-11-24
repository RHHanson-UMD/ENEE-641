import test from 'node:test';import assert from 'node:assert/strict';
import {reductionTrace,prefixTrace,compactByFlag,workDepthBound} from '../site/visualizations/parallel-algorithms-engine.js';
test('lecture eight-element summation model: two n operations, log n plus two rounds',()=>{
 const a=[3,-1,4,1,5,9,-2,6],r=reductionTrace(a);
 assert.equal(r.sum,25);assert.equal(r.work,2*a.length);assert.equal(r.additionWork,a.length-1);
 assert.equal(r.depth,Math.log2(a.length)+2);
 assert.deepEqual(r.rounds.map(x=>x.operations),[8,4,2,1,1]);
 assert.deepEqual(r.wdProcessorTime(2).perRound,[4,2,1,1,1]);
});
test('prefix scan independently verified with a serial oracle for signed arrays',()=>{
 let state=11;const rnd=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return (state%21)-10;};
 for(const n of [1,2,4,8,16,32,64]){
  for(let trial=0;trial<7;trial++){
   const a=Array.from({length:n},rnd),r=prefixTrace(a);let sum=0;
   const expected=a.map(x=>(sum+=x));
   assert.deepEqual(r.inclusive,expected);assert.equal(r.total,expected.at(-1));
   assert.deepEqual(r.exclusive,expected.map((x,i)=>x-a[i]));
   assert.ok(r.additionWork<=3*n);assert.equal(r.depth,2*Math.log2(n)+1);
  }
 }
});
test('compaction remains stable; all flags zero or one and invalid flags',()=>{
 for(const [a,flags,expected] of [
  [[8,7,6,5],[0,1,1,0],[7,6]],
  [[1,2,3,4],[0,0,0,0],[]],
  [[1,2,3,4],[1,1,1,1],[1,2,3,4]]]){
  let r=compactByFlag(a,flags);assert.deepEqual(r.output,expected);
 }
 assert.throws(()=>compactByFlag([1,2],[1,2]),RangeError);
});
test('work-depth bounded processor tradeoff and invalid models',()=>{
 const b=workDepthBound(16,5,2);
 assert.equal(b.lowerBound,8);assert.equal(b.upperBoundIllustration,13);
 assert.throws(()=>reductionTrace([1,2,3]));assert.throws(()=>prefixTrace([]));
 assert.throws(()=>workDepthBound(2,0,1));assert.throws(()=>reductionTrace([NaN]));
});
