import test from 'node:test';import assert from 'node:assert/strict';
import{blockEquation,blockProductTrace,weightStationaryTrace,HISTORICAL_ENERGY_90NM,historicalRatio}from '../site/visualizations/gpu-slide-figures-engine.js';
test('slide 3 four exact block equations and eight source terms',()=>{
 const terms=[['XA','YA','XB','YC'],['XA','YB','XB','YD'],['XC','YA','XD','YC'],['XC','YB','XD','YD']];
 for(let i=0;i<4;i++){const q=blockEquation(i);assert.deepEqual(q.terms.flatMap(t=>[t.x,t.y]),terms[i]);}
 assert.throws(()=>blockEquation(4));});
test('slide 3 independently checks numeric 2x2 block values',()=>{
 let s=9;const rand=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s%9-4;};
 for(let i=0;i<100;i++){
  const X=Array.from({length:2},()=>[rand(),rand()]),Y=Array.from({length:2},()=>[rand(),rand()]);
  const r=blockProductTrace(X,Y),expected=X.map(row=>Y[0].map((_,j)=>row[0]*Y[0][j]+row[1]*Y[1][j]));
  assert.deepEqual(r.Z,expected);assert.equal(r.traces.length,4);assert.equal(r.blockMultiplications,8);
 }
 assert.throws(()=>blockProductTrace([[1,2]],[[1,2],[3,4]]));});
test('source slide 8/9 uses weight-stationary 2x3 data with staggered input',()=>{
 const r=weightStationaryTrace([[2,-1,3],[0,4,1]],[5,6,-2]);
 assert.deepEqual(r.outputs,[-2,22]);
 assert.deepEqual(r.ticks.map(t=>t.active.length),[1,2,2,1]);
 assert.deepEqual(r.ticks[2].completed,[{row:0,value:-2}]);
 assert.deepEqual(r.ticks[3].completed,[{row:1,value:22}]);
 assert.equal(r.ticks.flatMap(t=>t.active).length,6);
});
test('independent serial dot-product oracle validates varied signed weights',()=>{
 let state=17;const rnd=()=>{state=(Math.imul(state,22695477)+1)>>>0;return state%11-5};
 for(let i=0;i<100;i++){
  const W=Array.from({length:2},()=>[rnd(),rnd(),rnd()]),x=[rnd(),rnd(),rnd()];
  const r=weightStationaryTrace(W,x);
  assert.deepEqual(r.outputs,W.map(row=>row.reduce((sum,w,j)=>sum+w*x[j],0)));
  assert.equal(r.ticks.length,4);
 }
 assert.throws(()=>weightStationaryTrace([[1,2,3]], [1,2,3]));
});
test('slide 6 historical energy bands and strictly historical interpretation',()=>{
 assert.equal(HISTORICAL_ENERGY_90NM.length,5);
 assert.deepEqual([historicalRatio(0,3).min,historicalRatio(0,3).max],[125/7,125/7]);
 assert.equal(historicalRatio(3,4).min,14);assert.equal(historicalRatio(3,4).max,35);
 assert.throws(()=>historicalRatio(0,20));
});
