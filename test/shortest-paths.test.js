import test from 'node:test';
import assert from 'node:assert/strict';
import {samples,bellmanFord,dijkstra,tracePath} from '../site/visualizations/shortest-paths-engine.js';
test('nonnegative graph: Bellman–Ford and Dijkstra agree with known distances',()=>{
 const {n,edges}=samples.nonnegative;
 const b=bellmanFord(n,edges),d=dijkstra(n,edges);
 assert.deepEqual(b.steps.at(-1).d,[0,3,2,8,10]);
 assert.deepEqual(d.steps.at(-1).d,[0,3,2,8,10]);
 assert.equal(b.negativeCycleReachable,false);
 assert.deepEqual(tracePath(d.steps.at(-1).parent,0,4),[0,2,1,3,4]);
});
test('negative edge, no negative cycle: Bellman–Ford yields correct shortest distances',()=>{
 const {n,edges}=samples.negative,b=bellmanFord(n,edges);
 assert.deepEqual(b.steps.at(-1).d,[0,-1,2,4,6]);
 assert.equal(b.negativeCycleReachable,false);
 assert.throws(()=>dijkstra(n,edges),/nonnegative/);
});
test('reachable negative cycle detected after |V|-1 rounds',()=>{
 const {n,edges}=samples.negativeCycle,b=bellmanFord(n,edges);
 assert.equal(b.negativeCycleReachable,true);
 assert.ok(b.steps.at(-1).violating.length>0);
});
test('unreachable negative cycle does not affect source',()=>{
 const b=bellmanFord(4,[[0,1,2],[2,3,-3],[3,2,1]]);
 assert.equal(b.negativeCycleReachable,false);
 assert.deepEqual(b.steps.at(-1).d,[0,2,Infinity,Infinity]);
});
test('single vertex and empty graph',()=>{
 assert.deepEqual(bellmanFord(1,[]).steps.at(-1).d,[0]);
 assert.deepEqual(dijkstra(1,[]).steps.at(-1).d,[0]);
});
test('rejects invalid graphs',()=>{
 assert.throws(()=>bellmanFord(2,[[0,2,1]]));
 assert.throws(()=>dijkstra(2,[[0,1,-1]]));
});
