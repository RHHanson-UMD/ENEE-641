// Original teaching model: CLRS Chapter 35 APPROX-VERTEX-COVER.
// Edges use two zero-based integer vertex identifiers.
export function validateGraph(n, edges) {
  if (!Number.isInteger(n) || n < 1 || n > 16 || !Array.isArray(edges)) throw Error('Invalid graph size or edges');
  for (const e of edges) if (!Array.isArray(e) || e.length !== 2 || !e.every(Number.isInteger) || e[0] < 0 || e[1] < 0 || e[0] >= n || e[1] >= n || e[0] === e[1]) throw Error('Invalid edge');
}
export function isCover(n, edges, vertices) {
  validateGraph(n, edges);
  const s = new Set(vertices);
  return edges.every(([u,v]) => s.has(u) || s.has(v));
}
export function approxVertexCover(n, edges, preferredOrder = edges.map((_, i) => i)) {
  validateGraph(n, edges);
  const remaining = new Set(edges.map((_,i) => i));
  const steps = [];
  const cover = new Set();
  const matching = [];
  for (const i of preferredOrder) {
    if (!remaining.has(i)) continue;
    const [u,v] = edges[i];
    cover.add(u); cover.add(v); matching.push(i);
    const discarded = [...remaining].filter(j => edges[j].some(w => w === u || w === v));
    discarded.forEach(j => remaining.delete(j));
    steps.push({picked:i, discarded, cover:[...cover].sort((a,b)=>a-b), remaining:[...remaining]});
  }
  if (remaining.size) throw Error('Order does not include every eligible edge');
  return {cover:[...cover].sort((a,b)=>a-b), matching, steps};
}
export function optimumCover(n, edges) {
  validateGraph(n, edges);
  for (let size=0; size<=n; size++) {
    for (let mask=0; mask<(1<<n); mask++) {
      let count=0; for(let i=0;i<n;i++) count+=(mask>>i)&1;
      if(count!==size) continue;
      const vertices = Array.from({length:n}, (_,i)=>i).filter(i=>(mask>>i)&1);
      if(isCover(n,edges,vertices)) return vertices;
    }
  }
  throw Error('No cover found');
}
