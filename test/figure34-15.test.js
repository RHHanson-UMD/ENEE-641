import test from 'node:test';
import assert from 'node:assert/strict';
import {figureGraphs,validateUndirected,complementEdges,analyzeComplementCover,findClique,isClique} from '../site/visualizations/figure34-15-engine.js';

test('Figure 34.15: source clique and complementary cover match slide 31',()=>{
 const g=figureGraphs.source,result=analyzeComplementCover(g,g.initialClique);
 assert.equal(g.id,'clrs-34-15');
 assert.deepEqual(g.labels,['u','v','w','x','y','z']);
 assert.equal(g.edges.length,10);
 assert.deepEqual(g.initialClique,[0,1,3,4]);
 assert.deepEqual(result.coverVertices,[2,5]);
 assert.equal(result.clique,true);assert.equal(result.cover,true);
 assert.equal(result.cliqueSize,4);assert.equal(result.coverSize,2);
 assert.deepEqual(complementEdges(g),[[0,2],[1,2],[1,5],[2,3],[4,5]]);
});

test('Figure 34.15 reduction equivalence for all 2^6 candidate subsets',()=>{
 const g=figureGraphs.source,n=g.labels.length;
 for(let mask=0;mask<(1<<n);mask++){
  const chosen=Array.from({length:n},(_,i)=>i).filter(i=>mask&(1<<i));
  const r=analyzeComplementCover(g,chosen);
  assert.equal(r.clique,r.cover,JSON.stringify(chosen));
  assert.equal(r.cliqueSize+r.coverSize,n);
 }
});

test('practice examples have different clique sizes and keep equivalence',()=>{
 for(const [id,expected] of [['pendant',3],['cycle',2]]){
  const g=figureGraphs[id],r=analyzeComplementCover(g,g.initialClique);
  assert.equal(validateUndirected(g),true);
  assert.equal(r.clique,true);assert.equal(r.cover,true);
  assert.equal(findClique(g,expected)?.length,expected);
  assert.equal(findClique(g,expected+1),null);
 }
});

test('bad clique selection exposes uncovered complement edge',()=>{
 const g=figureGraphs.source,r=analyzeComplementCover(g,[0,1,2,3]);
 assert.equal(r.clique,false);assert.equal(r.cover,false);
});

test('graph validation catches duplicates, self-loops, missing endpoints',()=>{
 const labels=['a','b','c'],positions=[[0,0],[1,0],[2,0]];
 assert.throws(()=>validateUndirected({labels,positions,edges:[[0,1],[1,0]]}),/Duplicate/);
 assert.throws(()=>validateUndirected({labels,positions,edges:[[0,0]]}),/Invalid edge/);
 assert.throws(()=>validateUndirected({labels,positions,edges:[[0,3]]}),/Invalid edge/);
});
