import test from 'node:test';
import assert from 'node:assert/strict';
import {clauses,formulaSatisfied,reductionGraph,findClique,isClique,complementGraph,isVertexCover,selectedCompatible,enumerateAssignments} from '../site/visualizations/reduction-engine.js';
test('positive example: clique and complement cover are witnesses',()=>{
 const g=reductionGraph(clauses),k=g.k,clique=findClique(g,k),cg=complementGraph(g);
 assert.equal(g.vertices.length,9);assert.equal(k,3);assert.ok(clique);
 assert.ok(isClique(g.vertices,g.edges,clique));
 const cover=g.vertices.map((_,i)=>i).filter(i=>!clique.includes(i));
 assert.equal(cover.length,6);assert.ok(isVertexCover(cg,cover));
});
test('SAT assignment yields a 3-clique, including negative assignments',()=>{
 const g=reductionGraph(clauses);
 for(const assignment of enumerateAssignments(3)){
  const s=formulaSatisfied(clauses,assignment),selected=selectedCompatible(g,assignment);
  if(s){assert.equal(selected.length,3);assert.ok(isClique(g.vertices,g.edges,selected));}
  else assert.equal(selected.length,0);
 }
});
test('unsatisfiable example: contradiction has no clique of clause count',()=>{
 const impossible=[[{variable:0,positive:true}],[{variable:0,positive:false}]];
 const g=reductionGraph(impossible);
 assert.equal(findClique(g,2),null);
 assert.ok(enumerateAssignments(1).every(x=>!formulaSatisfied(impossible,x)));
});
test('clique/complement cover equivalence for every 3-vertex subset',()=>{
 const g=reductionGraph(clauses),cg=complementGraph(g),n=g.vertices.length;
 for(let a=0;a<n;a++)for(let b=a+1;b<n;b++)for(let c=b+1;c<n;c++){
  const clique=[a,b,c],cover=Array.from({length:n},(_,i)=>i).filter(i=>!clique.includes(i));
  assert.equal(isClique(g.vertices,g.edges,clique),isVertexCover(cg,cover));
 }
});
