import test from 'node:test';import assert from 'node:assert/strict';
import {tiledMatmulModel,multiplyByTiles,independentProduct} from '../site/visualizations/tiled-matmul-engine.js';
test('source tile 500 vs 100: 25x fast storage, 500x vs 100x ideal reads',()=>{
 const x=tiledMatmulModel(1000,500),y=tiledMatmulModel(1000,100);
 assert.equal(x.idealInputReadReduction,500);assert.equal(y.idealInputReadReduction,100);
 assert.equal(x.fastMemoryMin/y.fastMemoryMin,25);assert.equal(x.blockProducts,8);assert.equal(y.blockProducts,1000);
 assert.equal(x.innerProducts,1e9);
});
test('original independent matrix oracle for varied tiles and negative entries',()=>{
 let seed=7;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return (seed%13)-6};
 for(const n of [1,2,3,4,6,8]){const A=Array.from({length:n},()=>Array.from({length:n},rand)),B=Array.from({length:n},()=>Array.from({length:n},rand));
  for(let b=1;b<=n;b++)if(n%b===0){const x=multiplyByTiles(A,B,b);
    assert.deepEqual(x.matrix,independentProduct(A,B));
    assert.equal(x.steps.length,(n/b)**3);
    assert.deepEqual(x.steps.at(-1).matrix,x.matrix);
  }}
});
test('boundary and invalid model values',()=>{
 assert.equal(tiledMatmulModel(1,1).idealInputReadReduction,1);
 assert.throws(()=>tiledMatmulModel(1000,64),RangeError);
 assert.throws(()=>tiledMatmulModel(0,1),RangeError);
 assert.throws(()=>multiplyByTiles([[1,2]],[[1]],1),RangeError);
});
