// Pure, source-aligned Chapter 24 shortest path teaching algorithms.
export const samples={
 nonnegative:{n:5,edges:[[0,1,4],[0,2,2],[2,1,1],[1,3,5],[2,3,8],[3,4,2],[1,4,12]]},
 negative:{n:5,edges:[[0,1,4],[0,2,2],[2,1,-3],[1,3,5],[2,3,8],[3,4,2],[1,4,12]]},
 negativeCycle:{n:4,edges:[[0,1,1],[1,2,-3],[2,1,1],[2,3,2]]}
};
export function validate(n,edges,s){
 if(!Number.isInteger(n)||n<1||n>20||!Array.isArray(edges)||!Number.isInteger(s)||s<0||s>=n)throw Error('Invalid graph');
 for(const [u,v,w] of edges)if(![u,v].every(Number.isInteger)||u<0||v<0||u>=n||v>=n||!Number.isFinite(w))throw Error('Invalid weighted arc');
}
function initial(n,s){const d=Array(n).fill(Infinity),parent=Array(n).fill(null);d[s]=0;return {d,parent};}
function snapshot(d,parent,meta){return {...meta,d:[...d],parent:[...parent]};}
export function bellmanFord(n,edges,s=0){
 validate(n,edges,s);const {d,parent}=initial(n,s);
 const steps=[snapshot(d,parent,{round:0,phase:'initialize',updated:[]})];
 for(let round=1;round<n;round++){
  const updates=[];
  for(const [u,v,w] of edges){
   if(d[u]!==Infinity&&d[u]+w<d[v]){const old=d[v];d[v]=d[u]+w;parent[v]=u;updates.push({u,v,w,old,value:d[v]});}
  }
  steps.push(snapshot(d,parent,{round,phase:'relax',updated:updates}));
 }
 const violating=edges.filter(([u,v,w])=>d[u]!==Infinity&&d[u]+w<d[v]);
 steps.push(snapshot(d,parent,{round:n,phase:'check',updated:[],violating}));
 return {steps,negativeCycleReachable:violating.length>0};
}
export function dijkstra(n,edges,s=0){
 validate(n,edges,s);if(edges.some(e=>e[2]<0))throw Error('Dijkstra requires all edges nonnegative');
 const {d,parent}=initial(n,s),settled=new Set();
 const steps=[snapshot(d,parent,{phase:'initialize',settled:[],updated:[]})];
 for(let iter=0;iter<n;iter++){
  let u=-1;for(let i=0;i<n;i++)if(!settled.has(i)&&(u<0||d[i]<d[u]))u=i;
  if(u<0||d[u]===Infinity)break;
  settled.add(u);
  const updated=[];
  for(const [a,v,w] of edges)if(a===u&&!settled.has(v)&&d[u]+w<d[v]){
   const old=d[v];d[v]=d[u]+w;parent[v]=u;updated.push({u,v,w,old,value:d[v]});
  }
  steps.push(snapshot(d,parent,{phase:'finalize',vertex:u,settled:[...settled],updated}));
 }
 return {steps};
}
export function tracePath(parent,s,dest){
 if(dest===s)return [s];const seen=new Set(),path=[];let curr=dest;
 while(curr!==null&&!seen.has(curr)){seen.add(curr);path.unshift(curr);if(curr===s)return path;curr=parent[curr];}
 return [];
}
