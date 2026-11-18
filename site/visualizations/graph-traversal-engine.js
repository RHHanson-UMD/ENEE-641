// Independent original Chapter 22 BFS and zero-indegree topological peeling.
// Vertices use zero-based indices. BFS edges undirected; topological edges directed.
export const graphs={
 bfs:{n:7,edges:[[0,1],[0,2],[1,3],[2,3],[2,4],[4,5],[3,5]]},
 topo:{n:6,edges:[[0,2],[0,3],[1,3],[2,4],[3,4],[3,5],[4,5]]}
};
export function validate(n,edges){
 if(!Number.isInteger(n)||n<1||n>30||!Array.isArray(edges))throw Error('Invalid graph');
 for(const e of edges)if(!Array.isArray(e)||e.length!==2||e.some(v=>!Number.isInteger(v)||v<0||v>=n)||e[0]===e[1])throw Error('Invalid edge');
}
export function bfs(n,edges,source=0){
 validate(n,edges);if(!Number.isInteger(source)||source<0||source>=n)throw Error('Invalid source');
 const adjacency=Array.from({length:n},()=>[]);
 for(const [u,v] of edges){adjacency[u].push(v);adjacency[v].push(u);}
 adjacency.forEach(a=>a.sort((x,y)=>x-y));
 const dist=Array(n).fill(Infinity),parent=Array(n).fill(null),queue=[source],states=[];dist[source]=0;
 states.push({vertex:null,queue:[...queue],dist:[...dist],parent:[...parent],newlyDiscovered:[]});
 while(queue.length){
  const u=queue.shift(),newlyDiscovered=[];
  for(const v of adjacency[u])if(dist[v]===Infinity){dist[v]=dist[u]+1;parent[v]=u;queue.push(v);newlyDiscovered.push(v);}
  states.push({vertex:u,queue:[...queue],dist:[...dist],parent:[...parent],newlyDiscovered});
 }
 return {states,dist,parent,order:states.slice(1).map(s=>s.vertex)};
}
export function topologicalPeel(n,edges){
 validate(n,edges);const adj=Array.from({length:n},()=>[]),indegree=Array(n).fill(0);
 for(const [u,v] of edges){adj[u].push(v);indegree[v]++;}
 adj.forEach(a=>a.sort((x,y)=>x-y));
 const queue=[];for(let i=0;i<n;i++)if(indegree[i]===0)queue.push(i);
 const order=[],states=[{removed:null,queue:[...queue],indegree:[...indegree],order:[],newlyZero:[]}];
 while(queue.length){
  const u=queue.shift();order.push(u);const newlyZero=[];
  for(const v of adj[u]){indegree[v]--;if(indegree[v]===0){queue.push(v);newlyZero.push(v)}}
  states.push({removed:u,queue:[...queue],indegree:[...indegree],order:[...order],newlyZero});
 }
 return {states,order,hasCycle:order.length<n};
}
export function validTopologicalOrder(n,edges,order){
 if(order.length!==n||new Set(order).size!==n||order.some(v=>v<0||v>=n))return false;
 const index=Array(n);order.forEach((v,i)=>{index[v]=i});
 return edges.every(([u,v])=>index[u]<index[v]);
}
