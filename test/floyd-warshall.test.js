import test from 'node:test';
import assert from 'node:assert/strict';
import {floydWarshall,reconstructPath,examples} from '../site/visualizations/floyd-warshall-engine.js';
test('negative edge graph: independently calculated final distances',()=>{
 const r=floydWarshall(examples.negative);assert.equal(r.hasNegativeCycle,false);
 assert.deepEqual(r.stages.at(-1).dist,[
  [0,3,1,3],
  [4,0,-2,0],
  [6,9,0,2],
  [4,7,5,0]
 ]);
 assert.deepEqual(reconstructPath(r.stages.at(-1),0,3),[0,1,2,3]);
 assert.equal(r.stages.length,5);
});
test('initial stage only contains direct arcs',()=>{
 const r=floydWarshall(examples.negative);
 assert.equal(r.stages[0].dist[0][2],10);
 assert.deepEqual(reconstructPath(r.stages[0],0,3),[0,3]);
});
test('positive graph: path through intermediate nodes wins',()=>{
 const r=floydWarshall(examples.positive),final=r.stages.at(-1);
 assert.equal(final.dist[0][3],9);
 assert.deepEqual(reconstructPath(final,0,3),[0,1,2,3]);
});
test('unreachable destination remains infinite',()=>{
 const r=floydWarshall(examples.disconnected);
 assert.equal(r.stages.at(-1).dist[3][0],Infinity);
 assert.deepEqual(reconstructPath(r.stages.at(-1),3,0),[]);
});
test('negative cycle is detected',()=>{
 const r=floydWarshall([[0,-2],[1,0]]);
 assert.equal(r.hasNegativeCycle,true);
});
test('invalid matrix is rejected',()=>{
 assert.throws(()=>floydWarshall([[0,1],[1]]));
 assert.throws(()=>floydWarshall([[2]]));
});
