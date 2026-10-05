---
name: trace-catalog
description: Open a repository trace operation catalog with provider percentiles and real interface previews.
---

Run `node <this-skill>/trace.mjs app --repo <repo> --config <protected-config>`. Open the printed URL. For MCP hosts, use the `mcp` command with the same repository and configuration.

Select an operation card. The left list shows its ID, description, source path and available Grafana P50/P90/P95 for matching root spans over the last hour. Missing provider percentiles are omitted; no data and query failure are distinguished. The right header shows source and a Grafana Drilldown link carrying that operation filter; the body previews its real GUI or displays its registered command. Trace and span inspection belong in Grafana or the analysis Skill.

For an embedded project GUI, set `TRACE_LOCATOR_EMBED_URL` to the project's adapter URL and `TRACE_LOCATOR_URL` to its standalone fallback. The adapter must accept the configured catalog origin and the `trace.locate` message from its parent. Repeated selections preserve GUI state. Navigation must never execute the target business action.

Provider configuration defaults to `trace.entry.id`. For existing projects with other attributes, set `operationAttribute` and optionally `originAttribute` in the protected Grafana configuration. These apply equally to percentile queries and Drilldown links.
