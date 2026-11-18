import test from 'node:test';
import assert from 'node:assert/strict';
import {vertexCoverFigure351 as vc,tspFigure352 as tsp,setCoverFigure353 as sc,subsetSumLecture as ss,trimLecture as tl} from '../site/visualizations/ch35-figure-seeds.js';
import {approxVertexCover,optimumCover,isCover} from '../site/visualizations/vertex-cover-engine.js';
import {metricTsp,setCover,trim,exactSubsetSum,approxSubsetSum} from '../site/visualizations/approximation-engine.js';

test('Figure 35.1: exact source edges, selected matching and 2-vs-3 counts',()=>{
  assert.equal(vc.figure,'Figure 35.1');
  assert.equal(vc.edges.length,8);
  const result=approxVertexCover(vc.n,vc.edges);
  assert.equal(result.cover.length,vc.expectedCoverSize);
  assert.equal(optimumCover(vc.n,vc.edges).length,vc.expectedOptimumSize);
  assert.deepEqual(result.matching.map(i=>vc.edges[i]),vc.expectedMatching);
  assert.ok(isCover(vc.n,vc.edges,result.cover));
  assert.deepEqual(result.cover.map(i=>vc.labels[i]),['b','c','d','e','f','g']);
});

test('Figure 35.2: exact eight integer-grid points reproduce both printed costs',()=>{
  assert.equal(tsp.figure,'Figure 35.2');
  const result=metricTsp(tsp.points);
  assert.deepEqual(result.preorder,tsp.expectedPreorder);
  assert.ok(Math.abs(result.approxCost-tsp.expectedApproximateTourCost)<1e-9);
  assert.ok(Math.abs(result.optimum-tsp.expectedOptimumTourCost)<1e-9);
  assert.ok(result.approxCost<=2*result.optimum);
});

test('Figure 35.3: greedy S1,S4,S5,S3 and optimum S3,S4,S5',()=>{
  assert.equal(sc.figure,'Figure 35.3');
  assert.equal(sc.universe.length,12);
  const result=setCover(sc.universe,sc.sets,sc.preferredOrder);
  assert.deepEqual(result.selected,sc.expectedGreedy);
  assert.deepEqual(result.optimal,sc.expectedOptimum);
  assert.equal(result.ratio,4/3);
});

test('Source slide 14 TRIM list, source slide 15 FPTAS numerical seed',()=>{
  assert.deepEqual(trim(tl.values,tl.delta),tl.expected);
  assert.equal(exactSubsetSum(ss.values,ss.target),ss.expectedOptimum);
  const result=approxSubsetSum(ss.values,ss.target,ss.epsilon);
  assert.equal(result.delta,ss.expectedDelta);
  assert.ok(result.best<=ss.target);
  assert.ok(ss.expectedOptimum<=result.best*(1+ss.epsilon));
});

test('independent practice alternatives remain valid',()=>{
  for(const edges of [[[0,1],[1,2]],[[0,1],[1,2],[2,0]],[[0,1],[0,2],[0,3]]]){
    const n=Math.max(...edges.flat())+1,out=approxVertexCover(n,edges);
    assert.ok(isCover(n,edges,out.cover));
    assert.ok(out.cover.length<=2*optimumCover(n,edges).length);
  }
  for(const points of [
    [[0,0],[2,0],[2,2],[0,2]],
    [[0,0],[1,2],[4,3],[8,2],[9,4]],
    [[0,0],[1,0],[2,0],[3,0]]
  ]){
    const r=metricTsp(points);assert.ok(r.approxCost<=2*r.optimum+1e-8);
  }
});

test('invalid set-cover tie preference rejected',()=>{
 assert.throws(()=>setCover([1,2],[[1],[2]],[0,0]),/tie-breaking/);
});
