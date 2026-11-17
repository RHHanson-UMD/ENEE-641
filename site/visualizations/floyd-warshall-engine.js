// Chapter 25 original Floyd-Warshall teaching engine: 0-based vertices.
// Infinity means no edge. Distances and next-hop tables retain each k-stage.
export function floydWarshall(matrix){
 const n=matrix.length;
 if(!Array.isArray(matrix)||n===0||n>12||matrix.some(r=>!Array.isArray(r)||r.length!==n))throw Error('Expected square matrix (1–12 vertices)');
 const d=matrix.map((row,i)=>row.map((w,j)=>{
  if(typeof w!=='number'||Number.isNaN(w)||w===-Infinity)throw Error('Invalid weight');
  if(i===j&&w!==0)throw Error('Zero diagonal required');
  return w;
 }));
 let next=d.map((row,i)=>row.map((w,j)=>i===j?i:Number.isFinite(w)?j:null));
 const stages=[{k:-1,dist:d.map(r=>[...r]),next:next.map(r=>[...r]),updates:[]}];
 for(let k=0;k<n;k++){
  const updates=[];
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){
   const via=d[i][k]+d[k][j];
   if(via<d[i][j]){
    updates.push({i,j,old:d[i][j],value:via,via:k});
    d[i][j]=via;next[i][j]=next[i][k];
   }
  }
  stages.push({k,dist:d.map(r=>[...r]),next:next.map(r=>[...r]),updates});
 }
 const hasNegativeCycle=d.some((row,i)=>row[i]<0);
 return {stages,hasNegativeCycle};
}
export function reconstructPath(stage,i,j){
 if(stage.next[i][j]===null)return [];
 const path=[i];let current=i;
 for(let hops=0;hops<stage.next.length+1&&current!==j;hops++){
  current=stage.next[current][j];
  if(current===null)return [];
  path.push(current);
 }
 if(path.at(-1)!==j)throw Error('Path reconstruction failed (possible negative cycle)');
 return path;
}
export const examples={
 negative:[
  [0,3,10,15],
  [Infinity,0,-2,8],
  [Infinity,Infinity,0,2],
  [4,Infinity,Infinity,0]
 ],
 positive:[
  [0,4,11,Infinity],
  [Infinity,0,2,10],
  [Infinity,Infinity,0,3],
  [7,Infinity,Infinity,0]
 ],
 disconnected:[
  [0,5,Infinity,Infinity],
  [Infinity,0,1,Infinity],
  [Infinity,Infinity,0,Infinity],
  [Infinity,Infinity,Infinity,0]
 ]
};
