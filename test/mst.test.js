import test from 'node:test';
import assert from 'node:assert/strict';
import {graphs,kruskal,prim,exactMstCost} from '../site/visualizations/mst-engine.js';
for(const [name,g,expected] of [['weighted',graphs.weighted,13],['tied',graphs.tied,3],['bridge',graphs.bridge,11]]){
 test(name+': two greedy algorithms equal independent exact minimum',()=>{
  const oracle=exactMstCost(g.n,g.edges),k=kruskal(g.n,g.edges),p=prim(g.n,g.edges);
  assert.equal(oracle,expected);assert.equal(k.cost,expected);assert.equal(p.cost,expected);
  assert.equal(k.chosen.length,g.n-1);assert.equal(p.chosen.length,g.n-1);
  assert.equal(k.connected,true);assert.equal(p.connected,true);
 });
}
test('Kruskal rejects a cycle edge',()=>{
 const r=kruskal(graphs.tied.n,graphs.tied.edges);
 assert.ok(r.steps.some(s=>!s.accepted));
});
test('negative edge weights are allowed in MST',()=>{
 const edges=[[0,1,-5],[1,2,1],[0,2,3]];
 assert.equal(kruskal(3,edges).cost,-4);
 assert.equal(prim(3,edges).cost,-4);
 assert.equal(exactMstCost(3,edges),-4);
});
test('disconnected graph returns incomplete forest and infinite exact spanning cost',()=>{
 const edges=[[0,1,1],[2,3,2]];
 assert.equal(kruskal(4,edges).connected,false);
 assert.equal(prim(4,edges).connected,false);
 assert.equal(exactMstCost(4,edges),Infinity);
});
test('reject self loops and duplicate undirected arcs',()=>{
 assert.throws(()=>kruskal(3,[[0,0,1]]));
 assert.throws(()=>prim(3,[[0,1,1],[1,0,1]]));
});
