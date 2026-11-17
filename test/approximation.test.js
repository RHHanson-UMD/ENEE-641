import test from 'node:test';
import assert from 'node:assert/strict';
import {distance,tourCost,metricTsp,setCover,trim,exactSubsetSum,approxSubsetSum} from '../site/visualizations/approximation-engine.js';
test('metric TSP: square gives optimal tour and 2-approx bound',()=>{
 const r=metricTsp([[0,0],[2,0],[2,2],[0,2]]);
 assert.equal(r.mstCost,6);assert.equal(r.optimum,8);
 assert.equal(r.preorder.length,4);assert.equal(new Set(r.preorder).size,4);
 assert.ok(r.approxCost>=r.optimum-1e-9);assert.ok(r.approxCost<=2*r.optimum+1e-9);
});
test('metric TSP: triangles and varied coordinate examples respect guarantee',()=>{
 const examples=[[[0,0],[3,0],[0,4]],[[0,0],[1,2],[3,6],[9,4],[6,1]],[[0,0],[0,0],[2,1],[5,3]]];
 for(const p of examples){const r=metricTsp(p);assert.ok(r.mstCost<=r.optimum+1e-8);assert.ok(r.approxCost<=2*r.optimum+1e-8);}
});
test('set cover: known optimum and greedy feasibility',()=>{
 const r=setCover([1,2,3,4,5,6],[[1,2,3],[3,4],[4,5,6],[1,6]]);
 assert.equal(r.optimal.length,2);
 assert.ok(r.steps.length>=2);
 assert.deepEqual([...new Set(r.selected.flatMap(i=>[[1,2,3],[3,4],[4,5,6],[1,6]][i]))].sort(),[1,2,3,4,5,6]);
});
test('set cover: uncoverable universe rejects',()=>assert.throws(()=>setCover([1,2],[[1]])));
test('trim reproduces lecture values exactly',()=>assert.deepEqual(trim([10,11,12,15,20,21,22,23,24,29],0.1),[10,12,15,20,23,29]));
test('lecture subset-sum example: independent optimum',()=>{
 const v=[104,102,201,101],t=308;
 assert.equal(exactSubsetSum(v,t),307);
 const r=approxSubsetSum(v,t,0.4);
 assert.equal(r.delta,0.05);
 assert.ok(r.best<=t);assert.ok(307/r.best<=1.4);
});
test('subset-sum FPTAS: exhaustive oracle on small instances',()=>{
 const cases=[[2,3,5,7],[10,12,15,20],[6,8,11,14],[1,2,3,4,5],[30,35,41,57]];
 for(const v of cases)for(const t of [5,12,20,30,65,100])for(const eps of [0.1,0.25,0.4,1]){
  const exact=exactSubsetSum(v,t),r=approxSubsetSum(v,t,eps);
  assert.ok(r.best<=t);
  assert.ok(exact===0?r.best===0:exact/r.best<=1+eps+1e-9,JSON.stringify({v,t,eps,exact,r}));
 }
});
test('invalid epsilon rejected',()=>assert.throws(()=>approxSubsetSum([1,2],3,0)));
