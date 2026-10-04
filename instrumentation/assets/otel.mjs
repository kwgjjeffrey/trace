import {context,trace,SpanStatusCode,propagation} from '@opentelemetry/api';
// The owning service initializes an official SDK/exporter. This adapter contains no credentials.
export function beginOperation(registry,id,parent=context.active()){
 const definition=registry.operations.find(o=>o.id===id);if(!definition)throw Error('Unregistered trace operation: '+id);
 const upstream=propagation.getBaggage(parent)?.getEntry('trace.entry.id')?.value;
 const entry=upstream||id;
 const cx=propagation.setBaggage(parent,propagation.createBaggage({'trace.entry.id':{value:entry}}));
 const span=trace.getTracer('trace.operations').startSpan(id,{attributes:{'trace.entry.id':entry,'trace.operation.id':id,'trace.registry.digest':registry.digest,'code.file.path':definition.source.path,'code.function.name':definition.source.function,'code.revision':registry.revision||'unknown'}},cx);
 const active=trace.setSpan(cx,span);let ended=false;
 return {span,context:active,run:fn=>context.with(active,fn),headers:()=>{const carrier={};propagation.inject(active,carrier);return carrier;},finish:outcome=>{if(ended)return;ended=true;span.setAttribute('trace.outcome',outcome);if(outcome==='failure')span.setStatus({code:SpanStatusCode.ERROR});span.end();}};
}
