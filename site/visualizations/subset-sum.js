import {TARGET, NUMBERS, evaluateSubsetSum} from './subset-sum-engine.js';
const controls=[0,1,2].map(i=>document.getElementById(`input-${i}`));
const rowsRoot=document.getElementById('number-rows');
const allToggle=document.getElementById('show-all');
const summary=document.getElementById('result-state');
const resultNumber=document.getElementById('result-number');
const assignmentResult=document.querySelector('.assignment-result');
const explanations=[
  'One true literal contributes 1. Select both slack numbers (1 + 2) to reach 4.',
  'Two true literals contribute 2. Select the 2-valued slack number to reach 4.',
  'Three true literals contribute 3. Select the 1-valued slack number to reach 4.',
  'No true literals: both slack numbers add at most 3, so this digit cannot reach 4.'
];
function prettyLabel(label) {
  const s=document.createElement('span');
  s.textContent=label;
  return s;
}
function draw() {
  const a=controls.map(el=>Number(el.value));
  const result=evaluateSubsetSum(a);
  const picked=new Set(result.selectedLabels);
  rowsRoot.replaceChildren();
  NUMBERS.forEach(r=>{
    const included=picked.has(r.label);
    if(!allToggle.checked && !included) return;
    const tr=document.createElement('tr');
    if(included) tr.classList.add('is-picked');
    const th=document.createElement('th');th.scope='row';th.append(prettyLabel(r.label));
    th.setAttribute('aria-label',`${r.label}: ${included?'selected':'not selected'}`);
    tr.append(th);
    [...r.digits].forEach(v=>{const td=document.createElement('td');td.textContent=v;if(v==='0')td.classList.add('is-zero');tr.append(td);});
    rowsRoot.append(tr);
  });
  result.digits.forEach((digit,i)=>{
    const el=document.getElementById(`sum-${i}`);
    el.textContent=String(digit);
    el.classList.toggle('is-match',digit===(i<3?1:4));
    el.classList.toggle('is-mismatch',digit!==(i<3?1:4));
  });
  const sat=result.formulaSatisfied;
  const matches=result.matchesTarget;
  summary.textContent=matches?'Target reached - satisfying assignment':'Target not reached - unsatisfied clause';
  resultNumber.textContent=result.digits.join('');
  assignmentResult.classList.toggle('is-failed',!matches);
  for(let i=0;i<4;i++){
    const c=document.getElementById(`clause-${i}`);
    const g=document.getElementById(`gate-${i}`);
    c.textContent=result.clauses[i]?'1':'0';
    c.classList.toggle('false',!result.clauses[i]);
    g.textContent=`OR ${result.clauses[i]?'1':'0'}`;
    g.classList.toggle('false',!result.clauses[i]);
  }
  const andGate=document.getElementById('final-gate');
  andGate.textContent=`AND ${sat?'1':'0'}`;
  andGate.classList.toggle('false',!sat);
  const failed=result.clauseCounts.findIndex(c=>c===0);
  const text=failed===-1
    ? `All four clauses are satisfied. True literal counts are ${result.clauseCounts.join(', ')}; the chosen slack numbers complete every clause digit to 4.`
    : `Clause C${failed+1} has no true literals. It contributes 0, and its two slack numbers add only 1 + 2 = 3. The selected sum cannot equal ${TARGET}.`;
  document.getElementById('explanation').textContent=text;
}
controls.forEach(el=>el.addEventListener('change',draw));
allToggle.addEventListener('change',draw);
document.getElementById('reset-assignment').addEventListener('click',()=>{
  [0,0,1].forEach((v,i)=>{controls[i].value=String(v);});
  allToggle.checked=true;
  draw();
});
draw();
