/**
 * Original educational output-stationary systolic array simulation.
 * Source motivation: "GPUS and TPUs 24Nov2026.pptx", slides 5–7.
 * Exact cycle schedule below is an INDEPENDENT illustrative model, not an
 * instructor diagram or a claim about any specific Google TPU/NPU hardware.
 */
export function systolicMatmul(A,B){
 if(!Array.isArray(A)||!Array.isArray(B)||A.length!==B.length||A.length<1||A.length>5)throw new RangeError('Square matrices of equal size, 1..5 required');
 const n=A.length;
 if([...A,...B].some(row=>!Array.isArray(row)||row.length!==n||row.some(x=>!Number.isFinite(x))))throw new RangeError('Finite square matrices required');
 const acc=Array.from({length:n},()=>Array(n).fill(0)),rounds=[];
 const last=3*n-3;
 for(let tick=0;tick<=last;tick++){
   const products=[];
   for(let i=0;i<n;i++)for(let j=0;j<n;j++){
     const k=tick-i-j;
     if(k>=0&&k<n){
       const av=A[i][k],bv=B[k][j],product=av*bv;
       acc[i][j]+=product;
       products.push({row:i,col:j,k,a:av,b:bv,product,accumulator:acc[i][j]});
     }
   }
   rounds.push({tick,products,accumulators:acc.map(row=>row.slice())});
 }
 return {n,result:acc,rounds,ticks:last+1,multiplications:n**3,
  convention:'A[i,k] enters from left at tick i+k; B[k,j] enters from top at tick j+k. Both meet PE(i,j) at tick i+j+k; output-stationary accumulator.'};
}
export function referenceMatmul(A,B){
 const n=A.length;
 return Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>A[i].reduce((sum,a,k)=>sum+a*B[k][j],0)));
}
