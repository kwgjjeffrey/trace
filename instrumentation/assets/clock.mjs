export function estimate(t1,t2,t3,t4,upstream=0){if(![t1,t2,t3,t4,upstream].every(Number.isFinite)||t4<t1||t3<t2||upstream<0)return null;const rtt=t4-t1-t3+t2;if(rtt<0)return null;return {offsetMs:(t2-t1+t3-t4)/2,uncertaintyMs:rtt/2+upstream};}
export class CalibratedClock{
 constructor(probe){this.probe=probe;this.epoch=Date.now();this.tick=performance.now();this.sample=null;this.pending=null;}
 raw(){return this.epoch+performance.now()-this.tick;}
 quality(){const s=this.sample;if(!s||performance.now()-s.tick>300000||Math.abs(Date.now()-this.raw())>1000)return {quality:'uncalibrated',offsetMs:0};return {...s,quality:s.reference==='local'?'local_only':'estimated'};}
 now(){return this.raw()+this.quality().offsetMs;}
 async calibrate(){if(this.pending)return this.pending;this.pending=(async()=>{let best=null;for(let i=0;i<3;i++){const t1=this.raw();try{const c=await this.probe();const s=estimate(t1,c.receivedMs,c.sentMs,this.raw(),c.calibration?.uncertaintyMs||0);if(s&&(!best||s.uncertaintyMs<best.uncertaintyMs))best={...s,reference:c.reference};}catch{}}if(best)this.sample={...best,tick:performance.now()};return this.quality();})();try{return await this.pending;}finally{this.pending=null;}}
 start(){void this.calibrate();this.timer=setInterval(()=>void this.calibrate(),240000);return ()=>clearInterval(this.timer);}
}
