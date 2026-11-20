import test from 'node:test';import assert from 'node:assert/strict';import {doublingTrace} from '../site/visualizations/amortized-engine.js';
test('dynamic array aggregate copies grow linearly',()=>{
 for(const n of [0,1,2,3,4,5,16,17,63,1000]){const x=doublingTrace(n);assert.equal(x.used,n);assert.ok(x.totalCopies<2*n||n===0);assert.ok(x.totalWork<3*n||n===0);assert.ok(x.steps.every((s,i)=>s.used===i+1&&s.capacity>=s.used));}});
test('new capacity is doubled only on full insert',()=>{
 let a=doublingTrace(5);assert.deepEqual(a.steps.map(x=>x.copied),[0,1,2,0,4]);assert.equal(a.totalCopies,7);assert.throws(()=>doublingTrace(-1));});

test('binary counter exact flips and bounded amortized cost',async()=>{
 const {binaryCounterTrace}=await import('../site/visualizations/amortized-engine.js');
 const r=binaryCounterTrace(4,7);
 assert.deepEqual(r.steps.map(x=>x.flips),[1,2,1,3,1,2,1]);
 assert.equal(r.finalBits,'0111');assert.equal(r.totalFlips,11);
 assert.ok(r.steps.every(x=>x.amortizedCost===2&&x.potential>=0));
 for(let width=1;width<=9;width++)for(const n of [0,1,2,3,7,15,31,63,127].filter(x=>x<(2**width))){
  const q=binaryCounterTrace(width,n);assert.equal(q.finalBits,n.toString(2).padStart(width,'0'));
  assert.ok(q.totalFlips<=2*n);
 }
 assert.throws(()=>binaryCounterTrace(3,8));assert.throws(()=>binaryCounterTrace(0,1));
});
