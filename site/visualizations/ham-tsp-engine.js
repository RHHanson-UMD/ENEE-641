// Original interactive HAM-CYCLE -> decision TSP reduction (0 for an original edge, 1 otherwise).
export function edgeKey(a,b){return Math.min(a,b)+':'+Math.max(a,b);}
export function allPairs(n){const edges=[];for(let u=0;u<n;u++)for(let v=u+1;v<n;v++)edges.push([u,v]);return edges;}
export function analyzeHamTsp(n,edges){
 if(!Number.isInteger(n)||n<3||n>8||!Array.isArray(edges))throw Error('Use 3–8 vertices and an edge list');
 const allowed=new Set();
 for(const e of edges){
  if(!Array.isArray(e)||e.length!==2||e.some(v=>!Number.isInteger(v)||v<0||v>=n)||e[0]===e[1])throw Error('Invalid edge');
  allowed.add(edgeKey(e[0],e[1]));
 }
 const rest=Array.from({length:n-1},(_,i)=>i+1);let bestCost=Infinity,bestTour=null,hamTour=null;
 function search(prefix,left){
  if(!left.length){
   const tour=[0,...prefix];
   const cost=tour.reduce((sum,u,i)=>sum+(allowed.has(edgeKey(u,tour[(i+1)%n]))?0:1),0);
   if(cost<bestCost){bestCost=cost;bestTour=tour;}
   if(cost===0 && !hamTour)hamTour=tour;
   return;
  }
  for(let i=0;i<left.length;i++)search([...prefix,left[i]],[...left.slice(0,i),...left.slice(i+1)]);
 }
 search([],rest);
 return {bestCost,bestTour,hamTour,hasHamiltonianCycle:hamTour!==null,threshold:0,edgeCount:allowed.size};
}
