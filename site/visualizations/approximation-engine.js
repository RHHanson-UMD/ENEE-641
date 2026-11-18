// Pure Chapter 35 teaching algorithms. Small instances permit independent brute-force comparison.
export function distance(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1]);}
export function tourCost(points,tour){return tour.reduce((s,v,i)=>s+distance(points[v],points[tour[(i+1)%tour.length]]),0);}
export function metricTsp(points){
 if(!Array.isArray(points)||points.length<3||points.length>9||points.some(p=>!Array.isArray(p)||p.length!==2||p.some(x=>!Number.isFinite(x))))throw Error('Use 3–9 finite points');
 const n=points.length, visited=new Set([0]),parent=Array(n).fill(-1),mst=[];
 while(visited.size<n){
  let best=null;
  for(const u of visited)for(let v=0;v<n;v++)if(!visited.has(v)){
   const weight=distance(points[u],points[v]);
   if(!best||weight<best.weight-1e-9||(Math.abs(weight-best.weight)<1e-9&&(u<best.u||(u===best.u&&v<best.v))))best={u,v,weight};
  }
  visited.add(best.v);parent[best.v]=best.u;mst.push(best);
 }
 const adjacency=Array.from({length:n},()=>[]);
 mst.forEach(({u,v})=>{adjacency[u].push(v);adjacency[v].push(u)});
 adjacency.forEach(a=>a.sort((x,y)=>x-y));
 const preorder=[];
 function dfs(u,p){preorder.push(u);for(const v of adjacency[u])if(v!==p)dfs(v,u)}
 dfs(0,-1);
 const mstCost=mst.reduce((s,e)=>s+e.weight,0);
 const approxCost=tourCost(points,preorder);
 const rest=Array.from({length:n-1},(_,i)=>i+1);let optimum=Infinity,bestTour=[];
 function search(prefix,left){
  if(!left.length){const candidate=[0,...prefix],c=tourCost(points,candidate);if(c<optimum){optimum=c;bestTour=candidate}return;}
  for(let i=0;i<left.length;i++)search([...prefix,left[i]],[...left.slice(0,i),...left.slice(i+1)]);
 }
 search([],rest);
 return {mst,preorder,mstCost,approxCost,optimum,bestTour,ratio:approxCost/optimum};
}
export function setCover(universe,sets,preferredOrder=sets.map((_,i)=>i)){
 if(!Array.isArray(universe)||!Array.isArray(sets)||universe.length>18||sets.length>18||new Set(universe).size!==universe.length)throw Error('Invalid set-cover input');
 const all=new Set(universe);if(sets.some(s=>!Array.isArray(s)||s.some(x=>!all.has(x))))throw Error('Invalid member');
 if(!Array.isArray(preferredOrder)||preferredOrder.length!==sets.length||new Set(preferredOrder).size!==sets.length||preferredOrder.some(i=>!Number.isInteger(i)||i<0||i>=sets.length))throw Error('Invalid tie-breaking order');
 const covered=new Set(),steps=[],selected=[];
 while(covered.size<all.size){
  let best=-1,gain=0;
  preferredOrder.forEach(i=>{const g=new Set(sets[i].filter(x=>!covered.has(x))).size;if(!selected.includes(i)&&g>gain){best=i;gain=g}});
  if(best<0)throw Error('Universe is not coverable');
  selected.push(best);sets[best].forEach(x=>covered.add(x));
  steps.push({index:best,newlyCovered:gain,covered:[...covered]});
 }
 let optimal=[];
 for(let size=0;size<=sets.length;size++){
  for(let mask=0;mask<2**sets.length;mask++){
   let bits=0;for(let j=0;j<sets.length;j++)bits+=(mask>>j)&1;
   if(bits!==size)continue;
   const ix=sets.map((_,j)=>j).filter(j=>(mask>>j)&1);
   const union=new Set(ix.flatMap(j=>sets[j]));
   if([...all].every(x=>union.has(x))){optimal=ix;return {selected,steps,optimal,ratio:optimal.length?selected.length/optimal.length:1};}
  }
 }
 throw Error('No covering subset');
}
export function trim(values,delta){
 if(!(delta>=0&&delta<1))throw Error('delta must be between 0 and 1');
 const sorted=[...new Set(values)].sort((a,b)=>a-b);
 let last=null;return sorted.filter(x=>{if(last===null||x>last*(1+delta)){last=x;return true}return false});
}
export function exactSubsetSum(values,target){
 if(values.some(x=>!Number.isInteger(x)||x<=0)||!Number.isInteger(target)||target<0||values.length>23)throw Error('Invalid subset-sum input');
 let sums=[0];for(const x of values)sums=[...new Set([...sums,...sums.map(y=>y+x).filter(y=>y<=target)])];
 return Math.max(...sums);
}
export function approxSubsetSum(values,target,epsilon){
 if(values.some(x=>!Number.isInteger(x)||x<=0)||!Number.isInteger(target)||target<0||!Number.isFinite(epsilon)||epsilon<=0||epsilon>1||values.length>20)throw Error('Invalid FPTAS input');
 const delta=epsilon/(2*Math.max(1,values.length));let list=[0];const steps=[];
 for(const x of values){
  const combined=[...list,...list.map(y=>y+x)];
  list=trim(combined,delta).filter(y=>y<=target);
  steps.push({x,values:[...list]});
 }
 return {best:Math.max(...list),delta,steps};
}
