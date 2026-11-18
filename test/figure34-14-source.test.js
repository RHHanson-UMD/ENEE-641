import test from 'node:test';
import assert from 'node:assert/strict';
import {formulaExamples,formulaSatisfied,reductionGraph,selectedCompatible,findClique,isClique,enumerateAssignments,complementGraph,isVertexCover} from '../site/visualizations/reduction-engine.js';

test('Figure 34.14: exact source clauses from slide 29, witness and assignment',()=>{
 const source=formulaExamples.source,graph=reductionGraph(source.clauses);
 assert.equal(source.id,'clrs-34-14');
 assert.deepEqual(source.assignment,[0,0,1]);
 assert.deepEqual(source.clauses.map(c=>c.map(l=>[l.variable,l.positive])),[
  [[0,true],[1,false],[2,false]],
  [[0,false],[1,true],[2,true]],
  [[0,true],[1,true],[2,true]]
 ]);
 assert.equal(formulaSatisfied(source.clauses,source.assignment),true);
 const witness=selectedCompatible(graph,source.assignment,source.preferredLiteralIndices);
 assert.deepEqual(witness,[1,5,8]);
 assert.ok(isClique(graph.vertices,graph.edges,witness));
 assert.deepEqual(witness.map(i=>graph.vertices[i].id),['0:1','1:2','2:2']);
});

test('all three examples satisfy SAT iff their reduction graph has a clique',()=>{
 for(const example of Object.values(formulaExamples)){
  const graph=reductionGraph(example.clauses);
  const exists=Boolean(findClique(graph,3));
  const assignments=enumerateAssignments(3);
  assert.equal(exists,assignments.some(a=>formulaSatisfied(example.clauses,a)));
  for(const assignment of assignments){
   const selected=selectedCompatible(graph,assignment,example.preferredLiteralIndices);
   if(formulaSatisfied(example.clauses,assignment)){
    assert.equal(selected.length,3);
    assert.ok(isClique(graph.vertices,graph.edges,selected));
   }else assert.deepEqual(selected,[]);
  }
 }
});

test('independent UNSAT practice instance has no clique or complement cover of size 6',()=>{
 const graph=reductionGraph(formulaExamples.impossible.clauses);
 assert.equal(findClique(graph,3),null);
 assert.ok(enumerateAssignments(3).every(a=>!formulaSatisfied(formulaExamples.impossible.clauses,a)));
 const complement=complementGraph(graph);
 // No size-6 vertex cover in complement, equivalent to no 3-clique in G.
 for(let i=0;i<9;i++)for(let j=i+1;j<9;j++)for(let k=j+1;k<9;k++){
  const chosen=new Set([i,j,k]);
  const cover=Array.from({length:9},(_,v)=>v).filter(v=>!chosen.has(v));
  assert.equal(isVertexCover(complement,cover),false);
 }
});

test('source example labels do not misstate the Figure 34.15 complement data',()=>{
 assert.equal(formulaExamples.source.id,'clrs-34-14');
 assert.ok(!Object.keys(formulaExamples).includes('clrs-34-15'));
});
