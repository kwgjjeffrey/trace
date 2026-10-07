// The capability CLI launches the same shared workspace as trace.mjs app.
import {serve as serveWorkspace} from '../../catalog/scripts/http.mjs';
export function serve(p,port=53481){return serveWorkspace(p.repo,process.env.TRACE_CONFIG,port,p.index);}
