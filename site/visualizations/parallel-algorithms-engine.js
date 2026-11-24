/**
 * Independent demonstrations for the ENEE 641 parallel-algorithms preview.
 * Source: "parallel algorithms first classes2026.ppt", slides 19, 28–45
 * (selected material from ENEE 651/CMSC 751; not confirmed taught in ENEE 641).
 * All examples here are original. Arrays use JS 0-based positions while the
 * instructor's pseudocode uses 1-based PRAM indexing.
 */
function check(values) {
  if (!Array.isArray(values) || !values.length || values.length>128 ||
      values.some(x=>!Number.isSafeInteger(x))) throw new RangeError('Provide 1–128 safe integers');
  if ((values.length&(values.length-1))!==0) throw new RangeError('Use a power-of-two count for the balanced-tree model');
}
export function reductionTrace(values) {
  check(values);
  const rounds=[{stage:'Input / parallel copy',values:values.slice(),active:values.length,operations:values.length}];
  let cur=values.slice(),adds=0;
  while(cur.length>1){
    const next=[];
    for(let i=0;i<cur.length;i+=2)next.push(cur[i]+cur[i+1]);
    adds+=next.length;
    rounds.push({stage:'Pairwise addition',values:next,active:next.length,operations:next.length});
    cur=next;
  }
  rounds.push({stage:'Output',values:cur.slice(),active:1,operations:1});
  const work=rounds.reduce((s,r)=>s+r.operations,0);
  return {sum:cur[0],rounds,work,additionWork:adds,depth:rounds.length,
    wdProcessorTime:(p)=>processorTime(rounds.map(x=>x.operations),p)};
}
function processorTime(ops,p) {
  if(!Number.isInteger(p)||p<1||p>4096)throw new RangeError('Processors must be 1..4096');
  return {processors:p,perRound:ops.map(n=>Math.ceil(n/p)),rounds:ops.reduce((t,n)=>t+Math.ceil(n/p),0)};
}
/**
 * Work-efficient inclusive scan via Blelloch upsweep and downsweep.
 * The slide's prefix routine has equivalent O(n) work/O(log n) depth,
 * but uses a different tree-based pseudocode. Do not label as a literal trace.
 */
export function prefixTrace(values) {
  check(values);
  const n=values.length,a=values.slice(),rounds=[];
  for(let span=2;span<=n;span*=2) {
    const changed=[];
    for(let end=span-1;end<n;end+=span){a[end]+=a[end-span/2];changed.push(end);}
    rounds.push({phase:'Upsweep',span,values:a.slice(),updated:changed,operations:changed.length});
  }
  const total=a[n-1];a[n-1]=0;
  rounds.push({phase:'Root identity',span:n,values:a.slice(),updated:[n-1],operations:0});
  for(let span=n;span>=2;span/=2){
    const changed=[];
    for(let end=span-1;end<n;end+=span){
      const left=end-span/2,t=a[left];a[left]=a[end];a[end]=t+a[end];changed.push(left,end);
    }
    rounds.push({phase:'Downsweep',span,values:a.slice(),updated:changed,operations:span? n/span:0});
  }
  const exclusive=a.slice(),inclusive=exclusive.map((v,i)=>v+values[i]);
  rounds.push({phase:'Inclusive output',span:1,values:inclusive.slice(),updated:values.map((_,i)=>i),operations:n});
  return {inclusive,exclusive,total,rounds,additionWork:rounds.reduce((x,r)=>x+r.operations,0),depth:2*Math.log2(n)+1};
}
export function compactByFlag(values,flags){
  check(values);
  if(!Array.isArray(flags)||flags.length!==values.length||flags.some(x=>x!==0&&x!==1))
    throw new RangeError('Flags must be binary and match input length');
  const r=prefixTrace(flags),output=Array(r.total);
  for(let i=0;i<values.length;i++)if(flags[i])output[r.inclusive[i]-1]=values[i];
  return {prefix:r.inclusive,output,mapping:values.map((v,i)=>flags[i]?r.inclusive[i]-1:null),scan:r};
}
export function workDepthBound(work,depth,processors){
  if(![work,depth,processors].every(Number.isFinite)||!Number.isInteger(work)||!Number.isInteger(depth)||!Number.isInteger(processors)||work<0||depth<1||processors<1)throw new RangeError('Nonnegative integer work and positive integer depth, processors required');
  return {work,depth,processors,lowerBound:Math.max(work/processors,depth),upperBoundIllustration:work/processors+depth};
}
