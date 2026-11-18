import test from 'node:test';
import assert from 'node:assert/strict';
import {lectures,frequencies,selectActivities,exactActivityCount,huffman,exactMergeCost} from '../site/visualizations/greedy-engine.js';
test('activity scheduling greedy meets exhaustive optimum',()=>{
 const r=selectActivities(lectures);
 assert.equal(r.selected.length,4);
 assert.equal(exactActivityCount(lectures),4);
 const intervals=r.selected.map(i=>lectures[i]);
 assert.ok(intervals.every((a,i)=>!i||intervals[i-1][1]<=a[0]));
});
test('activity scheduling accepts touching endpoints',()=>{
 const x=[[0,1],[1,2],[2,3],[0,3]];
 assert.equal(selectActivities(x).selected.length,3);
 assert.equal(exactActivityCount(x),3);
});
test('activity scheduling sorted by finish, not input order',()=>{
 const x=[[1,8],[0,2],[2,4],[4,5]];
 assert.deepEqual(selectActivities(x).selected,[1,2,3]);
});
test('Huffman: independent optimal weighted bit count',()=>{
 const h=huffman(frequencies);
 assert.equal(h.weightedCost,166);
 assert.equal(exactMergeCost(Object.values(frequencies)),166);
 const codes=Object.values(h.codes);
 for(const a of codes)for(const b of codes)if(a!==b)assert.equal(b.startsWith(a),false);
});
test('equal-frequency and singleton code cases',()=>{
 const h=huffman({A:1,B:1,C:1,D:1});
 assert.equal(h.weightedCost,8);
 assert.equal(exactMergeCost([1,1,1,1]),8);
 assert.equal(huffman({A:3}).codes.A,'0');
});
test('invalid inputs rejected',()=>{
 assert.throws(()=>selectActivities([[3,2]]));
 assert.throws(()=>huffman({A:0,B:3}));
});
