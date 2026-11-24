import test from 'node:test';import assert from 'node:assert/strict';
import {systolicMatmul,referenceMatmul} from '../site/visualizations/systolic-array-engine.js';
test('output stationary 2x2 systolic model has four products per output',()=>{
 const A=[[1,2],[3,4]],B=[[5,6],[7,8]];
 const s=systolicMatmul(A,B);
 assert.deepEqual(s.result,[[19,22],[43,50]]);
 assert.equal(s.ticks,4);assert.equal(s.multiplications,8);
 assert.deepEqual(s.rounds.map(r=>r.products.length),[1,3,3,1]);
 assert.equal(s.rounds[0].products[0].row,0);
});
test('independent matrix oracle and exact n cubed products',()=>{
 let state=21;const rand=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return(state%13)-6;};
 for(let n=1;n<=5;n++)for(let trial=0;trial<10;trial++){
  const A=Array.from({length:n},()=>Array.from({length:n},rand));
  const B=Array.from({length:n},()=>Array.from({length:n},rand));
  const s=systolicMatmul(A,B);
  assert.deepEqual(s.result,referenceMatmul(A,B));
  assert.equal(s.rounds.flatMap(r=>r.products).length,n**3);
  assert.equal(s.ticks,3*n-2);
  for(let i=0;i<n;i++)for(let j=0;j<n;j++)
   assert.equal(s.rounds.filter(r=>r.products.some(p=>p.row===i&&p.col===j)).length,n);
 }
});
test('zero and invalid matrices rejected accurately',()=>{
 assert.deepEqual(systolicMatmul([[0]],[[7]]).result,[[0]]);
 assert.throws(()=>systolicMatmul([[1,2]],[[1,2]]),RangeError);
 assert.throws(()=>systolicMatmul([],[]),RangeError);
});
