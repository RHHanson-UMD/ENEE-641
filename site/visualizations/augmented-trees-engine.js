// Chapter 14 augmented-tree teaching examples on static balanced BSTs.
// The lecture uses red-black trees for dynamic updates; these demos deliberately
// isolate the query invariants and do not claim to implement RB rotations.
export function orderTree(keys){
 if(!Array.isArray(keys)||keys.some(x=>!Number.isFinite(x))||new Set(keys).size!==keys.length)throw Error('Keys must be distinct finite numbers');
 const sorted=[...keys].sort((a,b)=>a-b);
 function make(a){if(!a.length)return null;const m=Math.floor(a.length/2),left=make(a.slice(0,m)),right=make(a.slice(m+1));
  return {key:a[m],left,right,size:1+(left?.size||0)+(right?.size||0)}}
 return make(sorted);
}
export function osSelect(tree,k){
 if(!tree||!Number.isInteger(k)||k<1||k>tree.size)return {found:null,trace:[]};
 const trace=[];let node=tree,target=k;
 while(node){const left=node.left?.size||0,relative=left+1;trace.push({key:node.key,leftSize:left,relative,target});
  if(target===relative)return {found:node.key,trace};
  if(target<relative)node=node.left;else{target-=relative;node=node.right}
 }
 return {found:null,trace};
}
export function osRank(tree,key){
 let node=tree,rank=0;const trace=[];
 while(node){const left=node.left?.size||0;trace.push({key:node.key,rankBefore:rank,leftSize:left});
  if(key===node.key)return {rank:rank+left+1,trace};
  if(key<node.key)node=node.left;
  else{rank+=left+1;node=node.right;}
 }
 return {rank:null,trace};
}
export function overlaps(a,b){return a[0]<=b[1]&&b[0]<=a[1];}
export function intervalTree(intervals){
 if(!Array.isArray(intervals)||intervals.some(x=>!Array.isArray(x)||x.length!==2||x.some(v=>!Number.isFinite(v))||x[0]>x[1]))throw Error('Invalid closed intervals');
 const sorted=intervals.map((range,id)=>({range,id})).sort((a,b)=>a.range[0]-b.range[0]||a.id-b.id);
 function make(a){if(!a.length)return null;const m=Math.floor(a.length/2),left=make(a.slice(0,m)),right=make(a.slice(m+1));
  return {id:a[m].id,interval:a[m].range,left,right,max:Math.max(a[m].range[1],left?.max??-Infinity,right?.max??-Infinity)}}
 return make(sorted);
}
export function intervalSearch(tree,query){
 if(!Array.isArray(query)||query.length!==2||query[0]>query[1])throw Error('Invalid query');
 let node=tree;const trace=[];
 while(node){
  const hit=overlaps(node.interval,query);
  trace.push({id:node.id,interval:node.interval,max:node.max,leftMax:node.left?.max??-Infinity,hit});
  if(hit)return {found:node,trace};
  if(node.left&&node.left.max>=query[0])node=node.left;else node=node.right;
 }
 return {found:null,trace};
}
export const keys=[4,8,12,16,20,24,28,32,36];
export const intervals=[[1,5],[4,9],[8,10],[12,18],[15,20],[21,25],[24,30]];
