import test from 'node:test';import assert from 'node:assert/strict';import {operationSamples} from '../telemetry/collector.mjs';
test('registered terminal root is the sample, nested/async span durations are not added',()=>{
 const attrs={'trace.entry.id':'messages.send','colab.operation':'messages.send','colab.origin':'gui','colab.phase':'message.rendered'};
 const t={traceId:'1'.repeat(32),grafanaUrl:'https://example.test/trace',spans:[{id:'root',name:'colab.messages.send',durationMs:120,attributes:attrs},{id:'http',parentId:'root',durationMs:90,attributes:{...attrs,'colab.operation':'http.request'}},{id:'async',durationMs:900,attributes:{...attrs,'colab.operation':'agent.result.presented'}},{id:'unregistered',durationMs:50,attributes:{...attrs,'trace.entry.id':'unknown','colab.operation':'unknown'}}]};
 const samples=operationSamples(t,[{id:'messages.send',entry:{kind:'gui'},source:{path:'send.ts',function:'send'}}],{operationAttribute:'colab.operation',phaseAttribute:'colab.phase',originAttribute:'colab.origin',originValues:{gui:'gui'}});assert.equal(samples.length,1);assert.equal(samples[0].durationMs,120);assert.equal(samples[0].boundary,'operation-end-to-end');assert.equal(samples[0].spans.length,4);
});
test('unfinished and wrong terminal-origin spans do not become operation samples',()=>{const t={spans:[{id:'a',durationMs:2,attributes:{'trace.entry.id':'open','colab.operation':'open','colab.origin':'gui'}}]};assert.deepEqual(operationSamples(t,[{id:'open',entry:{kind:'gui'}}]),[]);});
import {evaluatePerformance} from '../telemetry/assertions.mjs';
test('performance assertions reuse registered trace samples and never accept local timers',()=>{
 const checks=[{name:'Send performance',entryId:'messages.send',maximumMs:100}];assert.equal(evaluatePerformance(checks,[])[0].state,'inconclusive');
 const result=evaluatePerformance(checks,[{entryId:'messages.send',boundary:'operation-end-to-end',durationMs:120,traceId:'x'},{entryId:'other',boundary:'operation-end-to-end',durationMs:1}])[0];assert.equal(result.passed,false);assert.equal(result.actual,120);assert.equal(result.boundary,'provider trace');
});

test('standard Trace attributes work without any project-specific vocabulary',()=>{const rows=operationSamples({traceId:'t',spans:[{id:'root',durationMs:10,attributes:{'trace.entry.id':'open','trace.operation.id':'open','trace.outcome':'success'}}]},[{id:'open',entry:{kind:'gui'}}]);assert.equal(rows[0].durationMs,10);});
