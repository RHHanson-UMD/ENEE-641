/**
 * Original mathematical reconstruction of lecture Chapter34Nov5-2026:
 * CLRS 2nd-edition Figs 34.16 (slide 33), 34.17 (slide 34), 34.18 (slide 36).
 * No copyrighted original artwork; all drawing coordinates supplied by caller.
 */
const edgeKey=(a,b)=>a<b?a+'|'+b:b+'|'+a;
const v=(id,side,i)=>id+':'+side+i;
export function widgetEdges(id='e0'){
 const e=[];for(const side of ['L','R'])for(let i=1;i<6;i++)e.push([v(id,side,i),v(id,side,i+1)]);
 for(const [a,b]of [['L1','R3'],['L3','R1'],['L4','R6'],['L6','R4']])e.push([id+':'+a,id+':'+b]);
 return e;
}
export function widgetPath(id='e0',start='L',full=true){
 if(!['L','R'].includes(start))throw new RangeError('Start on L or R');
 const opposite=start==='L'?'R':'L',nodes=[];
 if(!full){for(let i=1;i<=6;i++)nodes.push(v(id,start,i));return nodes;}
 for(let i=1;i<=3;i++)nodes.push(v(id,start,i));
 for(let i=1;i<=6;i++)nodes.push(v(id,opposite,i));
 for(let i=4;i<=6;i++)nodes.push(v(id,start,i));
 return nodes;
}
export function isVertexCover(vertices,edges,chosen){
 const set=new Set(chosen);return [...set].every(x=>vertices.includes(x))&&edges.every(([u,v])=>set.has(u)||set.has(v));
}
export const SOURCE_COVER={vertices:['w','x','y','z'],edges:[['w','x'],['x','y'],['w','y'],['w','z']],cover:['w','y'],k:2,figure:'Figure 34.17',slide:34};
export const PRACTICE_COVERS=[
 {vertices:['a','b','c','d'],edges:[['a','b'],['b','c'],['c','d']],cover:['b','c'],k:2,name:'Path of four vertices'},
 {vertices:['a','b','c'],edges:[['a','b'],['b','c'],['a','c']],cover:['a','b'],k:2,name:'Triangle graph'}
];
export function buildCoverToHamiltonian({vertices,edges,k}){
 if(!Array.isArray(vertices)||new Set(vertices).size!==vertices.length||vertices.length<2||!Array.isArray(edges)||!Number.isInteger(k)||k<1||k>vertices.length)throw new RangeError('Invalid graph or selector count');
 const seen=new Set();edges.forEach(([u,w])=>{if(!vertices.includes(u)||!vertices.includes(w)||u===w||seen.has(edgeKey(u,w)))throw new RangeError('Invalid/duplicate edge');seen.add(edgeKey(u,w));});
 const vertexList=[],allEdges=[],groups=new Map();
 for(let i=0;i<edges.length;i++){
  const id='e'+i;for(const side of ['L','R'])for(let p=1;p<=6;p++)vertexList.push(v(id,side,p));
  allEdges.push(...widgetEdges(id));
 }
 const ends=(i,u)=>{const side=edges[i][0]===u?'L':'R';return [v('e'+i,side,1),v('e'+i,side,6)];};
 for(const u of vertices){const ids=[];edges.forEach((e,i)=>{if(e.includes(u))ids.push(i);});groups.set(u,ids);
  for(let i=0;i+1<ids.length;i++)allEdges.push([ends(ids[i],u)[1],ends(ids[i+1],u)[0]]);
 }
 for(let i=1;i<=k;i++){const selector='s'+i;vertexList.push(selector);for(const u of vertices){const ids=groups.get(u);if(!ids.length)continue;allEdges.push([selector,ends(ids[0],u)[0]],[selector,ends(ids.at(-1),u)[1]]);}}
 return {vertexList,edges:allEdges,groups,ends};
}
export function coverWitness(instance,selection){
 const {vertices,edges,k}=instance;const chosen=[...selection];if(chosen.length!==k||new Set(chosen).size!==k||!isVertexCover(vertices,edges,chosen))return {valid:false,reason:'Choose exactly k distinct covering vertices',cycle:[]};
 const reduction=buildCoverToHamiltonian(instance),picked=new Set(chosen),cycle=['s1'];
 for(let i=0;i<chosen.length;i++){
  const u=chosen[i],ids=reduction.groups.get(u);for(const id of ids){
   const side=edges[id][0]===u?'L':'R',other=edges[id][0]===u?edges[id][1]:edges[id][0];
   cycle.push(...widgetPath('e'+id,side,!picked.has(other)));
  }
  cycle.push('s'+(i===chosen.length-1?1:i+2));
 }
 return {valid:verifyHamiltonian(reduction,cycle),cycle,reduction};
}
export function verifyHamiltonian(graph,cycle){
 if(!Array.isArray(cycle)||cycle.length!==graph.vertexList.length+1||cycle[0]!==cycle.at(-1))return false;
 const set=new Set(cycle.slice(0,-1));if(set.size!==graph.vertexList.length||graph.vertexList.some(x=>!set.has(x)))return false;
 const e=new Set(graph.edges.map(([u,v])=>edgeKey(u,v)));
 return cycle.slice(1).every((p,i)=>e.has(edgeKey(cycle[i],p)));
}
export const SOURCE_TSP={labels:['u','v','w','x'],edges:[['u','v',4],['u','x',3],['x','w',5],['v','w',2],['u','w',1],['v','x',1]],expectedOptimum:7,figure:'Figure 34.18',slide:36};
export const PRACTICE_TSP=[
 {labels:['a','b','c','d'],edges:[['a','b',2],['b','c',3],['c','d',2],['d','a',3],['a','c',5],['b','d',5]],name:'Square with costly diagonals'},
 {labels:['a','b','c','d'],edges:[['a','b',1],['b','c',1],['c','d',1],['d','a',10],['a','c',2],['b','d',2]],name:'Uneven complete graph'}
];
export function tourCost(example,order){
 const labels=example.labels;if(!Array.isArray(order)||order.length!==labels.length||new Set(order).size!==labels.length||order.some(x=>!labels.includes(x)))throw new RangeError('Visit every city once');
 const weights=new Map(example.edges.map(([u,v,w])=>[edgeKey(u,v),w]));let cost=0;
 for(let i=0;i<order.length;i++){const weight=weights.get(edgeKey(order[i],order[(i+1)%order.length]));if(weight===undefined)throw new RangeError('Incomplete travel cost graph');cost+=weight;}
 return cost;
}
export function tspOptimum(example){
 const [start,...others]=example.labels;const all=[];
 function gen(prefix,unused){if(!unused.length){all.push({order:[start,...prefix],cost:tourCost(example,[start,...prefix])});return;}for(let i=0;i<unused.length;i++)gen([...prefix,unused[i]],[...unused.slice(0,i),...unused.slice(i+1)]);}
 gen([],others);all.sort((x,y)=>x.cost-y.cost);return {best:all[0],tours:all};
}
