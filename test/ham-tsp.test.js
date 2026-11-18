import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeHamTsp,allPairs,edgeKey} from '../site/visualizations/ham-tsp-engine.js';
test('five-cycle has a zero tour',()=>{
 const r=analyzeHamTsp(5,[[0,1],[1,2],[2,3],[3,4],[4,0]]);
 assert.equal(r.bestCost,0);assert.equal(r.hasHamiltonianCycle,true);assert.equal(r.hamTour.length,5);
});
test('path requires at least one nonedge',()=>{
 const r=analyzeHamTsp(5,[[0,1],[1,2],[2,3],[3,4]]);
 assert.equal(r.bestCost,1);assert.equal(r.hasHamiltonianCycle,false);
});
test('star has no Hamiltonian cycle',()=>{
 const r=analyzeHamTsp(5,[[0,1],[0,2],[0,3],[0,4]]);
 assert.ok(r.bestCost>0);assert.equal(r.hasHamiltonianCycle,false);
});
test('complete graph has zero tour; edgeless graph costs n',()=>{
 assert.equal(analyzeHamTsp(4,allPairs(4)).bestCost,0);
 assert.equal(analyzeHamTsp(4,[]).bestCost,4);
});
test('all 3-vertex undirected graphs agree with direct Hamilton cycle rule',()=>{
 const pairs=allPairs(3);
 for(let mask=0;mask<8;mask++){
  const edges=pairs.filter((_,i)=>(mask>>i)&1),r=analyzeHamTsp(3,edges);
  assert.equal(r.hasHamiltonianCycle,edges.length===3);
 }
});
test('rejects loops and invalid endpoints',()=>{
 assert.throws(()=>analyzeHamTsp(5,[[0,0]]));
 assert.throws(()=>analyzeHamTsp(5,[[0,5]]));
});
