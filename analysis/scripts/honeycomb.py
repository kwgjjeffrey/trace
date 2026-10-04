#!/usr/bin/env python3
"""Read-only Honeycomb MCP adapter using the official MCP Python SDK."""
import argparse
import asyncio
import json
import os
import pathlib
import sys

READ_TOOLS = {"get_workspace_context", "get_environment", "get_dataset", "get_dataset_columns", "find_columns", "list_spans", "get_span_details", "get_trace", "run_query", "get_query_results", "run_bubbleup", "get_triggers", "list_boards"}
async def call(tool, arguments, credentials):
    from mcp import ClientSession
    from mcp.client.streamable_http import streamablehttp_client
    path=pathlib.Path(credentials).expanduser()
    if os.name != "nt" and path.stat().st_mode & 0o077:
        raise ValueError("Credential file must be private (0600)")
    config=json.loads(path.read_text())
    headers={"Authorization": "Bearer "+config["key_id"]+":"+config["secret"]}
    async with streamablehttp_client(config.get("mcp_endpoint", "https://mcp.honeycomb.io/mcp"), headers=headers) as (read, write, _):
        async with ClientSession(read,write) as session:
            await session.initialize()
            result=await session.call_tool(tool,arguments)
            return result.model_dump(mode="json",exclude_none=True)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--credentials", default=os.environ.get("TRACE_HONEYCOMB_CREDENTIALS"))
    sub=parser.add_subparsers(dest="command",required=True)
    sub.add_parser("context")
    for command in ("spans","trace"):
        p=sub.add_parser(command)
        if command=="trace":p.add_argument("trace_id")
        p.add_argument("--environment",default="test")
        p.add_argument("--from",dest="start",default="-2h")
    p=sub.add_parser("call");p.add_argument("tool",choices=sorted(READ_TOOLS));p.add_argument("--arguments-file",required=True)
    args=parser.parse_args()
    if not args.credentials:parser.error("--credentials or TRACE_HONEYCOMB_CREDENTIALS is required")
    if args.command=="context":tool,arguments="get_workspace_context",{}
    elif args.command=="call":tool,arguments=args.tool,json.loads(pathlib.Path(args.arguments_file).read_text())
    else:
        tool="get_trace" if args.command=="trace" else "list_spans"
        arguments={"environment_slug":args.environment,"from":args.start}
        if args.command=="trace":arguments.update(trace_id=args.trace_id,view_mode="full",show_events=True)
    try:
        result=asyncio.run(asyncio.wait_for(call(tool,arguments,args.credentials),timeout=60))
    except Exception as error:
        # SDK exceptions may contain request details. Never echo credential-bearing diagnostics.
        print(json.dumps({"ok":False,"error_type":type(error).__name__}),file=sys.stderr)
        return 1
    print(json.dumps(result,ensure_ascii=False,indent=2))
    return 1 if result.get("isError") else 0
if __name__=="__main__":raise SystemExit(main())
