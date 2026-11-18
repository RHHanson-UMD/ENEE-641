import test from 'node:test';
import assert from 'node:assert/strict';
import {matrixChain,bruteMatrixChain,lcs,bruteLcsLength,isSubsequence} from '../site/visualizations/dynamic-programming-engine.js';
test('lecture matrix-chain six matrices: total cost and m[2,5]',()=>{
 const p=[30,35,15,5,10,20,25],r=matrixChain(p);
 assert.equal(r.cost,15125);assert.equal(r.stages.at(-1).cost[1][4],7125);
 assert.equal(bruteMatrixChain(p),15125);
 assert.equal(r.stages.length,6);
});
test('matrix-chain simple pairs and three matrices',()=>{
 assert.equal(matrixChain([10,20]).cost,0);
 assert.equal(matrixChain([10,30,5,60]).cost,4500);
 assert.equal(bruteMatrixChain([10,30,5,60]),4500);
});
test('matrix-chain independent cost oracle across short dimensions',()=>{
 const cases=[[3,5,7,2,4],[8,4,2,7],[2,10,2,10,2],[6,7,9,3,5,4]];
 for(const p of cases)assert.equal(matrixChain(p).cost,bruteMatrixChain(p));
});
test('lecture LCS example length four and valid reconstruction',()=>{
 const x='ABCBDAB',y='BDCABA',r=lcs(x,y);
 assert.equal(r.length,4);assert.equal(r.sequence.length,4);
 assert.ok(isSubsequence(r.sequence,x));assert.ok(isSubsequence(r.sequence,y));
 assert.equal(bruteLcsLength(x,y),4);
});
test('LCS oracle for diverse edge cases',()=>{
 for(const [x,y] of [['','ABC'],['ABC',''],['ABC','ABC'],['ABCD','WXYZ'],['AAAB','ABA'],['GAC','AGCAT']]){
  const r=lcs(x,y);
  assert.equal(r.length,bruteLcsLength(x,y));
  assert.ok(isSubsequence(r.sequence,x));assert.ok(isSubsequence(r.sequence,y));
 }
});
test('invalid dimensions rejected',()=>assert.throws(()=>matrixChain([10,0,5])));
