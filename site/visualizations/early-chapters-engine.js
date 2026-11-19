/**
 * Original independent algorithms for the ENEE 641 early-chapter explorers.
 * Internal arrays are 0-based. Chapter 6's lecture introduces 1-based heap formulas;
 * the UI explicitly identifies the translation.
 * No private slides, artwork, homework, or instructor code is reproduced.
 */
export function heapSortTrace(values) {
  if (!Array.isArray(values) || values.length > 60 || values.some(x => !Number.isFinite(x))) throw new RangeError('Provide up to 60 finite numbers');
  const a=values.slice(), steps=[];
  const save=(stage,focus=[],heapSize=a.length)=>steps.push({stage,values:a.slice(),focus:focus.slice(),heapSize});
  const sift=(start,size,phase)=>{
    let i=start;
    while(true) {
      const l=2*i+1,r=l+1;
      let largest=i;
      if(l<size && a[l]>a[largest]) largest=l;
      if(r<size && a[r]>a[largest]) largest=r;
      if(largest===i)break;
      [a[i],a[largest]]=[a[largest],a[i]];
      save(phase+' — swap', [i,largest],size);
      i=largest;
    }
  };
  save('Input');
  for(let i=Math.floor(a.length/2)-1;i>=0;i--) {sift(i,a.length,'Build max heap');save('Heapify at node '+(i+1),[i]);}
  save('Max heap built');
  for(let end=a.length-1;end>0;end--){[a[0],a[end]]=[a[end],a[0]];save('Move maximum into sorted suffix',[0,end],end);sift(0,end,'Restore remaining heap');}
  save('Sorted',[],0);
  return {sorted:a,steps,build:steps.find(x=>x.stage==='Max heap built')?.values||[]};
}
export function stableCountingSort(records,k) {
  if(!Array.isArray(records)||!Number.isInteger(k)||k<0||k>10000||records.some(r=>!Number.isInteger(r.key)||r.key<0||r.key>k)) throw new RangeError('Integer record keys must be in 0..k');
  const counts=Array(k+1).fill(0);for(const r of records)counts[r.key]++;
  const starts=counts.slice();for(let i=1;i<starts.length;i++)starts[i]+=starts[i-1];
  const out=Array(records.length);for(let i=records.length-1;i>=0;i--){const r=records[i];out[--starts[r.key]]=r;}
  return {sorted:out,counts};
}
export function stableRadixSort(values,base=10) {
  if(!Array.isArray(values)||values.some(x=>!Number.isSafeInteger(x)||x<0)||!Number.isInteger(base)||base<2||base>10000)throw new RangeError('Nonnegative safe integers and base 2..10000 required');
  let out=values.map((n,i)=>({key:n,id:i})),exp=1;
  const rounds=[],max=Math.max(0,...values);
  while(exp<=max){const c=stableCountingSort(out.map(x=>({...x,digit:Math.floor(x.key/exp)%base,key:Math.floor(x.key/exp)%base,original:x.key})),base-1);
    out=c.sorted.map(x=>({key:x.original,id:x.id}));rounds.push({digitPlace:exp,values:out.map(x=>x.key)});if(exp>Number.MAX_SAFE_INTEGER/base)break;exp*=base;}
  return {sorted:out.map(x=>x.key),rounds};
}
export function bucketSort(values) {
  if(!Array.isArray(values)||values.some(x=>!Number.isFinite(x)||x<0||x>=1))throw new RangeError('Bucket sort assumes 0 <= x < 1');
  const buckets=Array.from({length:Math.max(1,values.length)},()=>[]);
  for(const x of values)buckets[Math.floor(x*buckets.length)].push(x);
  for(const b of buckets)b.sort((x,y)=>x-y);
  return {buckets,sorted:buckets.flat()};
}
export function bstInsert(root,key) {
  if(!Number.isFinite(key))throw new RangeError('Finite key required');
  if(!root)return {key,left:null,right:null};
  if(key<root.key)root.left=bstInsert(root.left,key);else root.right=bstInsert(root.right,key);
  return root;
}
export function bstInorder(root) {return root?[...bstInorder(root.left),root.key,...bstInorder(root.right)]:[];}
export function bstSearchPath(root,key) {const path=[];let node=root;while(node){path.push(node.key);if(key===node.key)return {found:true,path};node=key<node.key?node.left:node.right;}return {found:false,path};}
export function bstDelete(root,key) {
  if(!root)return null;
  if(key<root.key){root.left=bstDelete(root.left,key);return root;}
  if(key>root.key){root.right=bstDelete(root.right,key);return root;}
  if(!root.left)return root.right;
  if(!root.right)return root.left;
  let succ=root.right;while(succ.left)succ=succ.left;
  root.key=succ.key;root.right=bstDelete(root.right,succ.key);return root;
}
export function bstHeight(root){return root?1+Math.max(bstHeight(root.left),bstHeight(root.right)):-1;}
