import {test} from 'node:test';import assert from 'node:assert/strict';import {roundTrend} from '../record_store/trend.mjs';
test('partial rounds carry unresolved results forward and later repairs clear them',()=>{
 assert.deepEqual(roundTrend([{cases:[{id:'a',status:'failed'},{id:'b',status:'error'},{id:'c',status:'blocked'}]},{cases:[{id:'a',status:'excluded'},{id:'b',status:'passed'}]},{cases:[{id:'a',status:'passed'},{id:'c',status:'passed'}]}]),[{round:1,failed:1,error:1,blocked:1},{round:2,failed:1,error:0,blocked:1},{round:3,failed:0,error:0,blocked:0}]);
 assert.deepEqual(roundTrend([]),[]);
});
