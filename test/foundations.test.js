import test from 'node:test';import assert from 'node:assert/strict';
import{mergeSortTrace,lomutoPartitionTrace,deterministicSelect,recurrenceLevels}from '../site/visualizations/foundations-engine.js';
test('merge sort matches independent numeric sort, empty and duplicates',()=>{
 for(const a of [[],[2],[3,2,1,3],[8,5,-1,0,12,12,6]])assert.deepEqual(mergeSortTrace(a).sorted,a.slice().sort((x,y)=>x-y));});
test('partition is a correct permutation and bounds both sides',()=>{
 for(const a of [[7,2,5,1,6],[3,3,3],[1],[-2,5,-1,0]]){let r=lomutoPartitionTrace(a);assert.deepEqual(r.values.slice().sort((x,y)=>x-y),a.slice().sort((x,y)=>x-y));assert.ok(r.values.slice(0,r.pivotIndex).every(x=>x<=r.pivot));assert.ok(r.values.slice(r.pivotIndex+1).every(x=>x>r.pivot));}});
test('deterministic selection matches independent sorted oracle for all ranks',()=>{
 const a=[11,-1,3,9,7,7,15,0,2,6,19,4,8,10,1,2,5];for(let k=1;k<=a.length;k++)assert.equal(deterministicSelect(a,k).value,a.slice().sort((x,y)=>x-y)[k-1]);assert.throws(()=>deterministicSelect(a,0));});
test('recursion tree work at a=b=2 p=1 is n per full level',()=>{
 const r=recurrenceLevels(16,2,2,1);assert.deepEqual(r.slice(0,5).map(x=>x.work),[16,16,16,16,16]);assert.equal(r.at(-1).size,1);assert.throws(()=>recurrenceLevels(0));});
