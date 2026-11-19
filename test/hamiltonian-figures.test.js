import test from 'node:test';import assert from 'node:assert/strict';
import{widgetEdges,widgetPath,isVertexCover,SOURCE_COVER,PRACTICE_COVERS,buildCoverToHamiltonian,coverWitness,verifyHamiltonian,SOURCE_TSP,PRACTICE_TSP,tourCost,tspOptimum}from '../site/visualizations/hamiltonian-figures-engine.js';
const key=(a,b)=>[a,b].sort().join(':');
test('Figure 34.16 precise 12-node gadget, four cross edges and allowed traversals',()=>{
 const edges=widgetEdges(),set=new Set(edges.map(([a,b])=>key(a,b)));
 assert.equal(edges.length,14);assert.equal(set.size,14);
 for(const side of ['L','R']){const full=widgetPath('e0',side,true),half=widgetPath('e0',side,false);
 assert.equal(full.length,12);assert.equal(new Set(full).size,12);assert.equal(half.length,6);
 for(const path of [full,half])for(let i=1;i<path.length;i++)assert.ok(set.has(key(path[i-1],path[i])),'Invalid gadget traversal '+path[i-1]+' -> '+path[i]);}
});
test('Figure 34.17 source has four original edges, k=2, cover {w,y} and a 50-vertex cycle',()=>{
 assert.deepEqual(SOURCE_COVER.edges,[['w','x'],['x','y'],['w','y'],['w','z']]);
 assert.equal(isVertexCover(SOURCE_COVER.vertices,SOURCE_COVER.edges,['w','y']),true);
 const graph=buildCoverToHamiltonian(SOURCE_COVER),result=coverWitness(SOURCE_COVER,['w','y']);
 assert.equal(graph.vertexList.length,50);assert.equal(result.valid,true);
 assert.equal(result.cycle.length,51);assert.equal(result.cycle[0],result.cycle.at(-1));
 assert.equal(verifyHamiltonian(graph,result.cycle),true);
 assert.equal(coverWitness(SOURCE_COVER,['x','z']).valid,false);
});
test('all source k-subsets satisfy witness iff cover; two original practice graphs',()=>{
 const instances=[SOURCE_COVER,...PRACTICE_COVERS];
 for(const ins of instances){const n=ins.vertices.length,k=ins.k;
 for(let mask=0;mask<(1<<n);mask++){let chosen=ins.vertices.filter((_,i)=>mask&(1<<i));if(chosen.length!==k)continue;
 assert.equal(coverWitness(ins,chosen).valid,isVertexCover(ins.vertices,ins.edges,chosen),'Cover equivalence '+ins.name+' '+chosen);}
 assert.equal(coverWitness(ins,ins.cover).valid,true);}
});
test('Figure 34.18 exact 4-city weights, source minimum tour and two practice optima',()=>{
 assert.deepEqual(SOURCE_TSP.edges,[['u','v',4],['u','x',3],['x','w',5],['v','w',2],['u','w',1],['v','x',1]]);
 assert.equal(tourCost(SOURCE_TSP,['u','x','v','w']),7);
 assert.equal(tspOptimum(SOURCE_TSP).best.cost,7);
 assert.equal(tspOptimum(PRACTICE_TSP[0]).best.cost,10);
 assert.equal(tspOptimum(PRACTICE_TSP[1]).best.cost,6);
 assert.throws(()=>tourCost(SOURCE_TSP,['u','x','x','w']));
});
test('figure graph model rejects duplicate source edges',()=>{
 assert.throws(()=>buildCoverToHamiltonian({vertices:['a','b'],edges:[['a','b'],['b','a']],k:1}));
});
