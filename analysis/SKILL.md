---
name: trace-analysis
description: Trace analysis workflows for a registered repository.
---

# Analysis

Get operations first and select by description and completion boundary. Query executions for the chosen ID and time range, then inspect a concrete trace. Compare root duration, outcome, child paths, retries and return phase; separate missing instrumentation from failed business delivery. Performance output is a bounded sample summary and must not be described as exhaustive p95/p99 or throughput. For production population statistics, configure span-derived metrics and query that backend.

Source locations resolve from span attributes against the configured repo. Check code.revision before applying fixes. Do not silently navigate to current line numbers for an older revision. Legacy spans lacking source or entry IDs are reported as such; operation-level source is a fallback, not exact span attribution.

Respect clock quality/uncertainty. Single-host monotonic durations are reliable; cross-host timestamp gaps within uncertainty cannot establish order or network latency. Use parent relationships to establish causality.

For Honeycomb, use `python analysis/scripts/honeycomb.py --credentials <private-file> context` and then trace/spans or a bounded allowlisted call. Install the official MCP dependency from analysis/scripts/requirements.txt in a dedicated environment. No project or credentials path is inferred.

For prompt engineering review, run `prompts --id <trace-id>` to list captured assemblies with kind/stage/template/source and truncation/redaction flags. Then `prompts --id <trace-id> --span <span-id>` returns that one payload. Compare actual-dispatch assembly with previews; previews do not prove what the runtime received. Never claim a truncated capture is the complete instruction. Default analysis should not flood the Agent context with every prompt.

Trace output lists inclusive boundaries per service and orders spans by parent links. A layer duration includes downstream waiting; never sum nested layers or overlapping requests as total latency. Missing parents remain explicit.

Use `operation_metrics --operation <id>` for Grafana-computed root span P50/P90/P95 over the last hour and the matching Drilldown URL. Missing percentiles remain null. This differs from the bounded trace-envelope summary returned by `performance`; do not equate the two populations.
