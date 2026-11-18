import test from 'node:test';
import assert from 'node:assert/strict';
import {graphs,bfs,topologicalPeel,validTopologicalOrder} from '../site/visualizations/graph-traversal-engine.js';
test('BFS: independently derived hop distances and unreachable vertex',()=>{
 const g=graphs.bfs,r=bfs(g.n,g.edges,0);
 assert.deepEqual(r.dist,[0,1,1,2,2,3,Infinity]);
 assert.deepEqual(r.order,[0,1,2,3,4,5]);
 assert.equal(r.states[0].queue[0],0);
});
test('BFS: source changes distances and initial state',()=>{
 const g=graphs.bfs,r=bfs(g.n,g.edges,5);
 assert.equal(r.dist[5],0);assert.equal(r.dist[0],3);
 assert.equal(r.dist[6],Infinity);
});
test('topological DAG: every precedence relation is respected',()=>{
 const g=graphs.topo,r=topologicalPeel(g.n,g.edges);
 assert.equal(r.hasCycle,false);assert.deepEqual(r.order,[0,1,2,3,4,5]);
 assert.ok(validTopologicalOrder(g.n,g.edges,r.order));
});
test('topological sort detects a directed cycle',()=>{
 const edges=[[0,1],[1,2],[2,0]],r=topologicalPeel(3,edges);
 assert.equal(r.hasCycle,true);assert.equal(r.order.length,0);
 assert.equal(validTopologicalOrder(3,edges,r.order),false);
});
test('zero edge graph: all vertices are valid topological order',()=>{
 const r=topologicalPeel(3,[]);
 assert.equal(r.hasCycle,false);assert.deepEqual(r.order,[0,1,2]);
});
test('invalid edges and BFS source rejected',()=>{
 assert.throws(()=>bfs(2,[[0,2]],0));
 assert.throws(()=>topologicalPeel(2,[[0,0]]));
 assert.throws(()=>bfs(2,[],2));
});
