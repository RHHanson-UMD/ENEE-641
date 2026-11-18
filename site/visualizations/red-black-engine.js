// Original Chapter 13 CLRS-style red-black insertion with recorded repair cases.
// Internal nodes use parent pointers; missing (null) children are BLACK NIL leaves.
function color(node){return node?.color??'B'}
export function contains(node,key){while(node){if(key===node.key)return true;node=key<node.key?node.left:node.right;}return false;}
export function insert(root,key){
 if(!Number.isSafeInteger(key))throw Error('Use a safe integer key');
 if(contains(root,key))return {root,events:['Duplicate '+key+' ignored.'],added:false};
 const events=[];
 const z={key,color:'R',left:null,right:null,parent:null};let p=null,x=root;
 while(x){p=x;x=key<x.key?x.left:x.right;}
 z.parent=p;
 if(!p)root=z;else if(key<p.key)p.left=z;else p.right=z;
 events.push('Insert '+key+' as a red BST node.');
 function leftRotate(x){
  const y=x.right;if(!y)throw Error('Missing right child for rotation');
  x.right=y.left;if(y.left)y.left.parent=x;
  y.parent=x.parent;
  if(!x.parent)root=y;else if(x===x.parent.left)x.parent.left=y;else x.parent.right=y;
  y.left=x;x.parent=y;events.push('Rotate left around '+x.key+'.');
 }
 function rightRotate(x){
  const y=x.left;if(!y)throw Error('Missing left child for rotation');
  x.left=y.right;if(y.right)y.right.parent=x;
  y.parent=x.parent;
  if(!x.parent)root=y;else if(x===x.parent.left)x.parent.left=y;else x.parent.right=y;
  y.right=x;x.parent=y;events.push('Rotate right around '+x.key+'.');
 }
 let cur=z;
 while(cur.parent&&color(cur.parent)==='R'){
  const gp=cur.parent.parent;if(!gp)throw Error('Red parent without grandparent');
  if(cur.parent===gp.left){
   const uncle=gp.right;
   if(color(uncle)==='R'){
    cur.parent.color='B';uncle.color='B';gp.color='R';
    events.push('Case 1: red uncle; recolor parent and uncle black, grandparent red.');cur=gp;
   }else{
    if(cur===cur.parent.right){
     cur=cur.parent;events.push('Case 2: inner child with black uncle.');leftRotate(cur);
    }
    cur.parent.color='B';cur.parent.parent.color='R';
    events.push('Case 3: outer child with black uncle; recolor and rotate.');rightRotate(cur.parent.parent);
   }
  }else{
   const uncle=gp.left;
   if(color(uncle)==='R'){
    cur.parent.color='B';uncle.color='B';gp.color='R';
    events.push('Mirror case 1: red uncle; recolor.');cur=gp;
   }else{
    if(cur===cur.parent.left){
     cur=cur.parent;events.push('Mirror case 2: inner child with black uncle.');rightRotate(cur);
    }
    cur.parent.color='B';cur.parent.parent.color='R';
    events.push('Mirror case 3: outer child with black uncle.');leftRotate(cur.parent.parent);
   }
  }
 }
 root.color='B';
 const result=verify(root);
 if(!result.valid)throw Error('Red-black invariant broken: '+result.reason);
 return {root,events,added:true};
}
export function snapshot(node){return node?{key:node.key,color:node.color,left:snapshot(node.left),right:snapshot(node.right)}:null;}
export function verify(root){
 if(!root)return {valid:true,reason:'',size:0,height:0,blackHeight:1};
 if(root.color!=='B')return {valid:false,reason:'Root is red'};
 function walk(n,lo,hi){
  if(!n)return {valid:true,size:0,height:0,blackHeight:1,reason:''};
  if(n.key<=lo||n.key>=hi||!['R','B'].includes(n.color))return {valid:false,reason:'Invalid key ordering or color'};
  if(n.color==='R'&&(color(n.left)==='R'||color(n.right)==='R'))return {valid:false,reason:'Two consecutive red nodes'};
  const l=walk(n.left,lo,n.key),r=walk(n.right,n.key,hi);
  if(!l.valid)return l;if(!r.valid)return r;
  if(l.blackHeight!==r.blackHeight)return {valid:false,reason:'Unequal black heights'};
  return {valid:true,reason:'',size:1+l.size+r.size,height:1+Math.max(l.height,r.height),blackHeight:l.blackHeight+(n.color==='B'?1:0)};
 }
 const result=walk(root,-Infinity,Infinity);
 if(result.valid&&result.height>2*Math.log2(result.size+1)+1e-9)return {...result,valid:false,reason:'Height bound exceeded'};
 return result;
}
export function build(keys){
 let root=null;const states=[{tree:null,events:['Start with black NIL sentinel leaves.'],key:null}];
 for(const key of keys){const r=insert(root,key);root=r.root;states.push({tree:snapshot(root),events:r.events,key})}
 return {root,states};
}
