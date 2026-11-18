/**
 * Figure 34.13 mathematical structure, verified visually against
 * ENEE 641 Chapter34Nov5-2026.pptx slide 27 / CLRS 2nd ed.
 * Original positions, not copied textbook artwork.
 *
 * Other scenarios are deliberately abstract DAGs. They do NOT claim
 * any new problem is NP-complete.
 */
export const scenarios = {
  source: {
    id: 'clrs-34-13',
    title: 'Figure 34.13 — textbook reduction map',
    provenance: 'CLRS 2nd ed., Figure 34.13; ENEE 641 slide 27 — original rendering',
    nodes: [
      {id:'circuit',label:'CIRCUIT-SAT',x:90,y:185},
      {id:'sat',label:'SAT',x:255,y:185},
      {id:'cnf',label:'3-CNF-SAT',x:395,y:185},
      {id:'clique',label:'CLIQUE',x:535,y:105},
      {id:'cover',label:'VERTEX-COVER',x:690,y:105},
      {id:'ham',label:'HAM-CYCLE',x:845,y:105},
      {id:'tsp',label:'TSP',x:980,y:105},
      {id:'subset',label:'SUBSET-SUM',x:575,y:285}
    ],
    edges:[
      ['circuit','sat'],['sat','cnf'],['cnf','clique'],
      ['clique','cover'],['cover','ham'],['ham','tsp'],
      ['cnf','subset']
    ],
    initialFrom:'circuit',
    initialTo:'tsp'
  },
  chain: {
    id:'practice-chain',
    title:'Practice — simple chain',
    provenance:'Original abstract DAG — not a textbook figure or complexity classification',
    nodes:[
      {id:'A',label:'A',x:140,y:180},{id:'B',label:'B',x:380,y:180},
      {id:'C',label:'C',x:630,y:180},{id:'D',label:'D',x:865,y:180}
    ],
    edges:[['A','B'],['B','C'],['C','D']],
    initialFrom:'A',initialTo:'D'
  },
  fork: {
    id:'practice-fork',
    title:'Practice — fork and join',
    provenance:'Original abstract DAG — not a textbook figure or complexity classification',
    nodes:[
      {id:'P',label:'P',x:120,y:190},{id:'Q',label:'Q',x:385,y:90},
      {id:'R',label:'R',x:385,y:290},{id:'S',label:'S',x:700,y:190},
      {id:'T',label:'T',x:930,y:190}
    ],
    edges:[['P','Q'],['P','R'],['Q','S'],['R','S'],['S','T']],
    initialFrom:'P',initialTo:'T'
  }
};

export function validateDAG(graph) {
  if(!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges) || graph.nodes.length<2)
    throw Error('Invalid graph shape');
  const ids=graph.nodes.map(n=>n.id),allowed=new Set(ids);
  if(allowed.size!==ids.length || ids.some(id=>typeof id!=='string'||!id))throw Error('Invalid node IDs');
  const edgeSet=new Set();
  const outgoing=new Map(ids.map(id=>[id,[]]));
  for(const edge of graph.edges){
    if(!Array.isArray(edge)||edge.length!==2||!allowed.has(edge[0])||!allowed.has(edge[1])||edge[0]===edge[1])
      throw Error('Invalid directed edge');
    const key=edge[0]+'\u0000'+edge[1];
    if(edgeSet.has(key))throw Error('Duplicate edge');
    edgeSet.add(key);outgoing.get(edge[0]).push(edge[1]);
  }
  const indeg=new Map(ids.map(id=>[id,0]));
  for(const [,v] of graph.edges)indeg.set(v,indeg.get(v)+1);
  const queue=ids.filter(id=>indeg.get(id)===0);let visited=0;
  for(let k=0;k<queue.length;k++){
    const u=queue[k];visited++;
    for(const v of outgoing.get(u)){indeg.set(v,indeg.get(v)-1);if(indeg.get(v)===0)queue.push(v);}
  }
  if(visited!==ids.length)throw Error('Reduction graph contains a directed cycle');
  return true;
}

export function reductionPath(graph,from,to){
  validateDAG(graph);
  const allowed=new Set(graph.nodes.map(n=>n.id));
  if(!allowed.has(from)||!allowed.has(to))throw Error('Unknown problem node');
  const queue=[from],parents=new Map([[from,null]]);
  for(let i=0;i<queue.length;i++){
    const u=queue[i];if(u===to)break;
    for(const [a,b] of graph.edges)if(a===u&&!parents.has(b)){
      parents.set(b,u);queue.push(b);
    }
  }
  if(!parents.has(to))return [];
  const path=[];let node=to;
  while(node!==null){path.unshift(node);node=parents.get(node);}
  return path;
}

export function reductionSteps(path){
  return path.slice(1).map((to,i)=>({from:path[i],to,index:i+1}));
}
