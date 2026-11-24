/**
 * Original interactive reconstructions of the mathematical concepts visible
 * in ENEE 641 "GPUS and TPUs 24Nov2026.pptx".
 *
 * Slide 3: four named output blocks and eight input-block products.
 * Slides 8–9: source's preloaded 2x3 weights and staggered 3-element input
 * (conceptual timing illustration, not an exact vendor hardware simulator).
 * Slide 6: source labels historical 90nm energy figures; descriptive only.
 */
function matrix2x2(a,name){
  if(!Array.isArray(a)||a.length!==2||a.some(r=>!Array.isArray(r)||r.length!==2||r.some(v=>!Number.isFinite(v))))
    throw new RangeError(name+' must be a finite 2x2 matrix');
}
export const BLOCK_NAMES=['A','B','C','D'];
export function blockEquation(outputIndex){
 if(!Number.isInteger(outputIndex)||outputIndex<0||outputIndex>3)throw new RangeError('Block index must be 0..3');
 const i=Math.floor(outputIndex/2),j=outputIndex%2;
 const X=['A','B','C','D'],Y=['A','B','C','D'];
 return {output:'Z'+X[outputIndex],
  terms:[{x:'X'+X[2*i],y:'Y'+Y[j],xIndex:2*i,yIndex:j},
         {x:'X'+X[2*i+1],y:'Y'+Y[2+j],xIndex:2*i+1,yIndex:2+j}]};
}
export function blockProductTrace(X,Y){
 matrix2x2(X,'X');matrix2x2(Y,'Y');
 const Z=[[0,0],[0,0]],traces=[];
 for(let outputIndex=0;outputIndex<4;outputIndex++){
  const i=Math.floor(outputIndex/2),j=outputIndex%2,eq=blockEquation(outputIndex);
  const products=eq.terms.map(t=>X[Math.floor(t.xIndex/2)][t.xIndex%2]*Y[Math.floor(t.yIndex/2)][t.yIndex%2]);
  Z[i][j]=products[0]+products[1];traces.push({...eq,products,sum:Z[i][j],outputIndex});
 }
 return {X,Y,Z,traces,blockMultiplications:8,blockAdditions:4};
}
export function weightStationaryTrace(W,x){
 if(!Array.isArray(W)||W.length!==2||W.some(r=>!Array.isArray(r)||r.length!==3||r.some(v=>!Number.isFinite(v)))||
    !Array.isArray(x)||x.length!==3||x.some(v=>!Number.isFinite(v)))throw new RangeError('Provide 2x3 finite weights and three inputs');
 const outputs=W.map(row=>row.reduce((sum,w,j)=>sum+w*x[j],0)),ticks=[];
 for(let tick=0;tick<=3;tick++){
  const active=[];
  for(let row=0;row<2;row++){
   const stage=tick-row;
   if(stage<0||stage>=3)continue;
   const partial=W[row].slice(0,stage+1).reduce((sum,w,j)=>sum+w*x[j],0);
   active.push({row,col:stage,inputIndex:stage,weight:W[row][stage],input:x[stage],
    multiplication:W[row][stage]*x[stage],partial,completed:stage===2});
  }
  ticks.push({tick,active,completed:active.filter(a=>a.completed).map(a=>({row:a.row,value:a.partial}))});
 }
 return {W,x,outputs,ticks,operations:6,
  assumption:'Two rows of three preloaded weights; input x1,x2,x3 staggered one tick per row, partial sums stream across each row. Simplified educational timing, not a specific TPU wiring model.'};
}
export const HISTORICAL_ENERGY_90NM=[
 {name:'RISC instruction',low:125,high:125},
 {name:'Load/store instruction',low:150,high:150},
 {name:'Single-precision float operation',low:15,high:20},
 {name:'32-bit addition',low:7,high:7},
 {name:'8-bit addition',low:0.2,high:0.5}
];
export function historicalRatio(a,b){
 const x=HISTORICAL_ENERGY_90NM[a],y=HISTORICAL_ENERGY_90NM[b];
 if(!x||!y)throw new RangeError('Choose listed 90nm operation indices');
 return {min:x.low/y.high,max:x.high/y.low,
   note:'Historic 90nm illustrative pJ ratios, not modern GPU/TPU/NPU energy or instruction throughput claims'};
}
