/** Original deterministic simple-undirected graph DFS and Euler engine.
 * Primary source: ENEE 641 Chapter22Oct15-2026, slides 9–19.
 * Vertices 0..n-1; no self-loops or parallel edges; ties in ascending neighbor order.
 */
export function analyzeUndirected(n,edges) {
 if(!Number.isInteger(n)||n<0||n>100||!Array.isArray(edges))throw new RangeError('0<=n<=100 and edge array required');
 const seen=new Set(),adj=Array.from({length:n},()=>[]);
 edges.forEach((edge,id)=>{if(!Array.isArray(edge)||edge.length!==2||edge.some(v=>!Number.isInteger(v)||v<0||v>=n)||edge[0]===edge[1])throw new RangeError('Invalid undirected edge');
  const [u,v]=edge,key=[u,v].sort((a,b)=>a-b).join(':');if(seen.has(key))throw new RangeError('Parallel edge not supported');seen.add(key);
  adj[u].push({to:v,id});adj[v].push({to:u,id});});
 adj.forEach(list=>list.sort((a,b)=>a.to-b.to));
 const discover=Array(n).fill(0),finish=Array(n).fill(0),low=Array(n).fill(0),parent=Array(n).fill(-1),art=new Set(),bridges=[],components=[],trace=[],stack=[];let clock=0;
 function dfs(u,pEdge){discover[u]=low[u]=++clock;trace.push({event:'discover',vertex:u,time:clock});let children=0;
 for(const {to:v,id} of adj[u]){
  if(id===pEdge)continue;
  if(!discover[v]){
   children++;parent[v]=u;stack.push(id);dfs(v,id);low[u]=Math.min(low[u],low[v]);
   if(low[v]>=discover[u]){if(parent[u]!==-1||children>1)art.add(u);const comp=[];let popped;do{popped=stack.pop();comp.push(popped);}while(popped!==id);components.push(comp.sort((a,b)=>a-b));}
   if(low[v]>discover[u])bridges.push(id);
  }else if(discover[v]<discover[u]){low[u]=Math.min(low[u],discover[v]);stack.push(id);}
 }
 finish[u]=++clock;trace.push({event:'finish',vertex:u,time:clock,low:low[u]});
 }
 let groups=0;for(let v=0;v<n;v++)if(!discover[v]){groups++;dfs(v,-1);}
 bridges.sort((a,b)=>a-b);const articulation=[...art].sort((a,b)=>a-b);
 const degree=adj.map(a=>a.length),hasEven=degree.every(d=>d%2===0);
 const nonempty=degree.findIndex(d=>d>0);let connected=true;
 if(nonempty!==-1){const visited=Array(n).fill(false),q=[nonempty];visited[nonempty]=true;for(let i=0;i<q.length;i++)for(const {to:v} of adj[q[i]])if(!visited[v]){visited[v]=true;q.push(v);}connected=degree.every((d,v)=>d===0||visited[v]);}
 let euler=null;if(hasEven&&connected){if(edges.length===0)euler=[];else{const used=Array(edges.length).fill(false),cursor=Array(n).fill(0),walk=[nonempty],tour=[];
  while(walk.length){const u=walk.at(-1),list=adj[u];while(cursor[u]<list.length&&used[list[cursor[u]].id])cursor[u]++;if(cursor[u]===list.length){tour.push(u);walk.pop();}else{const edge=list[cursor[u]++];used[edge.id]=true;walk.push(edge.to);}}
  euler=tour.reverse();if(euler.length!==edges.length+1)throw Error('Euler construction incomplete');}}
 return {discover,finish,low,parent,articulation,bridgeIds:bridges,biconnectedEdgeComponents:components,degree,connectedNonisolated:connected,componentCount:groups,euler,trace};
}
export function analyzeDirectedDFS(n,edges) {
 if(!Number.isInteger(n)||n<0||n>100||!Array.isArray(edges)||edges.some(e=>!Array.isArray(e)||e.length!==2||e.some(v=>!Number.isInteger(v)||v<0||v>=n)))throw new RangeError('Invalid directed graph');
 const adj=Array.from({length:n},()=>[]);edges.forEach(([u,v],id)=>adj[u].push({v,id}));adj.forEach(a=>a.sort((x,y)=>x.v-y.v));
 const color=Array(n).fill(0),d=Array(n).fill(0),f=Array(n).fill(0),parent=Array(n).fill(-1),types=Array(edges.length).fill(null);let t=0;
 function dfs(u){color[u]=1;d[u]=++t;for(const {v,id} of adj[u]){if(color[v]===0){types[id]='tree';parent[v]=u;dfs(v);}else if(color[v]===1)types[id]='back';else types[id]=d[u]<d[v]?'forward':'cross';}color[u]=2;f[u]=++t;}
 for(let u=0;u<n;u++)if(!color[u])dfs(u);
 return {discover:d,finish:f,parent,edgeTypes:types,hasCycle:types.includes('back')};
}
