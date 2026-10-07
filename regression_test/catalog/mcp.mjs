import {serve} from '../../catalog/scripts/mcp.mjs';
await serve(process.argv[2],process.env.TRACE_CONFIG);
