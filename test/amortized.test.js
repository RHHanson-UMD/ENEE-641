import test from 'node:test';import assert from 'node:assert/strict';import {doublingTrace} from '../site/visualizations/amortized-engine.js';
test('dynamic array aggregate copies grow linearly',()=>{
 for(const n of [0,1,2,3,4,5,16,17,63,1000]){const x=doublingTrace(n);assert.equal(x.used,n);assert.ok(x.totalCopies<2*n||n===0);assert.ok(x.totalWork<3*n||n===0);assert.ok(x.steps.every((s,i)=>s.used===i+1&&s.capacity>=s.used));}});
test('new capacity is doubled only on full insert',()=>{
 let a=doublingTrace(5);assert.deepEqual(a.steps.map(x=>x.copied),[0,1,2,0,4]);assert.equal(a.totalCopies,7);assert.throws(()=>doublingTrace(-1));});
