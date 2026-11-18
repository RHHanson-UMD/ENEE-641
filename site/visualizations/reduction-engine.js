// Original 3-CNF example for teaching Chapter 34 reductions; not a copied textbook diagram.
const l=(variable,positive)=>({variable,positive});
/** CLRS 2nd ed. Fig. 34.14 / Chapter34Nov5-2026.pptx slide 29.
 * Source clause values only; graph geometry is independently rendered. */
export const formulaExamples={
  source:{
    id:'clrs-34-14',
    label:'Figure 34.14 — exact source clauses',
    provenance:'CLRS 2nd ed., Figure 34.14; ENEE 641 slide 29 — original rendering',
    assignment:[0,0,1],
    preferredLiteralIndices:[1,2,2],
    clauses:[
      [l(0,true),l(1,false),l(2,false)],
      [l(0,false),l(1,true),l(2,true)],
      [l(0,true),l(1,true),l(2,true)]
    ]
  },
  practice:{
    id:'practice-3cnf',
    label:'Practice — alternative satisfiable 3-CNF',
    provenance:'Independently authored 3-CNF formula; not Figure 34.14',
    assignment:[0,0,0],
    clauses:[
      [l(0,true),l(1,false),l(2,true)],
      [l(0,false),l(1,true),l(2,true)],
      [l(0,false),l(1,false),l(2,false)]
    ]
  },
  impossible:{
    id:'practice-unsatisfiable',
    label:'Practice — contradictory clauses (UNSAT)',
    provenance:'Independently authored repeated-literal counterexample; not Figure 34.14',
    assignment:[0,1,0],
    clauses:[
      [l(0,true),l(0,true),l(0,true)],
      [l(0,false),l(0,false),l(0,false)],
      [l(1,true),l(1,true),l(1,true)]
    ]
  }
};
export const clauses=formulaExamples.source.clauses;
export function literalTrue(lit,assignment){return Boolean(assignment[lit.variable])===lit.positive;}
export function formulaSatisfied(formula,assignment){return formula.every(clause=>clause.some(l=>literalTrue(l,assignment)));}
export function reductionGraph(formula){
 if(!Array.isArray(formula)||!formula.length||formula.length>8||formula.some(c=>!Array.isArray(c)||!c.length||c.length>8))throw Error('Invalid clauses');
 const vertices=formula.flatMap((clause,ci)=>clause.map((lit,li)=>({id:ci+':'+li,clause:ci,...lit})));
 const edges=[];
 for(let i=0;i<vertices.length;i++)for(let j=i+1;j<vertices.length;j++){
  const x=vertices[i],y=vertices[j];
  if(x.clause!==y.clause && !(x.variable===y.variable&&x.positive!==y.positive))edges.push([i,j]);
 }
 return {vertices,edges,k:formula.length};
}
export function isClique(vertices,edges,ids){
 if(new Set(ids).size!==ids.length||ids.some(x=>x<0||x>=vertices.length))return false;
 const edgeSet=new Set(edges.map(([a,b])=>a+':'+b));
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
  const u=Math.min(ids[i],ids[j]),v=Math.max(ids[i],ids[j]);
  if(!edgeSet.has(u+':'+v))return false;
 }
 return true;
}
export function findClique(graph,k=graph.k){
 const {vertices,edges}=graph;
 function search(start,chosen){
  if(chosen.length===k)return isClique(vertices,edges,chosen)?chosen:null;
  for(let i=start;i<=vertices.length-(k-chosen.length);i++){
   const result=search(i+1,[...chosen,i]);if(result)return result;
  }
  return null;
 }
 return search(0,[]);
}
export function complementGraph(graph){
 const n=graph.vertices.length, edgeSet=new Set(graph.edges.map(([u,v])=>u+':'+v));
 const edges=[];
 for(let u=0;u<n;u++)for(let v=u+1;v<n;v++)if(!edgeSet.has(u+':'+v))edges.push([u,v]);
 return {...graph,edges};
}
export function isVertexCover(graph,cover){
 const s=new Set(cover);
 return graph.edges.every(([u,v])=>s.has(u)||s.has(v));
}
export function selectedCompatible(graph,assignment,preferredLiteralIndices=[]){
 const candidates=graph.vertices.map((v,i)=>literalTrue(v,assignment)?i:-1);
 const byClause=Array.from({length:graph.k},(_,clause)=>{
  const preferred=preferredLiteralIndices[clause],id=clause+':'+preferred;
  const chosen=candidates.find(i=>i>=0&&graph.vertices[i].id===id);
  return chosen!==undefined?chosen:candidates.find(i=>i>=0&&graph.vertices[i].clause===clause);
 });
 return byClause.every(i=>i!==undefined)?byClause:[];
}
export function enumerateAssignments(n){
 return Array.from({length:1<<n},(_,mask)=>Array.from({length:n},(_,i)=>Boolean(mask&(1<<i))));
}
