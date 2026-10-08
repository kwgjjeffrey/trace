export function performanceSummary(item:{measurements?:any[];traces?:any[]}):Array<{name:string;source:string;samples:number[];count:number;statistic:string;durationMs:number}>;
export function casePerformanceP90(item:{traces?:any[]}):{durationMs:number;count:number}|null;
