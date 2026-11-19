import test from 'node:test';import assert from 'node:assert/strict';import {analyzeUndirected,analyzeDirectedDFS} from '../site/visualizations/graph-structure-engine.js';
const comps=(n,edges,removedVertex=null,removedEdge=null)=>{const used=Array(n).fill(false);let total=0;for(let u=0;u<n;u++){if(u===removedVertex||used[u])continue;total++;let q=[u];used[u]=true;for(let i=0;i<q.length;i++)for(let id=0;id<edges.length;id++){if(id===removedEdge)continue;const [a,b]=edges[id],v=a===q[i]?b:b===q[i]?a:-1;if(v<0||v===removedVertex||used[v])continue;used[v]=true;q.push(v);}}return total;};
test('triangle with a two-edge tail: correct low-link articulation and bridge oracle',()=>{
 const e=[[0,1],[1,2],[2,0],[2,3],[3,4]],r=analyzeUndirected(5,e);
 assert.deepEqual(r.articulation,[2,3]);assert.deepEqual(r.bridgeIds,[3,4]);assert.equal(r.euler,null);assert.equal(r.biconnectedEdgeComponents.length,3);
});
test('bowtie graph has articulation but no bridges and admits Euler tour',()=>{
 const e=[[0,1],[1,2],[2,0],[2,3],[3,4],[4,2]],r=analyzeUndirected(5,e);
 assert.deepEqual(r.articulation,[2]);assert.deepEqual(r.bridgeIds,[]);assert.equal(r.euler.length,e.length+1);assert.equal(r.euler[0],r.euler.at(-1));assert.equal(r.biconnectedEdgeComponents.length,2);
});
test('simple graph oracle exhaustively verifies articulation and bridges up to 4 vertices',()=>{
 for(let n=1;n<=4;n++){const pairs=[];for(let u=0;u<n;u++)for(let v=u+1;v<n;v++)pairs.push([u,v]);
 for(let mask=0;mask<(1<<pairs.length);mask++){const edges=pairs.filter((_,i)=>mask&(1<<i)),r=analyzeUndirected(n,edges),base=comps(n,edges);
 const expectedArt=[];for(let v=0;v<n;v++)if(comps(n,edges,v)>base)expectedArt.push(v);
 const expectedBr=[];for(let i=0;i<edges.length;i++)if(comps(n,edges,null,i)>base)expectedBr.push(i);
 assert.deepEqual(r.articulation,expectedArt);assert.deepEqual(r.bridgeIds,expectedBr);}}
});
test('Euler tour uses each undirected edge exactly once',()=>{
 const e=[[0,1],[1,2],[2,3],[3,0]],r=analyzeUndirected(4,e);
 const used=[];for(let i=1;i<r.euler.length;i++){let a=r.euler[i-1],b=r.euler[i];let j=e.findIndex(([u,v])=>(u===a&&v===b)||(u===b&&v===a));assert.ok(j>=0);used.push(j);}
 assert.deepEqual(used.slice().sort((a,b)=>a-b),[0,1,2,3]);assert.equal(r.euler.at(-1),r.euler[0]);
});
test('disconnected nonzero-degree graph has no Euler tour',()=>{
 let r=analyzeUndirected(6,[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]]);
 assert.equal(r.connectedNonisolated,false);assert.equal(r.euler,null);
 assert.throws(()=>analyzeUndirected(3,[[0,1],[1,0]]));});
test('directed DFS classifies back edge on a directed cycle',()=>{
 const a=analyzeDirectedDFS(3,[[0,1],[1,2],[2,0]]);assert.equal(a.hasCycle,true);assert.ok(a.edgeTypes.includes('back'));
 const b=analyzeDirectedDFS(3,[[0,1],[1,2]]);assert.equal(b.hasCycle,false);assert.deepEqual(b.edgeTypes,['tree','tree']);
});
