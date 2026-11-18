import test from 'node:test';
import assert from 'node:assert/strict';
import {scenarios,validateDAG,reductionPath,reductionSteps} from '../site/visualizations/reductions-map-engine.js';

test('CLRS Figure 34.13 contains the eight textbook problems and seven directed reductions',()=>{
 const graph=scenarios.source;
 assert.equal(graph.id,'clrs-34-13');
 assert.equal(graph.nodes.length,8);
 assert.deepEqual(graph.edges,[
  ['circuit','sat'],['sat','cnf'],['cnf','clique'],
  ['clique','cover'],['cover','ham'],['ham','tsp'],['cnf','subset']
 ]);
 assert.equal(validateDAG(graph),true);
});

test('source graph traces both required branches from CIRCUIT-SAT',()=>{
 const graph=scenarios.source;
 const tspPath=reductionPath(graph,'circuit','tsp');
 assert.deepEqual(tspPath,['circuit','sat','cnf','clique','cover','ham','tsp']);
 assert.deepEqual(reductionPath(graph,'circuit','subset'),['circuit','sat','cnf','subset']);
 assert.equal(reductionSteps(tspPath).length,6);
 assert.deepEqual(reductionSteps(tspPath)[0],{from:'circuit',to:'sat',index:1});
});

test('reduction direction matters: subset sum does not reduce to TSP on this source map',()=>{
 assert.deepEqual(reductionPath(scenarios.source,'subset','tsp'),[]);
 assert.deepEqual(reductionPath(scenarios.source,'tsp','circuit'),[]);
 assert.deepEqual(reductionPath(scenarios.source,'clique','clique'),['clique']);
});

test('two original practice DAGs are valid and trace expected paths',()=>{
 for(const id of ['chain','fork'])assert.equal(validateDAG(scenarios[id]),true);
 assert.deepEqual(reductionPath(scenarios.chain,'A','D'),['A','B','C','D']);
 assert.deepEqual(reductionPath(scenarios.fork,'P','T'),['P','Q','S','T']);
 assert.deepEqual(reductionPath(scenarios.fork,'R','Q'),[]);
});

test('rejects cycles, unknown nodes, and duplicate directed edges',()=>{
 const nodes=[{id:'A'},{id:'B'},{id:'C'}];
 assert.throws(()=>validateDAG({nodes,edges:[['A','B'],['B','C'],['C','A']]}),/cycle/);
 assert.throws(()=>validateDAG({nodes,edges:[['A','B'],['A','B']]}),/Duplicate/);
 assert.throws(()=>validateDAG({nodes,edges:[['A','X']]}),/Invalid directed edge/);
 assert.throws(()=>reductionPath(scenarios.source,'circuit','UNKNOWN'),/Unknown/);
});
