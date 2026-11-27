/** Original practice for the multiplicative reliability objective reviewed on Nov 24.
 * All examples are independently authored; no course homework questions/answers copied.
 * All edge probabilities lie in [0,1]. Independence along a path is assumed.
 */
export function reliablePath(vertices,edges,source,target) {
 if(!Array.isArray(vertices)||vertices.length<1||vertices.length>80||
    vertices.some(v=>typeof v!=='string'||v.length<1||v.length>30)||new Set(vertices).size!==vertices.length)
   throw new RangeError('Use 1–80 distinct vertex names');
 const index=new Map(vertices.map((v,i)=>[v,i]));
 if(!index.has(source)||!index.has(target)||!Array.isArray(edges)||edges.length>3000)
   throw new RangeError('Invalid source, target or edge count');
 const adj=vertices.map(()=>[]);
 for(const e of edges) {
  if(!Array.isArray(e)||e.length!==3||!index.has(e[0])||!index.has(e[1])||
     typeof e[2]!=='number'||!Number.isFinite(e[2])||e[2]<0||e[2]>1)
    throw new RangeError('Edges must be [from,to,reliability] with 0 ≤ reliability ≤ 1');
  adj[index.get(e[0])].push([index.get(e[1]),e[2]]);
 }
 const n=vertices.length,best=Array(n).fill(0),done=Array(n).fill(false),prev=Array(n).fill(null),trace=[];
 const start=index.get(source),end=index.get(target);best[start]=1;
 for(let round=0;round<n;round++){
  let u=-1;
  for(let i=0;i<n;i++)if(!done[i]&&(u<0||best[i]>best[u]))u=i;
  if(u===-1||best[u]===0)break;
  done[u]=true;trace.push({vertex:vertices[u],reliability:best[u]});
  for(const [v,r] of adj[u]){
   const candidate=best[u]*r;
   if(!done[v]&&candidate>best[v]){
     best[v]=candidate;prev[v]={parent:u,weight:r};
   }
  }
 }
 if(source===target)return {reliability:1,path:[source],edges:[],trace,best:vertices.map((v,i)=>({vertex:v,reliability:best[i]})),reachable:true};
 // A product-zero path is reachable even though its optimum is 0.
 const seen=new Set([start]),queue=[start];
 for(let h=0;h<queue.length;h++)for(const [v] of adj[queue[h]])if(!seen.has(v)){seen.add(v);queue.push(v);}
 if(!seen.has(end))return {reliability:null,path:[],edges:[],trace,best:vertices.map((v,i)=>({vertex:v,reliability:best[i]})),reachable:false};
 if(best[end]===0){
   const parent=new Map([[start,null]]);
   for(let h=0,items=[start];h<items.length;h++)for(const [v,r] of adj[items[h]])if(!parent.has(v)){parent.set(v,{from:items[h],weight:r});items.push(v);}
   const path=[vertices[end]],steps=[];let cur=end;
   while(cur!==start){const p=parent.get(cur);if(!p)throw Error('Missing zero-path predecessor');steps.push({from:vertices[p.from],to:vertices[cur],reliability:p.weight});cur=p.from;path.push(vertices[cur]);}
   return {reliability:0,path:path.reverse(),edges:steps.reverse(),trace,best:vertices.map((v,i)=>({vertex:v,reliability:best[i]})),reachable:true};
 }
 const path=[vertices[end]],steps=[];let cur=end;
 while(cur!==start){const p=prev[cur];if(!p)throw Error('Missing positive-path predecessor');steps.push({from:vertices[p.parent],to:vertices[cur],reliability:p.weight});cur=p.parent;path.push(vertices[cur]);if(steps.length>n)throw Error('Unexpected predecessor cycle');}
 return {reliability:best[end],path:path.reverse(),edges:steps.reverse(),trace,best:vertices.map((v,i)=>({vertex:v,reliability:best[i]})),reachable:true};
}
export function logarithmicWeights(edges) {
 if(!Array.isArray(edges))throw new RangeError('Expected edge array');
 return edges.map(([u,v,p])=>{
   if(typeof p!=='number'||!Number.isFinite(p)||p<0||p>1)throw new RangeError('0 ≤ p ≤ 1 required');
   return [u,v,p===0?Infinity:p===1?0:-Math.log(p)];
 });
}
