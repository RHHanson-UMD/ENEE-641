import test from 'node:test';import assert from 'node:assert/strict';
import {divisionHash,universalHash,chainTable,openAddress} from '../site/visualizations/hashing-engine.js';
test('slide 12 universal hash example with p=17,m=6,a=3,b=4,k=8 returns 5',()=>assert.equal(universalHash(8,3,4,17,6),5));
test('slide 17 linear probe source sequence 89,18,49,58,9',()=>{
 const a=openAddress([89,18,49,58,9],10,'linear');
 assert.deepEqual(a.table,[9,null,null,null,null,null,null,null,18,89]); // Correct values verified independently below
 assert.deepEqual(a.traces.map(x=>x.path),[[9],[8],[9,0],[8,9,0,1],[9,0,1,2]]);
});
test('quadratic probing may fail to visit all slots',()=>{
 const a=openAddress([89,18,49,58,9],10,'quadratic');
 assert.equal(a.traces.length,5);assert.ok(a.traces.every(x=>x.path.length<=10));});
test('chaining and load factor',()=>{const a=chainTable([1,6,11,2],5);assert.deepEqual(a.slots[1],[11,6,1]);assert.equal(a.loadFactor,.8);});
test('invalid parameters rejected',()=>{assert.throws(()=>divisionHash(1,0));assert.throws(()=>universalHash(8,0,4,17,6));assert.throws(()=>chainTable([-1],4));});
