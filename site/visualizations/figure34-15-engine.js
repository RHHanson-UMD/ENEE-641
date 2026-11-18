/**
 * CLRS 2nd ed. Figure 34.15, verified visually in the owner's
 * ENEE 641 Chapter34Nov5-2026.pptx, slide 31.
 * Graph structures only; all SVG drawing is independently authored.
 */
export const figureGraphs = {
 source:{
  id:'clrs-34-15',
  label:'Figure 34.15 — six-vertex source graph',
  provenance:'CLRS 2nd ed., Figure 34.15 / ENEE 641 slide 31 — original rendering',
  labels:['u','v','w','x','y','z'],
  // K4 {u,v,x,y}, plus four other source edges.
  edges:[[0,1],[0,3],[0,4],[1,3],[1,4],[3,4],[0,5],[3,5],[2,5],[2,4]],
  initialClique:[0,1,3,4],
  positions:[[140,115],[365,95],[490,235],[360,345],[150,345],[65,235]]
 },
 pendant:{
  id:'practice-pendant',
  label:'Practice — triangle with a pendant vertex',
  provenance:'Independently authored graph — not the source figure',
  labels:['p','q','r','s'],
  edges:[[0,1],[1,2],[0,2],[2,3]],
  initialClique:[0,1,2],
  positions:[[115,120],[380,105],[235,335],[475,335]]
 },
 cycle:{
  id:'practice-cycle',
  label:'Practice — four-cycle with no triangle',
  provenance:'Independently authored graph — not the source figure',
  labels:['a','b','c','d'],
  edges:[[0,1],[1,2],[2,3],[3,0]],
  initialClique:[0,1],
  positions:[[125,115],[400,115],[400,345],[125,345]]
 }
};
export function validateUndirected(graph){
 if(!graph||!Array.isArray(graph.labels)||!Array.isArray(graph.edges)||!Array.isArray(graph.positions))throw Error('Invalid graph');
 const n=graph.labels.length;if(n<2||n>12||new Set(graph.labels).size!==n||graph.positions.length!==n)throw Error('Invalid nodes');
 const found=new Set();
 for(const edge of graph.edges){
  if(!Array.isArray(edge)||edge.length!==2||edge.some(v=>!Number.isInteger(v)||v<0||v>=n)||edge[0]===edge[1])throw Error('Invalid edge');
  const key=edgeKey(...edge);if(found.has(key))throw Error('Duplicate edge');found.add(key);
 }
 return true;
}
export function edgeKey(a,b){return Math.min(a,b)+':'+Math.max(a,b);}
export function complementEdges(graph){
 validateUndirected(graph);
 const n=graph.labels.length,edges=new Set(graph.edges.map(e=>edgeKey(...e))),complement=[];
 for(let u=0;u<n;u++)for(let v=u+1;v<n;v++)if(!edges.has(edgeKey(u,v)))complement.push([u,v]);
 return complement;
}
export function isClique(graph,selected){
 validateUndirected(graph);
 if(!Array.isArray(selected)||new Set(selected).size!==selected.length||selected.some(i=>!Number.isInteger(i)||i<0||i>=graph.labels.length))return false;
 const edges=new Set(graph.edges.map(e=>edgeKey(...e)));
 for(let i=0;i<selected.length;i++)for(let j=i+1;j<selected.length;j++)
  if(!edges.has(edgeKey(selected[i],selected[j])))return false;
 return true;
}
export function isCover(edges,selected){
 const s=new Set(selected);
 return edges.every(([u,v])=>s.has(u)||s.has(v));
}
export function analyzeComplementCover(graph,chosen){
 validateUndirected(graph);
 const n=graph.labels.length,rest=Array.from({length:n},(_,i)=>i).filter(i=>!chosen.includes(i));
 const complement=complementEdges(graph);
 return {clique:isClique(graph,chosen),cover:isCover(complement,rest),coverVertices:rest,complementEdges:complement,cliqueSize:chosen.length,coverSize:rest.length};
}
export function findClique(graph,size){
 validateUndirected(graph);const n=graph.labels.length;
 function search(start,chosen){
  if(chosen.length===size)return isClique(graph,chosen)?chosen:null;
  for(let i=start;i<=n-(size-chosen.length);i++){const r=search(i+1,[...chosen,i]);if(r)return r;}
  return null;
 }
 return search(0,[]);
}
