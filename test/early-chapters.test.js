import test from 'node:test';import assert from 'node:assert/strict';
import {heapSortTrace,stableCountingSort,stableRadixSort,bucketSort,bstInsert,bstInorder,bstSearchPath,bstDelete,bstHeight} from '../site/visualizations/early-chapters-engine.js';
test('heap trace: source initial input, max heap and sorted result',()=>{
 const s=[9,1,3,14,10,2,8,16,7,4],t=heapSortTrace(s);
 assert.deepEqual(t.sorted,[1,2,3,4,7,8,9,10,14,16]);assert.deepEqual(s,[9,1,3,14,10,2,8,16,7,4]);
 for(let i=1;i<t.build.length;i++)assert.ok(t.build[Math.floor((i-1)/2)]>=t.build[i]);assert.ok(t.steps.length>10);
});
test('heap counterexamples: duplicates, empty, bad input',()=>{assert.deepEqual(heapSortTrace([4,4,-1,2]).sorted,[-1,2,4,4]);assert.deepEqual(heapSortTrace([]).sorted,[]);assert.throws(()=>heapSortTrace([Infinity]));});
test('counting sort stable equal-key records and invalid input',()=>{
 const r=[{key:2,id:'A'},{key:0,id:'B'},{key:2,id:'C'},{key:1,id:'D'}];
 assert.deepEqual(stableCountingSort(r,2).sorted.map(x=>x.id),['B','D','A','C']);assert.throws(()=>stableCountingSort([{key:-1}],2));});
test('radix sort preserves numeric order for multiple digits and repeated keys',()=>{
 assert.deepEqual(stableRadixSort([329,457,657,839,436,720,355],10).sorted,[329,355,436,457,657,720,839]);
 assert.deepEqual(stableRadixSort([10,0,10,1],2).sorted,[0,1,10,10]);
 assert.throws(()=>stableRadixSort([-1]));});
test('bucket sort correct and rejects invalid range',()=>{assert.deepEqual(bucketSort([.5,.01,.99,.3]).sorted,[.01,.3,.5,.99]);assert.throws(()=>bucketSort([1]));});
test('BST insertion, search, successor deletion, duplicates and full deletion',()=>{
 let r=null;for(const k of [10,5,15,12,18,5])r=bstInsert(r,k);
 assert.deepEqual(bstInorder(r),[5,5,10,12,15,18]);
 assert.deepEqual(bstSearchPath(r,12),{found:true,path:[10,15,12]});assert.equal(bstSearchPath(r,99).found,false);
 r=bstDelete(r,10);assert.deepEqual(bstInorder(r),[5,5,12,15,18]);
 for(const k of [5,5,12,15,18])r=bstDelete(r,k);assert.equal(r,null);assert.equal(bstHeight(null),-1);
});