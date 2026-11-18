// Original functional 2–3 tree insertion engine.
// Each node holds 1–2 sorted keys and either 0 or keys.length+1 children.
export function contains(tree,key){
 if(!tree)return false;
 if(tree.keys.includes(key))return true;
 if(!tree.children.length)return false;
 let i=0;while(i<tree.keys.length&&key>tree.keys[i])i++;
 return contains(tree.children[i],key);
}
function insertRec(node,key,events){
 if(!node)return {node:{keys:[key],children:[]},split:null};
 const keys=[...node.keys],children=[...node.children];
 if(!children.length){
  keys.push(key);keys.sort((a,b)=>a-b);
  if(keys.length<=2)return {node:{keys,children:[]},split:null};
  const left={keys:[keys[0]],children:[]},right={keys:[keys[2]],children:[]};
  events.push('Split full leaf ['+keys.join(', ')+']; promote '+keys[1]+'.');
  return {node:null,split:{promoted:keys[1],left,right}};
 }
 let i=0;while(i<keys.length&&key>keys[i])i++;
 const result=insertRec(children[i],key,events);
 if(result.split){
  const {promoted,left,right}=result.split;
  keys.splice(i,0,promoted);children.splice(i,1,left,right);
 }else children[i]=result.node;
 if(keys.length<=2)return {node:{keys,children},split:null};
 const left={keys:[keys[0]],children:children.slice(0,2)};
 const right={keys:[keys[2]],children:children.slice(2)};
 events.push('Split full internal node ['+keys.join(', ')+']; promote '+keys[1]+'.');
 return {node:null,split:{promoted:keys[1],left,right}};
}
export function insert(tree,key){
 if(!Number.isFinite(key)||!Number.isInteger(key))throw Error('Insert an integer key');
 if(contains(tree,key))return {tree,events:['Duplicate key '+key+' ignored.'],added:false};
 const events=[];const result=insertRec(tree,key,events);
 let next=result.node;
 if(result.split){next={keys:[result.split.promoted],children:[result.split.left,result.split.right]};events.push('Create a new root holding '+result.split.promoted+'.');}
 if(!events.length)events.push('Insert '+key+' into a node without splitting.');
 const check=validateTree(next);if(!check.valid)throw Error('Invariant broken: '+check.reason);
 return {tree:next,events,added:true};
}
export function validateTree(tree){
 if(!tree)return {valid:true,height:0,count:0};
 let leafDepth=null,count=0,reason='';
 function walk(node,lo,hi,depth){
  if(!node||!Array.isArray(node.keys)||!Array.isArray(node.children)||node.keys.length<1||node.keys.length>2){reason='Node capacity';return false;}
  if(node.keys.some((x,i)=>!Number.isInteger(x)||x<=lo||x>=hi||(i>0&&x<=node.keys[i-1]))){reason='Key ordering';return false;}
  count+=node.keys.length;
  if(!node.children.length){
   if(leafDepth===null)leafDepth=depth;
   if(leafDepth!==depth){reason='Unequal leaf depths';return false;}
   return true;
  }
  if(node.children.length!==node.keys.length+1){reason='Child count';return false;}
  const bounds=[lo,...node.keys,hi];
  return node.children.every((c,i)=>walk(c,bounds[i],bounds[i+1],depth+1));
 }
 const valid=walk(tree,-Infinity,Infinity,0);
 return {valid,height:(leafDepth??0)+1,count,reason};
}
export function build(values){
 let tree=null;const states=[{tree:null,inserted:null,events:['Empty tree']}];
 for(const key of values){const result=insert(tree,key);tree=result.tree;states.push({tree,inserted:key,events:result.events});}
 return {tree,states};
}
