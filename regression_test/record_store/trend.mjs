// Carry the last observed result forward: partial reruns must not erase unresolved cases.
export function roundTrend(rounds){
 const latest=new Map();
 return rounds.map((round,index)=>{
  for(const item of round.cases||[])if(!['excluded','pending','running'].includes(item.status))latest.set(item.id,item.status);
  const counts={failed:0,error:0,blocked:0};
  for(const status of latest.values())if(status in counts)counts[status]++;
  return {round:round.roundNumber||index+1,...counts};
 });
}
