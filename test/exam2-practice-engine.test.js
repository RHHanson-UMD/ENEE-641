import test from 'node:test';
import assert from 'node:assert/strict';
import {couponShortestPath,mstCutExplorer} from '../site/reviews/exam-2-practice-engine.js';

function bruteCoupon(vertices,edges,source,target){
 const adjacency=new Map(vertices.map(v=>[v,[]]));
 for(const [a,b,w] of edges)adjacency.get(a).push([b,w]);
 let best=Infinity;
 function walk(u,visited,sum,max){
  if(u===target){best=Math.min(best,sum-max);return;}
  for(const [v,w]of adjacency.get(u))if(!visited.has(v)){
   visited.add(v);walk(v,visited,sum+w,Math.max(max,w));visited.delete(v);
  }
 }
 walk(source,new Set([source]),0,0);
 return Number.isFinite(best)?best:null;
}
test('one-use coupon: optimum and path witness independently checked',()=>{
 const vertices=['s','a','b','t'],edges=[['s','a',3],['a','t',9],['s','b',8],['b','t',4],['a','b',1]];
 const r=couponShortestPath(vertices,edges,'s','t');
 assert.equal(r.cost,3);
 assert.deepEqual(r.path.map(e=>[e.from,e.to,e.waived]),[['s','a',false],['a','t',true]]);
 assert.equal(r.path.reduce((sum,e)=>sum+(e.waived?0:e.weight),0),r.cost);
 assert.equal(r.path.filter(e=>e.waived).length,1);
 assert.equal(r.distances.find(x=>x.vertex==='a').unused,3);
 assert.equal(r.distances.find(x=>x.vertex==='a').used,0);
});
test('one-use coupon agrees with independent exhaustive simple path oracle',()=>{
 let seed=5771;function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;}
 for(let trial=0;trial<60;trial++){
  const n=3+rand()%3,vertices=Array.from({length:n},(_,i)=>'v'+i),edges=[];
  for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(i!==j&&rand()%3!==0)edges.push([vertices[i],vertices[j],rand()%12]);
  const actual=couponShortestPath(vertices,edges,vertices[0],vertices.at(-1));
  assert.equal(actual.cost,bruteCoupon(vertices,edges,vertices[0],vertices.at(-1)),'trial '+trial);
  if(actual.cost!==null){
   assert.equal(actual.path.reduce((c,e)=>c+(e.waived?0:e.weight),0),actual.cost);
   assert.ok(actual.path.filter(e=>e.waived).length<=1);
  }
 }
});
test('coupon counterexamples: isolated target, zero cost, invalid negative edge',()=>{
 assert.equal(couponShortestPath(['s','t'],[],'s','t').cost,null);
 assert.equal(couponShortestPath(['s','t'],[['s','t',0]],'s','t').cost,0);
 assert.equal(couponShortestPath(['s'],[],'s','s').cost,0);
 assert.throws(()=>couponShortestPath(['s','t'],[['s','t',-1]],'s','t'),RangeError);
 assert.throws(()=>couponShortestPath(['s','t'],[['s','ghost',2]],'s','t'),RangeError);
});
test('MST original unique crossing example: minimum cost 6 and mandatory edge',()=>{
 const v=['a','b','c','d'],e=[['a','b',1],['a','c',4],['a','d',5],['b','c',2],['c','d',3],['b','d',6]];
 const r=mstCutExplorer(v,e,['a']);assert.equal(r.minimumCost,6);
 assert.deepEqual(r.minimumTrees,[[0,3,4]]);
 assert.deepEqual(r.lightEdges,[0]);assert.equal(r.uniqueLightEdgeInEveryMST,true);
});
test('MST equal weight square yields multiple minima and no unique cut edge',()=>{
 const v=['a','b','c','d'],e=[['a','b',1],['b','c',1],['c','d',1],['d','a',1],['a','c',3],['b','d',3]];
 const r=mstCutExplorer(v,e,['a']);assert.equal(r.minimumCost,3);
 assert.equal(r.minimumTrees.length,4);assert.equal(r.lightEdges.length,2);
 assert.equal(r.uniqueLightEdgeId,null);
});
test('MST theorem over all triangle weight combinations and proper cuts',()=>{
 const v=['a','b','c'],pairs=[['a','b'],['b','c'],['a','c']];
 for(let w1=0;w1<=3;w1++)for(let w2=0;w2<=3;w2++)for(let w3=0;w3<=3;w3++){
  const weights=[w1,w2,w3],e=pairs.map(([a,b],i)=>[a,b,weights[i]]);
  for(const cut of [['a'],['b'],['c'],['a','b']]){
   const r=mstCutExplorer(v,e,cut);
   assert.equal(r.minimumCost,weights.slice().sort((a,b)=>a-b).slice(0,2).reduce((a,b)=>a+b,0));
   if(r.uniqueLightEdgeId!==null)assert.equal(r.uniqueLightEdgeInEveryMST,true);
  }
 }
});
test('MST disconnected and invalid graph models',()=>{
 const r=mstCutExplorer(['a','b','c','d'],[['a','b',2],['c','d',1]],['a','b']);
 assert.equal(r.connected,false);assert.equal(r.minimumCost,null);
 assert.throws(()=>mstCutExplorer(['a','b'],[['a','b',1],['b','a',2]],['a']),RangeError);
 assert.throws(()=>mstCutExplorer(['a','b'],[['a','b',1]],['a','b']),RangeError);
});
