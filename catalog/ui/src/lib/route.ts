export type Route={page:string;id:string|null;round:string|null};
export function readRoute(hash:string):Route {
 try {const url=new URL(hash.replace(/^#/, '')||'/performance','http://trace.local');const [page,id]=url.pathname.split('/').filter(Boolean);return {page:page==='cases'||page==='records'?page:'monitoring',id:id?decodeURIComponent(id):null,round:url.searchParams.get('round')};}
 catch{return {page:'monitoring',id:null,round:null};}
}
export function routeHash(page:string,id?:string|null,round?:string|null){return '#/'+(page==='monitoring'?'performance':page)+(id?'/'+encodeURIComponent(id):'')+(round?'?round='+encodeURIComponent(round):'');}
