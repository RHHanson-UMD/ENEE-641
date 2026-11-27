import test from 'node:test';import assert from 'node:assert/strict';
import {reliablePath,logarithmicWeights} from '../site/visualizations/path-reliability-engine.js';
function brute(vertices,edges,s,t){
 const adj=new Map(vertices.map(v=>[v,[]]));for(const [u,v,p]of edges)adj.get(u).push([v,p]);
 let best=-1,path=[];function go(u,seen,product,walk){
  if(u===t){if(product>best){best=product;path=walk.slice();}return;}
  for(const[v,p]of adj.get(u))if(!seen.has(v)){seen.add(v);go(v,seen,product*p,[...walk,v]);seen.delete(v);}
 }
 go(s,new Set([s]),1,[s]);return {value:best<0?null:best,path};
}
test('independent original example and selected walk product',()=>{
 const v=['a','b','c','d'],e=[['a','b',.8],['b','d',.8],['a','c',.9],['c','d',.6],['b','c',.95]];
 const r=reliablePath(v,e,'a','d');
 assert.ok(Math.abs(r.reliability-.64)<1e-12);assert.deepEqual(r.path,['a','b','d']);
 assert.equal(r.trace[0].reliability,1);assert.ok(r.trace.every(x=>x.reliability>0));
});
test('matches independent exhaustive simple path search with cycles and random edges',()=>{
 let seed=11024;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
 for(let trial=0;trial<110;trial++){
  const n=2+rnd()%5,verts=Array.from({length:n},(_,i)=>'v'+i),edges=[];
  for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(i!==j&&rnd()%4!==0)edges.push([verts[i],verts[j],(rnd()%11)/10]);
  const oracle=brute(verts,edges,verts[0],verts[n-1]),actual=reliablePath(verts,edges,verts[0],verts[n-1]);
  assert.equal(actual.reachable,oracle.value!==null,'reachability trial '+trial);
  if(oracle.value!==null){assert.ok(Math.abs(actual.reliability-oracle.value)<1e-10,'cost trial '+trial);let prod=1;for(const edge of actual.edges)prod*=edge.reliability;assert.ok(Math.abs(prod-actual.reliability)<1e-10);}
 }
});
test('zero-probability feasible walk differs from unreachable destination',()=>{
 const zero=reliablePath(['s','a','t'],[['s','a',.7],['a','t',0]],'s','t');
 assert.equal(zero.reachable,true);assert.equal(zero.reliability,0);assert.deepEqual(zero.path,['s','a','t']);
 assert.equal(reliablePath(['s','t'],[],'s','t').reachable,false);
 assert.equal(reliablePath(['s','t'],[],'s','s').reliability,1);
});
test('log transform nonnegative for positive probabilities and correctly handles zero',()=>{
 let e=logarithmicWeights([['a','b',1],['b','c',.5],['a','c',0]]);
 assert.equal(e[0][2],0);assert.ok(Math.abs(e[1][2]-Math.log(2))<1e-12);assert.equal(e[2][2],Infinity);
 assert.throws(()=>logarithmicWeights([['a','b',1.2]]));assert.throws(()=>reliablePath(['a','b'],[['a','b',-1]],'a','b'));
});
