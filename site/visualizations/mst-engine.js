// Original Chapter 23 MST teaching engine: undirected edges [u,v,weight].
// Both algorithms use deterministic tie-breaking for repeatable demonstrations.
export const graphs={
 weighted:{n:6,edges:[[0,1,4],[0,2,3],[1,2,2],[1,3,5],[2,3,7],[2,4,8],[3,4,1],[3,5,6],[4,5,2],[1,5,9]]},
 tied:{n:4,edges:[[0,1,1],[1,2,1],[2,3,1],[3,0,1],[0,2,2],[1,3,2]]},
 bridge:{n:5,edges:[[0,1,2],[0,2,4],[1,2,3],[2,3,1],[3,4,5],[1,4,8]]}
};
export function validateMst(n,edges){
 if(!Number.isInteger(n)||n<2||n>10||!Array.isArray(edges))throw Error('Invalid graph');
 const seen=new Set();
 edges.forEach(e=>{if(!Array.isArray(e)||e.length!==3)throw Error('Invalid edge');const [u,v,w]=e;
  if(!Number.isInteger(u)||!Number.isInteger(v)||u<0||v<0||u>=n||v>=n||u===v||!Number.isFinite(w))throw Error('Invalid edge values');
  const k=Math.min(u,v)+':'+Math.max(u,v);if(seen.has(k))throw Error('Duplicate undirected edge');seen.add(k);
 });
}
function dsu(n){
 const parent=Array.from({length:n},(_,i)=>i),rank=Array(n).fill(0);
 function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x]}return x}
 function join(a,b){let u=find(a),v=find(b);if(u===v)return false;
  if(rank[u]<rank[v])[u,v]=[v,u];parent[v]=u;if(rank[u]===rank[v])rank[u]++;return true;}
 return {find,join,parent};
}
export function kruskal(n,edges){
 validateMst(n,edges);const sets=dsu(n),sorted=edges.map((e,i)=>({u:e[0],v:e[1],w:e[2],id:i})).sort((a,b)=>a.w-b.w||a.id-b.id);
 const chosen=[],steps=[];
 for(const edge of sorted){
  const accepted=sets.join(edge.u,edge.v);
  if(accepted)chosen.push(edge.id);
  steps.push({edge,accepted,chosen:[...chosen],roots:Array.from({length:n},(_,i)=>sets.find(i))});
 }
 return {steps,chosen,cost:chosen.reduce((s,i)=>s+edges[i][2],0),connected:chosen.length===n-1};
}
export function prim(n,edges,start=0){
 validateMst(n,edges);if(!Number.isInteger(start)||start<0||start>=n)throw Error('Invalid start');
 const visited=new Set([start]),chosen=[],steps=[{edge:null,accepted:true,visited:[start],chosen:[]}];
 while(visited.size<n){
  const candidates=edges.map((e,i)=>({u:e[0],v:e[1],w:e[2],id:i})).filter(e=>visited.has(e.u)!==visited.has(e.v)).sort((a,b)=>a.w-b.w||a.id-b.id);
  if(!candidates.length)break;
  const edge=candidates[0];visited.add(edge.u);visited.add(edge.v);chosen.push(edge.id);
  steps.push({edge,accepted:true,visited:[...visited].sort((a,b)=>a-b),chosen:[...chosen]});
 }
 return {steps,chosen,cost:chosen.reduce((s,i)=>s+edges[i][2],0),connected:chosen.length===n-1};
}
export function exactMstCost(n,edges){
 validateMst(n,edges);if(edges.length>20)throw Error('Exhaustive oracle only for <=20 edges');
 let best=Infinity;const selected=[];
 function search(index){
  if(selected.length===n-1){
   const d=dsu(n);let cost=0;
   for(const i of selected){const [u,v,w]=edges[i];if(!d.join(u,v))return;cost+=w;}
   if(cost<best)best=cost;return;
  }
  if(index>=edges.length||selected.length+(edges.length-index)<n-1)return;
  selected.push(index);search(index+1);selected.pop();search(index+1);
 }
 search(0);return best;
}
