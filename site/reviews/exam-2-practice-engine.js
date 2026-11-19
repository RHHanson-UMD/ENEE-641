/**
 * Original ENEE 641 second-midterm independent practice oracles.
 * Course basis: 2026 lectures Ch. 23 (cuts/MST), Ch. 24 (relaxation/Dijkstra).
 * No instructor exams or solutions are reproduced here.
 */
function validateVertices(vertices) {
  if (!Array.isArray(vertices) || vertices.length===0 || vertices.length>12 ||
      vertices.some(v=>typeof v!=='string'||!/^[a-z][a-z0-9_-]{0,10}$/i.test(v)) ||
      new Set(vertices).size!==vertices.length) throw new RangeError('Use 1–12 distinct short vertex names');
}
function minHeap() {
  const a=[];
  const less=(x,y)=>x.cost<y.cost||(x.cost===y.cost&&x.state<y.state);
  return {
    get length(){return a.length;},
    push(item){a.push(item);let i=a.length-1;while(i>0){const p=Math.floor((i-1)/2);if(!less(a[i],a[p]))break;[a[i],a[p]]=[a[p],a[i]];i=p;}},
    pop(){if(!a.length)return null;const ans=a[0],last=a.pop();if(a.length){a[0]=last;let i=0;while(true){let j=i,l=2*i+1,r=l+1;if(l<a.length&&less(a[l],a[j]))j=l;if(r<a.length&&less(a[r],a[j]))j=r;if(j===i)break;[a[i],a[j]]=[a[j],a[i]];i=j;}}return ans;}
  };
}
export function couponShortestPath(vertices, edges, source, target) {
  validateVertices(vertices);
  const idx=new Map(vertices.map((v,i)=>[v,i]));
  if(!idx.has(source)||!idx.has(target)||!Array.isArray(edges)||edges.length>140)throw new RangeError('Check source/target and edge list (maximum 140)');
  const out=vertices.map(()=>[]);
  for(const item of edges){
    if(!Array.isArray(item)||item.length!==3||!idx.has(item[0])||!idx.has(item[1])||!Number.isSafeInteger(item[2])||item[2]<0)
      throw new RangeError('Directed edges must be [from,to,nonnegative integer cost]');
    out[idx.get(item[0])].push({to:idx.get(item[1]),weight:item[2]});
  }
  out.forEach(list=>list.sort((a,b)=>a.to-b.to||a.weight-b.weight));
  const n=vertices.length, start=idx.get(source)*2,d=Array(2*n).fill(Infinity),prev=Array(2*n).fill(null),pq=minHeap(),settled=Array(2*n).fill(false),trace=[];
  d[start]=0;pq.push({cost:0,state:start});
  while(pq.length){
    const cur=pq.pop();if(cur.cost!==d[cur.state]||settled[cur.state])continue;
    settled[cur.state]=true;
    const u=Math.floor(cur.state/2),used=cur.state%2;
    trace.push({vertex:vertices[u],usedCoupon:Boolean(used),distance:cur.cost});
    for(const {to,weight} of out[u]){
      const relax=(nextState,cost,waived)=>{
        if(cost>=d[nextState])return;
        d[nextState]=cost;prev[nextState]={state:cur.state,from:vertices[u],to:vertices[to],weight,waived};
        pq.push({cost,state:nextState});
      };
      relax(to*2+used,cur.cost+weight,false);
      if(!used)relax(to*2+1,cur.cost,true);
    }
  }
  const t=idx.get(target),end=d[2*t]<=d[2*t+1]?2*t:2*t+1;
  if(!Number.isFinite(d[end]))return {cost:null,path:[],usedCoupon:false,distances:vertices.map((vertex,i)=>({vertex,unused:d[2*i],used:d[2*i+1]})),trace};
  const path=[];let cur=end;
  while(cur!==start){const p=prev[cur];if(!p)throw Error('Missing predecessor during witness reconstruction');path.push({from:p.from,to:p.to,weight:p.weight,waived:p.waived});cur=p.state;if(path.length>2*n)throw Error('Cycle in state predecessor chain');}
  path.reverse();
  return {cost:d[end],path,usedCoupon: Boolean(end%2),distances:vertices.map((vertex,i)=>({vertex,unused:d[2*i],used:d[2*i+1]})),trace};
}
const pair=(a,b)=>a<b?a+'|'+b:b+'|'+a;
export function mstCutExplorer(vertices,edges,cut) {
  validateVertices(vertices);
  if(vertices.length>7||!Array.isArray(edges)||edges.length>12||!Array.isArray(cut))throw new RangeError('At most seven vertices, twelve edges, and an array cut are supported');
  const names=new Set(vertices),selected=new Set(cut);
  if(selected.size!==cut.length||!cut.every(x=>names.has(x))||selected.size===0||selected.size===vertices.length)throw new RangeError('Cut must be a nonempty proper vertex subset');
  const seen=new Set();
  for(const e of edges){if(!Array.isArray(e)||e.length!==3||!names.has(e[0])||!names.has(e[1])||e[0]===e[1]||!Number.isSafeInteger(e[2]))throw new RangeError('Provide simple undirected integer-weight edges');
    let k=pair(e[0],e[1]);if(seen.has(k))throw new RangeError('Duplicate undirected edge '+k);seen.add(k);
  }
  const crossing=edges.map(([a,b,w],id)=>({id,weight:w,from:a,to:b})).filter(e=>selected.has(e.from)!==selected.has(e.to));
  const lightWeight=crossing.length?Math.min(...crossing.map(x=>x.weight)):null;
  const light=crossing.filter(e=>e.weight===lightWeight).map(e=>e.id);
  const map=new Map(vertices.map((name,i)=>[name,i]));const minimumTrees=[];let minimumCost=Infinity;
  function consider(chosen){
    const parent=vertices.map((_,i)=>i);
    const find=x=>{while(parent[x]!==x)x=parent[x];return x;};
    let cost=0;
    for(const id of chosen){const [a,b,w]=edges[id],x=find(map.get(a)),y=find(map.get(b));if(x===y)return;parent[x]=y;cost+=w;}
    if(chosen.length!==vertices.length-1)return;
    if(vertices.some((_,i)=>find(i)!==find(0)))return;
    if(cost<minimumCost){minimumCost=cost;minimumTrees.length=0;}
    if(cost===minimumCost)minimumTrees.push(chosen.slice());
  }
  function choose(next,chosen){const need=vertices.length-1-chosen.length;
    if(need===0){consider(chosen);return;}
    for(let i=next;i<=edges.length-need;i++){chosen.push(i);choose(i+1,chosen);chosen.pop();}
  }
  choose(0,[]);
  const forced=light.length===1?light[0]:null;
  return {connected:Number.isFinite(minimumCost),minimumCost:Number.isFinite(minimumCost)?minimumCost:null,minimumTrees,cutCrossing:crossing,lightEdges:light,lightWeight,uniqueLightEdgeId:forced,uniqueLightEdgeInEveryMST:forced===null?null:minimumTrees.length>0&&minimumTrees.every(t=>t.includes(forced))};
}
