import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateSubsetSum} from '../site/visualizations/subset-sum-engine.js';
test('site engine matches satisfiability for all assignments',()=>{
  for(let n=0;n<8;n++) {
    const a=[n&1,(n>>1)&1,(n>>2)&1];
    const r=evaluateSubsetSum(a);
    assert.equal(r.formulaSatisfied,r.matchesTarget);
  }
});
