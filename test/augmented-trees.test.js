import test from 'node:test';
import assert from 'node:assert/strict';
import {orderTree,osSelect,osRank,intervalTree,intervalSearch,overlaps,keys,intervals} from '../site/visualizations/augmented-trees-engine.js';
test('order statistics agree with independent sorted ranks',()=>{
 const tree=orderTree(keys),sorted=[...keys].sort((a,b)=>a-b);
 assert.equal(tree.size,keys.length);
 sorted.forEach((key,i)=>{assert.equal(osSelect(tree,i+1).found,key);assert.equal(osRank(tree,key).rank,i+1)});
 assert.equal(osSelect(tree,0).found,null);assert.equal(osRank(tree,5).rank,null);
});
test('order statistic queries work for shuffled and singleton trees',()=>{
 const tree=orderTree([15,5,7,1,9]);
 assert.deepEqual([1,2,3,4,5].map(k=>osSelect(tree,k).found),[1,5,7,9,15]);
 assert.equal(osRank(orderTree([42]),42).rank,1);
});
test('closed interval overlap includes shared endpoints',()=>{
 assert.equal(overlaps([1,4],[4,6]),true);
 assert.equal(overlaps([1,4],[5,6]),false);
 assert.equal(overlaps([5,6],[1,4]),false);
});
test('interval tree agrees with exhaustive intersection existence',()=>{
 const tree=intervalTree(intervals);
 for(let lo=0;lo<=33;lo++)for(let hi=lo;hi<=33;hi++){
  const result=intervalSearch(tree,[lo,hi]);
  const expected=intervals.some(x=>overlaps(x,[lo,hi]));
  assert.equal(Boolean(result.found),expected,JSON.stringify({lo,hi}));
  if(result.found)assert.ok(overlaps(result.found.interval,[lo,hi]));
 }
});
test('queries return no result for empty intervals',()=>{
 assert.equal(intervalSearch(intervalTree([]),[0,1]).found,null);
});
test('invalid keys and intervals rejected',()=>{
 assert.throws(()=>orderTree([1,1]));
 assert.throws(()=>intervalTree([[9,2]]));
 assert.throws(()=>intervalSearch(null,[5,2]));
});
