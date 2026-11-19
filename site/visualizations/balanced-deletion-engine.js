/**
 * Original deletion demonstrations for course-owned red-black and 2–3 trees.
 * Existing insert engines use strict distinct keys and black implicit NILs.
 * These functions mutate existing nodes and return invariant-checked roots.
 * Source themes: Chapter13Sept29-2026, Chapter18substituteOct1-2026.
 * Initial examples are independent and not a claim of slide-figure fidelity.
 */
import {contains as rbContains,verify as verifyRB} from './red-black-engine.js';
import {contains as ttContains,validateTree as verify23} from './two-three-tree-engine.js';
const color=n=>n?.color||'B';
export function redBlackDelete(tree,key){
 if(!Number.isSafeInteger(key))throw new RangeError('Use a safe integer');
 if(!rbContains(tree,key))return {root:tree,removed:false,events:['Missing key; tree unchanged']};
 const events=[],N={color:'B',isNil:true,left:null,right:null,parent:null};N.left=N;N.right=N;let root=tree;
 function attach(n){if(!n)return N;n.left=attach(n.left);if(n.left!==N)n.left.parent=n;n.right=attach(n.right);if(n.right!==N)n.right.parent=n;return n;}
 root=attach(root);root.parent=N;
 const leftRotate=x=>{let y=x.right;x.right=y.left;if(y.left!==N)y.left.parent=x;y.parent=x.parent;if(x.parent===N)root=y;else if(x===x.parent.left)x.parent.left=y;else x.parent.right=y;y.left=x;x.parent=y;events.push('Rotate left around '+x.key)};
 const rightRotate=x=>{let y=x.left;x.left=y.right;if(y.right!==N)y.right.parent=x;y.parent=x.parent;if(x.parent===N)root=y;else if(x===x.parent.left)x.parent.left=y;else x.parent.right=y;y.right=x;x.parent=y;events.push('Rotate right around '+x.key)};
 const transplant=(u,v)=>{if(u.parent===N)root=v;else if(u===u.parent.left)u.parent.left=v;else u.parent.right=v;v.parent=u.parent;};
 const min=x=>{while(x.left!==N)x=x.left;return x};
 let z=root;while(z!==N&&z.key!==key)z=key<z.key?z.left:z.right;
 let y=z,orig=y.color,x;
 if(z.left===N){x=z.right;transplant(z,z.right);}
 else if(z.right===N){x=z.left;transplant(z,z.left);}
 else {y=min(z.right);orig=y.color;x=y.right;if(y.parent===z)x.parent=y;else{transplant(y,y.right);y.right=z.right;y.right.parent=y;}transplant(z,y);y.left=z.left;y.left.parent=y;y.color=z.color;events.push('Transplant inorder successor '+y.key+' to replace '+key);}
 if(orig==='B'){
  while(x!==root&&color(x)==='B'){
   if(x===x.parent.left){
    let w=x.parent.right;
    if(color(w)==='R'){w.color='B';x.parent.color='R';leftRotate(x.parent);w=x.parent.right;events.push('Delete fixup 1: red sibling');}
    if(color(w.left)==='B'&&color(w.right)==='B'){if(w!==N)w.color='R';events.push('Delete fixup 2: two black sibling children');x=x.parent;}
    else {if(color(w.right)==='B'){if(w.left!==N)w.left.color='B';w.color='R';rightRotate(w);w=x.parent.right;events.push('Delete fixup 3: near red child');}
     w.color=x.parent.color;x.parent.color='B';if(w.right!==N)w.right.color='B';leftRotate(x.parent);events.push('Delete fixup 4: far red child');x=root;}
   } else {
    let w=x.parent.left;
    if(color(w)==='R'){w.color='B';x.parent.color='R';rightRotate(x.parent);w=x.parent.left;events.push('Mirror delete fixup 1: red sibling');}
    if(color(w.right)==='B'&&color(w.left)==='B'){if(w!==N)w.color='R';events.push('Mirror delete fixup 2: two black sibling children');x=x.parent;}
    else {if(color(w.left)==='B'){if(w.right!==N)w.right.color='B';w.color='R';leftRotate(w);w=x.parent.left;events.push('Mirror delete fixup 3: near red child');}
     w.color=x.parent.color;x.parent.color='B';if(w.left!==N)w.left.color='B';rightRotate(x.parent);events.push('Mirror delete fixup 4: far red child');x=root;}
   }
  }x.color='B';
 }
 if(root===N)root=null;else{root.parent=null;function detach(node){if(!node||node===N)return null;node.left=detach(node.left);if(node.left)node.left.parent=node;node.right=detach(node.right);if(node.right)node.right.parent=node;return node;}root=detach(root);root.color='B';}
 const valid=verifyRB(root);if(!valid.valid)throw new Error('RB delete invariant violated: '+valid.reason);
 if(!events.length)events.push('Removed key '+key+' with no balancing rotation required');
 return {root,removed:true,events};
}
export function twoThreeDelete(tree,key){
 if(!Number.isSafeInteger(key))throw new RangeError('Use a safe integer');
 if(!ttContains(tree,key))return {tree,removed:false,events:['Missing key; tree unchanged']};
 const events=[];
 function repair(parent,i){
  const child=parent.children[i];if(child.keys.length>0)return;
  const left=i>0?parent.children[i-1]:null,right=i+1<parent.children.length?parent.children[i+1]:null;
  if(left&&left.keys.length===2){child.keys.unshift(parent.keys[i-1]);parent.keys[i-1]=left.keys.pop();if(left.children.length)child.children.unshift(left.children.pop());events.push('Borrow from left sibling; rotate separator down');return;}
  if(right&&right.keys.length===2){child.keys.push(parent.keys[i]);parent.keys[i]=right.keys.shift();if(right.children.length)child.children.push(right.children.shift());events.push('Borrow from right sibling; rotate separator down');return;}
  if(left){left.keys.push(parent.keys[i-1],...child.keys);left.children.push(...child.children);parent.keys.splice(i-1,1);parent.children.splice(i,1);events.push('Merge deficient node into left sibling');}
  else if(right){child.keys.push(parent.keys[i],...right.keys);child.children.push(...right.children);parent.keys.splice(i,1);parent.children.splice(i+1,1);events.push('Merge right sibling into deficient node');}
 }
 function remove(node,k){
  const index=node.keys.indexOf(k);
  if(!node.children.length){if(index>=0){node.keys.splice(index,1);events.push('Remove '+k+' from leaf');}return node.keys.length===0;}
  let childIndex;
  if(index>=0){childIndex=index;let pred=node.children[index];while(pred.children.length)pred=pred.children.at(-1);const replacement=pred.keys.at(-1);node.keys[index]=replacement;events.push('Replace internal '+k+' by predecessor '+replacement);remove(node.children[childIndex],replacement);}
  else {childIndex=0;while(childIndex<node.keys.length&&k>node.keys[childIndex])childIndex++;remove(node.children[childIndex],k);}
  if(node.children[childIndex].keys.length===0)repair(node,childIndex);
  return node.keys.length===0;
 }
 remove(tree,key);
 if(tree.keys.length===0){tree=tree.children.length?tree.children[0]:null;events.push('Contract empty root');}
 const valid=verify23(tree);if(!valid.valid)throw new Error('2–3 delete invariant violated: '+valid.reason);
 return {tree,removed:true,events};
}
