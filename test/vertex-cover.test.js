import test from 'node:test';
import assert from 'node:assert/strict';
import {approxVertexCover,optimumCover,isCover,validateGraph} from '../site/visualizations/vertex-cover-engine.js';
const cases=[
  ['path',5,[[0,1],[1,2],[2,3],[3,4]],2],
  ['triangle',3,[[0,1],[1,2],[0,2]],2],
  ['star',5,[[0,1],[0,2],[0,3],[0,4]],1],
  ['even cycle',6,[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],3],
  ['edgeless',3,[],0]
];
for(const [name,n,edges,expected] of cases) test(name+' independent optimum and 2-approx bound',()=>{
  const opt=optimumCover(n,edges),out=approxVertexCover(n,edges);
  assert.equal(opt.length,expected);
  assert.equal(isCover(n,edges,out.cover),true);
  assert.ok(out.cover.length<=2*expected);
  assert.equal(out.cover.length,2*out.matching.length);
  assert.equal(new Set(out.matching.flatMap(i=>edges[i])).size,2*out.matching.length);
});
test('changing tie break still returns valid cover',()=>{
const edges=[[0,1],[1,2],[2,3],[3,4]];
for(let first=0;first<edges.length;first++){
 const order=[first,...edges.map((_,i)=>i).filter(i=>i!==first)];
 const out=approxVertexCover(5,edges,order);
 assert.ok(isCover(5,edges,out.cover));
 assert.ok(out.cover.length<=4);
}
});
test('invalid self loop rejected',()=>assert.throws(()=>validateGraph(2,[[0,0]])));
