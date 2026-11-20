/** Original mathematical model for upcoming ENEE 641 GPU/TPU tile lesson.
 * Primary source: "GPUS and TPUs 24Nov2026.pptx", slides 1–4.
 * Counts are abstract matrix-element transfers, NOT timing or cache measurements.
 */
export function tiledMatmulModel(n,block) {
  if (!Number.isInteger(n)||n<1||n>5000||!Number.isInteger(block)||block<1||block>n)
    throw new RangeError('n must be 1..5000; block must be an integer in 1..n');
  if(n%block!==0)throw new RangeError('Use a block size that divides n for this complete-tile model');
  const q=n/block;
  // For each triple of output row, output col, inner block:
  // read two b*b tiles. Arithmetic work is 2? Multiplication terms exactly n^3.
  const innerProducts=n**3,blockProducts=q**3;
  const naiveInputReads=2*n**3;
  const tiledInputReads=2*q**3*block**2;
  // This idealized model assumes output tiles are retained for inner summation.
  const outputWrites=n**2,fastMemoryMin=3*block**2;
  return {n,block,blocksPerAxis:q,blockProducts,innerProducts,
    naiveInputReads,tiledInputReads,outputWrites,
    idealInputReadReduction:naiveInputReads/tiledInputReads,
    fastMemoryMin,assumption:'Two input tiles and one accumulator tile fit in fast memory; full tiles; ignore writeback, cache conflicts and scheduling overhead.'};
}
export function multiplyByTiles(A,B,block){
  if(!Array.isArray(A)||!Array.isArray(B)||A.length===0||A.length!==B.length)
    throw new RangeError('Supply two same-size nonempty square numeric matrices');
  const n=A.length;
  if(n>16||!Number.isInteger(block)||block<1||block>n||n%block!==0||
      [...A,...B].some(row=>!Array.isArray(row)||row.length!==n||row.some(v=>!Number.isFinite(v))))
    throw new RangeError('Matrices must be finite, square, <=16 and tile size divide n');
  const C=Array.from({length:n},()=>Array(n).fill(0)),steps=[];
  for(let i0=0;i0<n;i0+=block)for(let j0=0;j0<n;j0+=block)for(let k0=0;k0<n;k0+=block){
    for(let i=i0;i<i0+block;i++)for(let j=j0;j<j0+block;j++)
      for(let k=k0;k<k0+block;k++)C[i][j]+=A[i][k]*B[k][j];
    steps.push({outputTile:[i0/block,j0/block],innerTile:k0/block,matrix:C.map(row=>row.slice())});
  }
  return {matrix:C,steps};
}
export function independentProduct(A,B) {
  const n=A.length;
  return Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>A[i].reduce((s,a,k)=>s+a*B[k][j],0)));
}
