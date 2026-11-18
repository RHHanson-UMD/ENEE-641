// Original Chapter 16 examples: greedy activity selection and binary Huffman coding.
export const lectures=[[0,3],[2,5],[3,6],[5,8],[6,9],[8,11],[9,12],[11,14],[4,7]];
export const frequencies={A:7,B:9,C:12,D:18,E:30};
export function selectActivities(activities){
 if(!Array.isArray(activities)||activities.length>18||activities.some(x=>!Array.isArray(x)||x.length!==2||x.some(v=>!Number.isFinite(v))||x[0]>=x[1]))throw Error('Invalid intervals');
 const order=activities.map(([start,finish],id)=>({id,start,finish})).sort((a,b)=>a.finish-b.finish||a.start-b.start||a.id-b.id);
 let last=-Infinity;const selected=[],steps=[];
 for(const a of order){const accepted=a.start>=last;if(accepted){selected.push(a.id);last=a.finish;}
  steps.push({activity:a.id,accepted,selected:[...selected],lastFinish:last});
 }
 return {selected,steps,order};
}
export function exactActivityCount(activities){
 if(activities.length>18)throw Error('Too many activities');
 let best=0;
 for(let mask=0;mask<(1<<activities.length);mask++){
  const chosen=activities.filter((_,i)=>mask&(1<<i)).sort((a,b)=>a[0]-b[0]);
  if(chosen.every((a,i)=>i===0||chosen[i-1][1]<=a[0]))best=Math.max(best,chosen.length);
 }
 return best;
}
export function huffman(frequencies){
 const entries=Object.entries(frequencies);
 if(!entries.length||entries.length>12||entries.some(([k,v])=>!k||!Number.isFinite(v)||v<=0))throw Error('Invalid frequencies');
 let nextId=0;
 const queue=entries.map(([symbol,weight])=>({id:nextId++,symbol,weight,left:null,right:null}));
 const steps=[];
 while(queue.length>1){
  queue.sort((a,b)=>a.weight-b.weight||a.id-b.id);
  const left=queue.shift(),right=queue.shift();
  const parent={id:nextId++,symbol:null,weight:left.weight+right.weight,left,right};
  queue.push(parent);
  steps.push({left:left.weight,right:right.weight,merged:parent.weight,queue:queue.map(x=>x.weight).sort((a,b)=>a-b)});
 }
 const root=queue[0],codes={};
 function walk(n,bits){if(n.symbol!==null)codes[n.symbol]=bits||'0';else{walk(n.left,bits+'0');walk(n.right,bits+'1')}}
 walk(root,'');
 const weightedCost=entries.reduce((sum,[s,w])=>sum+w*codes[s].length,0);
 return {root,codes,weightedCost,steps};
}
export function exactMergeCost(weights){
 if(!Array.isArray(weights)||weights.length<1||weights.length>9||weights.some(w=>!Number.isFinite(w)||w<=0))throw Error('Invalid weights');
 const memo=new Map();
 function solve(a){
  if(a.length===1)return 0;
  a=[...a].sort((x,y)=>x-y);const key=a.join(',');
  if(memo.has(key))return memo.get(key);
  let best=Infinity;
  for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){
   const sum=a[i]+a[j],rest=a.filter((_,k)=>k!==i&&k!==j);
   best=Math.min(best,sum+solve([...rest,sum]));
  }
  memo.set(key,best);return best;
 }
 return solve(weights);
}
