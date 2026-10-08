// Unreviewed cases own the repository. Opt-in cases declare every mutable shared
// resource; one browser profile is always exclusive, even for read-only UI cases.
export function caseLocks(c){
 if(c.meta.parallelSafe!==true)return ['*'];
 return [...new Set([...(c.meta.locks||[]),...(c.meta.surface==='gui'?['browser']:[])])];
}
export async function schedule(items,limit,locks,execute,cancelled=()=>false){
 const pending=[...items],active=new Map();let failure;
 while(pending.length||active.size){
  if(cancelled()||failure){for(const item of pending.splice(0)){item.status=cancelled()?'cancelled':'error';if(failure)item.error='Runner scheduling failed';}}
  while(pending.length&&active.size<limit){
   const held=[...active.values()].flatMap(v=>v.locks);
   const index=pending.findIndex((item,i)=>{
    const wanted=locks(item);
    // Do not move work across a pending exclusive case: mutation order matters.
    if(pending.slice(0,i).some(c=>locks(c).includes('*')))return false;
    return !active.size||(!wanted.includes('*')&&!held.includes('*')&&!wanted.some(k=>held.includes(k)));
   });
   if(index<0)break;
   const item=pending.splice(index,1)[0];
   const entry={locks:locks(item)};active.set(item,entry);
   entry.promise=Promise.resolve().then(()=>execute(item)).catch(e=>{item.status='error';item.error=e.message;failure??=e;}).finally(()=>active.delete(item));
  }
  if(active.size)await Promise.race([...active.values()].map(v=>v.promise));
 }
 if(failure)throw failure;
}
