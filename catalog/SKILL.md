---
name: trace-catalog
description: Open a repository's trace operation catalog in a browser or an MCP Apps host.
---

Run `node <trace-skill>/trace.mjs app --repo <repo> --config <private-config>` to open the local catalog. Run `mcp` instead of `app` to serve the same operations over stdio MCP. In a connected MCP Apps host, call `trace_operations`.

Read entry descriptions and coverage before selecting an operation. Use the catalog to query recent traces, span chains, source locations and bounded performance samples. Open the returned Grafana link for a concrete trace.

A GUI locator is provided by the project. Set `TRACE_LOCATOR_URL` to its location endpoint when available; it receives an operation query parameter. Without it the catalog returns page/target metadata. Verify the actual target before claiming successful navigation. Command entries return the registered executable and arguments.
